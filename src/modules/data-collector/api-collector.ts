import { 
  APICollector, 
  CollectorConfig, 
  CollectorStatus, 
  CollectorError 
} from './collector-interface'
import { PriceRecord, Supplier, Ingredient } from '@/types'

interface APIEndpoint {
  url: string
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  params?: Record<string, any>
  auth?: {
    type: 'bearer' | 'apikey' | 'basic'
    token: string
  }
}

interface APIMapping {
  supplier_id: string
  endpoint: APIEndpoint
  responseMapping: {
    items: string // JSON path to items array
    itemName: string
    price: string
    unit?: string
    quality?: string
    lastUpdated?: string
  }
}

export class APICollectorImpl implements APICollector {
  private config: CollectorConfig
  private status: CollectorStatus
  private errors: CollectorError[] = []
  private apiMappings: Map<string, APIMapping> = new Map()

  constructor(config: Partial<CollectorConfig> = {}) {
    this.config = {
      interval: 30, // 30분마다
      timeout: 30, // 30초 타임아웃
      retryCount: 3,
      headers: {
        'User-Agent': 'CostScanner/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      ...config,
    }

    this.status = {
      isRunning: false,
      successRate: 0,
      errorCount: 0,
      errors: [],
    }

    this.initializeAPIMappings()
  }

  private initializeAPIMappings(): void {
    // 농협 하나로클럽 API (가상)
    this.apiMappings.set('550e8400-e29b-41d4-a716-446655440007', {
      supplier_id: '550e8400-e29b-41d4-a716-446655440007',
      endpoint: {
        url: 'https://api.nonghyup.com/v1/products/prices',
        method: 'GET',
        headers: {
          'X-API-Key': process.env.NONGHYUP_API_KEY || 'demo-key'
        }
      },
      responseMapping: {
        items: 'data.products',
        itemName: 'name',
        price: 'price',
        unit: 'unit',
        quality: 'grade',
        lastUpdated: 'updatedAt'
      }
    })

    // 이마트 트레이더스 API (가상)
    this.apiMappings.set('550e8400-e29b-41d4-a716-446655440005', {
      supplier_id: '550e8400-e29b-41d4-a716-446655440005',
      endpoint: {
        url: 'https://api.emart.com/trader/v2/prices',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EMART_API_TOKEN || 'demo-token'}`
        },
        params: {
          category: 'food',
          includeStock: true
        }
      },
      responseMapping: {
        items: 'result.items',
        itemName: 'productName',
        price: 'salePrice',
        unit: 'salesUnit',
        quality: 'quality'
      }
    })

    // 공공데이터포털 농수산물 가격 API (실제 존재)
    this.apiMappings.set('public-data-portal', {
      supplier_id: 'public-data-portal',
      endpoint: {
        url: 'http://apis.data.go.kr/1360000/AgriculturalObservationInfoService/getAgriculturalObservationInfo',
        method: 'GET',
        params: {
          serviceKey: process.env.PUBLIC_DATA_API_KEY || 'demo-key',
          numOfRows: 100,
          dataType: 'JSON'
        }
      },
      responseMapping: {
        items: 'response.body.items.item',
        itemName: 'productName',
        price: 'price',
        unit: 'unit'
      }
    })
  }

  async collectPrices(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    this.status.isRunning = true
    const results: PriceRecord[] = []

    try {
      const mapping = this.apiMappings.get(supplier.id)
      if (!mapping) {
        throw new Error(`API 매핑이 없는 공급업체: ${supplier.name}`)
      }

      const apiData = await this.fetchFromAPI(mapping.endpoint.url, mapping.endpoint.params)
      const priceRecords = await this.transformAPIResponse(apiData, mapping, supplier, ingredients)
      
      results.push(...priceRecords)
      this.updateSuccessRate(true)
      
    } catch (error) {
      this.handleError(error, supplier.name)
      this.updateSuccessRate(false)
    } finally {
      this.status.isRunning = false
    }

    return results
  }

  async fetchFromAPI(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
      let url = endpoint
      let requestOptions: RequestInit = {
        headers: this.config.headers,
        signal: AbortSignal.timeout(this.config.timeout * 1000)
      }

      // URL 파라미터 처리
      if (params) {
        const urlParams = new URLSearchParams(params)
        url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${urlParams}`
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`API 요청 타임아웃: ${endpoint}`)
      }
      throw error
    }
  }

  async transformAPIResponse(
    response: any, 
    mapping: APIMapping,
    supplier: Supplier,
    targetIngredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    const results: PriceRecord[] = []

    try {
      // JSON path를 사용하여 items 배열 추출
      const items = this.getNestedValue(response, mapping.responseMapping.items)
      
      if (!Array.isArray(items)) {
        throw new Error('API 응답에서 items 배열을 찾을 수 없습니다')
      }

      for (const item of items) {
        try {
          const itemName = this.getNestedValue(item, mapping.responseMapping.itemName)
          const price = parseFloat(this.getNestedValue(item, mapping.responseMapping.price) || '0')
          const unit = this.getNestedValue(item, mapping.responseMapping.unit || '') || '개'
          const quality = this.getNestedValue(item, mapping.responseMapping.quality || '')
          const lastUpdated = this.getNestedValue(item, mapping.responseMapping.lastUpdated || '')

          if (!itemName || price <= 0) {
            continue
          }

          // 목표 식자재와 매칭
          const matchedIngredient = this.findMatchingIngredient(itemName, targetIngredients)
          
          if (matchedIngredient) {
            const priceRecord: PriceRecord = {
              id: this.generateId(),
              ingredient_id: matchedIngredient.id,
              supplier_id: supplier.id,
              price,
              unit,
              source: 'api',
              quality_grade: quality,
              notes: `API 수집: ${supplier.name}`,
              scraped_at: lastUpdated ? new Date(lastUpdated).toISOString() : new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            results.push(priceRecord)
          }
        } catch (itemError) {
          console.warn('개별 아이템 처리 실패:', itemError)
          continue
        }
      }

    } catch (error) {
      throw new Error(`API 응답 변환 실패: ${error}`)
    }

    return results
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }

  private findMatchingIngredient(itemName: string, ingredients: Ingredient[]): Ingredient | null {
    const cleanItemName = itemName.toLowerCase().trim()
    
    // 정확한 매칭
    for (const ingredient of ingredients) {
      if (ingredient.name.toLowerCase() === cleanItemName) {
        return ingredient
      }
    }

    // 부분 매칭
    for (const ingredient of ingredients) {
      const ingredientName = ingredient.name.toLowerCase()
      if (cleanItemName.includes(ingredientName) || ingredientName.includes(cleanItemName)) {
        return ingredient
      }
    }

    // 키워드 매칭
    const itemKeywords = cleanItemName.split(/\s+/)
    for (const ingredient of ingredients) {
      const ingredientKeywords = ingredient.name.toLowerCase().split(/\s+/)
      const matchCount = itemKeywords.filter(k => 
        ingredientKeywords.some(ik => k.includes(ik) || ik.includes(k))
      ).length

      if (matchCount >= Math.min(2, itemKeywords.length)) {
        return ingredient
      }
    }

    return null
  }

  // 특정 공급업체의 모든 가격 정보 수집
  async collectAllPrices(supplierId: string): Promise<any> {
    const mapping = this.apiMappings.get(supplierId)
    if (!mapping) {
      throw new Error(`공급업체 API 매핑 없음: ${supplierId}`)
    }

    return await this.fetchFromAPI(mapping.endpoint.url, mapping.endpoint.params)
  }

  // API 상태 확인
  async checkAPIHealth(supplierId: string): Promise<boolean> {
    try {
      const mapping = this.apiMappings.get(supplierId)
      if (!mapping) return false

      // 간단한 health check 요청
      const response = await fetch(mapping.endpoint.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000) // 10초 타임아웃
      })

      return response.ok
    } catch {
      return false
    }
  }

  async validateData(data: PriceRecord[]): Promise<PriceRecord[]> {
    return data.filter(record => {
      // 기본 검증
      if (record.price <= 0) return false
      if (!record.unit) return false
      
      // API 데이터 특별 검증
      if (record.price > 1000000) return false // 너무 높은 가격
      if (record.unit && record.unit.length > 10) return false // 단위가 너무 긴 경우
      
      return true
    })
  }

  async getStatus(): Promise<CollectorStatus> {
    return {
      ...this.status,
      errors: this.errors.slice(-10),
    }
  }

  configure(config: CollectorConfig): void {
    this.config = { ...this.config, ...config }
  }

  // API 매핑 추가/수정
  addAPIMapping(supplierId: string, mapping: Omit<APIMapping, 'supplier_id'>): void {
    this.apiMappings.set(supplierId, {
      ...mapping,
      supplier_id: supplierId
    })
  }

  // 모든 API 상태 체크
  async checkAllAPIsHealth(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()
    
    for (const [supplierId] of Array.from(this.apiMappings.keys()).map(key => [key])) {
      const isHealthy = await this.checkAPIHealth(supplierId)
      results.set(supplierId, isHealthy)
    }
    
    return results
  }

  private updateSuccessRate(success: boolean): void {
    const totalAttempts = this.status.errorCount + (this.status.successRate * 100) + 1
    const successfulAttempts = success ? 
      (this.status.successRate * (totalAttempts - 1)) + 1 :
      (this.status.successRate * (totalAttempts - 1))
    
    this.status.successRate = successfulAttempts / totalAttempts
  }

  private handleError(error: any, context: string): void {
    const errorObj: CollectorError = {
      timestamp: new Date(),
      message: error.message || error.toString(),
      supplier: context,
      stack: error.stack,
    }

    this.errors.push(errorObj)
    this.status.errorCount++

    console.error(`API 수집 오류 [${context}]:`, error)
  }

  private generateId(): string {
    return `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}