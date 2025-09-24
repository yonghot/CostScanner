// TODO: 향후 구현 예정 - puppeteer를 사용한 웹 스크래핑 기능
// 필요시 'npm install puppeteer' 실행 후 아래 주석 해제
// import puppeteer, { Browser, Page } from 'puppeteer'

// 임시 스텁 타입 정의 (puppeteer 설치 전까지 사용)
type Page = any
const puppeteer = {
  launch: async (options?: any) => ({
    newPage: async () => null,
    close: async () => {}
  })
}
import { 
  WebScrapingCollector, 
  CollectorConfig, 
  CollectorStatus, 
  CollectorError,
  ScrapingSelectors,
  ScrapedData 
} from './collector-interface'
import { PriceRecord, Supplier, Ingredient } from '@/types'

export class WebScrapingCollectorImpl implements WebScrapingCollector {
  private browser: any | null = null // Browser type from puppeteer
  private config: CollectorConfig
  private status: CollectorStatus
  private errors: CollectorError[] = []

  constructor(config: Partial<CollectorConfig> = {}) {
    this.config = {
      interval: 60, // 1시간
      timeout: 30, // 30초
      retryCount: 3,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      headers: {
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
      },
      ...config,
    }

    this.status = {
      isRunning: false,
      successRate: 0,
      errorCount: 0,
      errors: [],
    }
  }

  async initializeBrowser(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      })
    } catch (error) {
      throw new Error(`브라우저 초기화 실패: ${error}`)
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  async collectPrices(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    this.status.isRunning = true
    const results: PriceRecord[] = []

    try {
      if (!this.browser) {
        await this.initializeBrowser()
      }

      // 공급업체별 스크래핑 로직 분기
      switch (supplier.name.toLowerCase()) {
        case '마켓컬리':
          return await this.scrapeMarketKurly(supplier, ingredients)
        case '쿠팡':
          return await this.scrapeCoupang(supplier, ingredients)
        case 'G마켓':
          return await this.scrapeGmarket(supplier, ingredients)
        default:
          return await this.scrapeGeneric(supplier, ingredients)
      }
    } catch (error) {
      this.handleError(error, supplier.name)
      return []
    } finally {
      this.status.isRunning = false
    }
  }

  async scrapePage(
    url: string, 
    selectors: ScrapingSelectors
  ): Promise<ScrapedData[]> {
    if (!this.browser) {
      throw new Error('브라우저가 초기화되지 않았습니다.')
    }

    const page = await this.browser.newPage()
    const results: ScrapedData[] = []

    try {
      await this.setupPage(page)
      await page.goto(url, { waitUntil: 'networkidle2', timeout: this.config.timeout * 1000 })

      // 페이지에서 상품 데이터 추출
      const products = await page.evaluate((sel: any) => {
        const items = document.querySelectorAll(sel.itemName)
        const data: any[] = []

        items.forEach((item, index) => {
          try {
            const nameEl = item.querySelector(sel.itemName) || item
            const priceEl = document.querySelectorAll(sel.price)[index]
            const unitEl = sel.unit ? document.querySelectorAll(sel.unit)[index] : null
            const supplierEl = sel.supplier ? document.querySelectorAll(sel.supplier)[index] : null

            if (nameEl && priceEl) {
              const name = nameEl.textContent?.trim() || ''
              const priceText = priceEl.textContent?.trim() || ''
              const price = this.extractPrice(priceText)

              if (name && price > 0) {
                data.push({
                  itemName: name,
                  price,
                  unit: unitEl?.textContent?.trim() || '',
                  supplier: supplierEl?.textContent?.trim() || '',
                  quality: '',
                })
              }
            }
          } catch (err) {
            // 상품 데이터 추출 실패 - 로거로 대체 필요
          }
        })

        return data
      }, selectors)

      // 결과 변환
      products.forEach((product: any) => {
        results.push({
          ...product,
          url,
          scrapedAt: new Date(),
        })
      })

    } catch (error) {
      this.handleError(error, url)
    } finally {
      await page.close()
    }

    return results
  }

  private async scrapeMarketKurly(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    const results: PriceRecord[] = []
    
    for (const ingredient of ingredients) {
      try {
        const searchUrl = `https://www.kurly.com/search?sword=${encodeURIComponent(ingredient.name)}`
        
        const selectors: ScrapingSelectors = {
          itemName: '.product-name',
          price: '.price',
          unit: '.unit',
          supplier: '.seller',
        }

        const scrapedData = await this.scrapePage(searchUrl, selectors)
        
        for (const data of scrapedData) {
          if (this.isRelevantProduct(data.itemName, ingredient.name)) {
            results.push({
              id: this.generateId(),
              ingredient_id: ingredient.id,
              supplier_id: supplier.id,
              price: data.price,
              unit: data.unit || ingredient.unit,
              source: 'scraping',
              quality_grade: data.quality,
              notes: `스크래핑: ${data.url}`,
              scraped_at: data.scrapedAt.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        this.handleError(error, `마켓컬리 - ${ingredient.name}`)
      }
    }

    return results
  }

  private async scrapeCoupang(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    const results: PriceRecord[] = []
    
    for (const ingredient of ingredients) {
      try {
        const searchUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(ingredient.name)}`
        
        const selectors: ScrapingSelectors = {
          itemName: '.name',
          price: '.price-value',
          unit: '.unit-text',
        }

        const scrapedData = await this.scrapePage(searchUrl, selectors)
        
        for (const data of scrapedData) {
          if (this.isRelevantProduct(data.itemName, ingredient.name)) {
            results.push({
              id: this.generateId(),
              ingredient_id: ingredient.id,
              supplier_id: supplier.id,
              price: data.price,
              unit: data.unit || ingredient.unit,
              source: 'scraping',
              notes: `스크래핑: ${data.url}`,
              scraped_at: data.scrapedAt.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        this.handleError(error, `쿠팡 - ${ingredient.name}`)
      }
    }

    return results
  }

  private async scrapeGmarket(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    const results: PriceRecord[] = []
    
    for (const ingredient of ingredients) {
      try {
        const searchUrl = `https://browse.gmarket.co.kr/search?keyword=${encodeURIComponent(ingredient.name)}`
        
        const selectors: ScrapingSelectors = {
          itemName: '.itemname',
          price: '.s-price strong',
          unit: '.unit-info',
        }

        const scrapedData = await this.scrapePage(searchUrl, selectors)
        
        for (const data of scrapedData) {
          if (this.isRelevantProduct(data.itemName, ingredient.name)) {
            results.push({
              id: this.generateId(),
              ingredient_id: ingredient.id,
              supplier_id: supplier.id,
              price: data.price,
              unit: data.unit || ingredient.unit,
              source: 'scraping',
              notes: `스크래핑: ${data.url}`,
              scraped_at: data.scrapedAt.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        this.handleError(error, `G마켓 - ${ingredient.name}`)
      }
    }

    return results
  }

  private async scrapeGeneric(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    // 일반적인 스크래핑 로직 구현
    // supplier.website 정보를 활용하여 스크래핑
    return []
  }

  async validateData(data: PriceRecord[]): Promise<PriceRecord[]> {
    return data.filter(record => {
      // 가격 검증
      if (record.price <= 0) return false
      
      // 단위 검증
      if (!record.unit || record.unit.trim() === '') return false
      
      // 이상치 검증 (너무 높거나 낮은 가격)
      if (record.price > 1000000 || record.price < 1) return false
      
      return true
    })
  }

  async getStatus(): Promise<CollectorStatus> {
    return {
      ...this.status,
      errors: this.errors.slice(-10), // 최근 10개 에러만
    }
  }

  configure(config: CollectorConfig): void {
    this.config = { ...this.config, ...config }
  }

  private async setupPage(page: Page): Promise<void> {
    // 기본 설정
    await page.setUserAgent(this.config.userAgent || '')
    
    if (this.config.headers) {
      await page.setExtraHTTPHeaders(this.config.headers)
    }

    // 뷰포트 설정
    await page.setViewport({ width: 1920, height: 1080 })

    // 불필요한 리소스 차단
    await page.setRequestInterception(true)
    page.on('request', (req: any) => {
      const resourceType = req.resourceType()
      if (['stylesheet', 'image', 'font'].includes(resourceType)) {
        req.abort()
      } else {
        req.continue()
      }
    })
  }

  private extractPrice(priceText: string): number {
    // 가격 텍스트에서 숫자만 추출
    const cleanPrice = priceText.replace(/[^\d]/g, '')
    return parseInt(cleanPrice, 10) || 0
  }

  private isRelevantProduct(productName: string, targetName: string): boolean {
    // 상품명과 검색 키워드의 유사도 검사
    const productWords = productName.toLowerCase().split(/\s+/)
    const targetWords = targetName.toLowerCase().split(/\s+/)
    
    let matchCount = 0
    targetWords.forEach(word => {
      if (productWords.some(pWord => pWord.includes(word) || word.includes(pWord))) {
        matchCount++
      }
    })
    
    return matchCount >= Math.min(2, targetWords.length)
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

    // 스크래핑 오류 로깅은 프로덕션 로거로 대체 필요
  }

  private generateId(): string {
    return `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}