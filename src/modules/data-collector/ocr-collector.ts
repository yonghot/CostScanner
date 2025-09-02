import { createWorker } from 'tesseract.js'
import { 
  OCRCollector, 
  CollectorConfig, 
  CollectorStatus, 
  CollectorError,
  ParsedInvoiceData 
} from './collector-interface'
import { PriceRecord, Supplier, Ingredient } from '@/types'

export class OCRCollectorImpl implements OCRCollector {
  private config: CollectorConfig
  private status: CollectorStatus
  private errors: CollectorError[] = []
  private worker: any = null

  constructor(config: Partial<CollectorConfig> = {}) {
    this.config = {
      interval: 0, // OCR은 주기적 실행 안함
      timeout: 60, // OCR 처리 시간 60초
      retryCount: 2,
      ...config,
    }

    this.status = {
      isRunning: false,
      successRate: 0,
      errorCount: 0,
      errors: [],
    }
  }

  async collectPrices(
    supplier: Supplier, 
    ingredients: Ingredient[]
  ): Promise<PriceRecord[]> {
    throw new Error('OCR 수집기는 collectPrices를 지원하지 않습니다. extractText 메서드를 사용하세요.')
  }

  async extractText(imagePath: string): Promise<string> {
    this.status.isRunning = true

    try {
      // Tesseract.js 워커 초기화
      if (!this.worker) {
        this.worker = await createWorker('kor+eng')
      }

      const { data } = await this.worker.recognize(imagePath)
      return data.text
    } catch (error) {
      this.handleError(error, imagePath)
      throw error
    } finally {
      this.status.isRunning = false
    }
  }

  async parseInvoice(text: string): Promise<ParsedInvoiceData[]> {
    const results: ParsedInvoiceData[] = []

    try {
      // 한국어 거래명세서 패턴 분석
      const lines = text.split('\n').filter(line => line.trim().length > 0)
      
      for (const line of lines) {
        const parsed = this.parseInvoiceLine(line)
        if (parsed) {
          results.push(parsed)
        }
      }

      return results
    } catch (error) {
      this.handleError(error, 'Invoice parsing')
      return []
    }
  }

  private parseInvoiceLine(line: string): ParsedInvoiceData | null {
    // 다양한 거래명세서 패턴 처리
    const patterns = [
      // 패턴 1: "품목명 수량 단위 단가 금액"
      /^(.+?)\s+(\d+(?:\.\d+)?)\s*([가-힣a-zA-Z]+)\s+(\d+(?:,\d+)?)\s+(\d+(?:,\d+)?)$/,
      
      // 패턴 2: "품목명 단가 x 수량 = 금액"
      /^(.+?)\s+(\d+(?:,\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:,\d+)?)$/,
      
      // 패턴 3: "품목명 (단위) 수량개 단가원"
      /^(.+?)\s*\(([가-힣a-zA-Z]+)\)\s*(\d+(?:\.\d+)?)[개]?\s*(\d+(?:,\d+)?)[원]?$/,
    ]

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const match = line.match(pattern)
      
      if (match) {
        try {
          let itemName: string
          let quantity: number
          let unit: string
          let price: number
          let totalAmount: number

          switch (i) {
            case 0: // 패턴 1
              let [, itemName0, quantityStr0, unitStr0, priceStr0, totalAmountStr0] = match
              itemName = itemName0
              quantity = parseFloat(quantityStr0.toString())
              unit = unitStr0
              price = parseInt(priceStr0.toString().replace(/,/g, ''))
              totalAmount = parseInt(totalAmountStr0.toString().replace(/,/g, ''))
              break
              
            case 1: // 패턴 2
              let [, itemName1, priceStr1, quantityStr1, totalAmountStr1] = match
              itemName = itemName1
              price = parseInt(priceStr1.toString().replace(/,/g, ''))
              quantity = parseFloat(quantityStr1.toString())
              totalAmount = parseInt(totalAmountStr1.toString().replace(/,/g, ''))
              unit = '개' // 기본 단위
              break
              
            case 2: // 패턴 3
              let [, itemName2, unitStr2, quantityStr2, priceStr2] = match
              itemName = itemName2
              unit = unitStr2
              quantity = parseFloat(quantityStr2.toString())
              price = parseInt(priceStr2.toString().replace(/,/g, ''))
              totalAmount = quantity * price
              break
              
            default:
              continue
          }

          // 데이터 검증
          if (itemName.length > 1 && quantity > 0 && price > 0) {
            return {
              itemName: itemName.trim(),
              quantity,
              unit: unit || '개',
              price,
              totalAmount,
              confidence: this.calculateConfidence(line, match)
            }
          }
        } catch (error) {
          // 파싱 실패 시 다음 패턴 시도
          continue
        }
      }
    }

    return null
  }

  private calculateConfidence(originalLine: string, match: RegExpMatchArray): number {
    // OCR 정확도를 추정하는 간단한 방법
    const hasNumbers = /\d/.test(originalLine)
    const hasKorean = /[가-힣]/.test(originalLine)
    const hasCommaInNumbers = /\d+,\d+/.test(originalLine)
    
    let confidence = 0.5 // 기본 신뢰도

    if (hasNumbers) confidence += 0.2
    if (hasKorean) confidence += 0.1
    if (hasCommaInNumbers) confidence += 0.1
    if (match[0].length > originalLine.length * 0.8) confidence += 0.1

    return Math.min(confidence, 1.0)
  }

  // 이미지 전처리 (품질 향상을 위함)
  async preprocessImage(imagePath: string): Promise<string> {
    // 이미지 전처리 로직
    // 실제 구현에서는 sharp나 jimp 등을 사용하여 이미지 품질 향상
    return imagePath
  }

  // 특정 식자재 키워드 매칭
  findMatchingIngredient(itemName: string, ingredients: Ingredient[]): Ingredient | null {
    const cleanItemName = itemName.replace(/[()[\]]/g, '').trim()
    
    // 정확히 일치하는 항목 찾기
    for (const ingredient of ingredients) {
      if (ingredient.name === cleanItemName) {
        return ingredient
      }
    }

    // 부분 일치 항목 찾기
    for (const ingredient of ingredients) {
      if (cleanItemName.includes(ingredient.name) || ingredient.name.includes(cleanItemName)) {
        return ingredient
      }
    }

    // 키워드 기반 매칭
    const keywords = cleanItemName.split(/\s+/)
    for (const ingredient of ingredients) {
      const ingredientKeywords = ingredient.name.split(/\s+/)
      const matchCount = keywords.filter(k => 
        ingredientKeywords.some(ik => k.includes(ik) || ik.includes(k))
      ).length

      if (matchCount >= Math.min(2, keywords.length)) {
        return ingredient
      }
    }

    return null
  }

  async validateData(data: PriceRecord[]): Promise<PriceRecord[]> {
    return data.filter(record => {
      // OCR 데이터 특별 검증
      if (record.price <= 0) return false
      if (!record.unit) return false
      
      // OCR 신뢰도가 너무 낮으면 제외
      const confidence = parseFloat(record.notes?.match(/confidence:(\d+\.?\d*)/)?.[1] || '0')
      if (confidence < 0.5) return false
      
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

  private handleError(error: any, context: string): void {
    const errorObj: CollectorError = {
      timestamp: new Date(),
      message: error.message || error.toString(),
      supplier: context,
      stack: error.stack,
    }

    this.errors.push(errorObj)
    this.status.errorCount++

    console.error(`OCR 오류 [${context}]:`, error)
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}