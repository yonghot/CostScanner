import { PriceRecord, Supplier, Ingredient } from '@/types'

// 데이터 수집기 인터페이스
export interface DataCollector {
  /**
   * 특정 공급업체에서 식자재 가격 정보를 수집
   */
  collectPrices(supplier: Supplier, ingredients: Ingredient[]): Promise<PriceRecord[]>
  
  /**
   * 수집된 데이터의 유효성 검증
   */
  validateData(data: PriceRecord[]): Promise<PriceRecord[]>
  
  /**
   * 수집기 상태 확인
   */
  getStatus(): Promise<CollectorStatus>
  
  /**
   * 수집기 설정
   */
  configure(config: CollectorConfig): void
}

// 수집기 상태
export interface CollectorStatus {
  isRunning: boolean
  lastRunAt?: Date
  successRate: number
  errorCount: number
  errors: CollectorError[]
}

// 수집기 설정
export interface CollectorConfig {
  interval: number // 수집 주기 (분)
  timeout: number // 타임아웃 (초)
  retryCount: number // 재시도 횟수
  userAgent?: string
  headers?: Record<string, string>
}

// 수집기 에러
export interface CollectorError {
  timestamp: Date
  message: string
  supplier?: string
  ingredient?: string
  stack?: string
}

// 웹 스크래핑 수집기 인터페이스
export interface WebScrapingCollector extends DataCollector {
  /**
   * 웹페이지에서 가격 정보 추출
   */
  scrapePage(url: string, selectors: ScrapingSelectors): Promise<ScrapedData[]>
  
  /**
   * 브라우저 세션 관리
   */
  initializeBrowser(): Promise<void>
  closeBrowser(): Promise<void>
}

// 스크래핑 셀렉터
export interface ScrapingSelectors {
  itemName: string
  price: string
  unit?: string
  supplier?: string
  quality?: string
}

// 스크래핑된 데이터
export interface ScrapedData {
  itemName: string
  price: number
  unit?: string
  supplier?: string
  quality?: string
  url: string
  scrapedAt: Date
}

// OCR 수집기 인터페이스
export interface OCRCollector extends DataCollector {
  /**
   * 이미지에서 텍스트 추출
   */
  extractText(imagePath: string): Promise<string>
  
  /**
   * 추출된 텍스트에서 가격 정보 파싱
   */
  parseInvoice(text: string): Promise<ParsedInvoiceData[]>
}

// 파싱된 거래명세서 데이터
export interface ParsedInvoiceData {
  itemName: string
  quantity: number
  unit: string
  price: number
  totalAmount: number
  supplier?: string
  invoiceDate?: Date
  confidence: number // OCR 정확도
}

// API 수집기 인터페이스
export interface APICollector extends DataCollector {
  /**
   * API 엔드포인트에서 데이터 가져오기
   */
  fetchFromAPI(endpoint: string, params?: Record<string, any>): Promise<any>
  
  /**
   * API 응답을 PriceRecord 형태로 변환
   */
  transformAPIResponse(response: any, mapping?: any, supplier?: Supplier, targetIngredients?: Ingredient[]): Promise<PriceRecord[]>
}

// 수집 작업 스케줄러
export interface CollectionScheduler {
  /**
   * 정기적인 데이터 수집 작업 등록
   */
  scheduleCollection(
    collector: DataCollector,
    schedule: CollectionSchedule
  ): Promise<string>
  
  /**
   * 스케줄된 작업 취소
   */
  cancelSchedule(scheduleId: string): Promise<void>
  
  /**
   * 모든 스케줄 목록 조회
   */
  getSchedules(): Promise<CollectionSchedule[]>
}

// 수집 스케줄
export interface CollectionSchedule {
  id: string
  name: string
  collector: string
  cronExpression: string
  suppliers: string[]
  ingredients: string[]
  isActive: boolean
  lastRunAt?: Date
  nextRunAt: Date
}