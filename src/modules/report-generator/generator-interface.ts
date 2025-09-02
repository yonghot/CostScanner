import { CostReport, TrendAnalysis } from '@/types'
import { RecipeCostAnalysis } from '../cost-analyzer/analyzer-interface'

// 리포트 생성기 인터페이스
export interface ReportGenerator {
  /**
   * 비용 분석 리포트 생성
   */
  generateCostReport(
    userId: string,
    reportConfig: ReportConfig
  ): Promise<GeneratedReport>
  
  /**
   * 레시피 원가 리포트 생성
   */
  generateRecipeReport(
    recipeIds: string[],
    options: ReportOptions
  ): Promise<GeneratedReport>
  
  /**
   * 공급업체 비교 리포트 생성
   */
  generateSupplierReport(
    supplierIds: string[],
    dateRange: DateRange
  ): Promise<GeneratedReport>
  
  /**
   * 대시보드 데이터 생성
   */
  generateDashboardData(userId: string): Promise<DashboardData>
}

// 리포트 설정
export interface ReportConfig {
  reportType: ReportType
  dateRange: DateRange
  ingredients?: string[]
  suppliers?: string[]
  categories?: string[]
  includeCharts: boolean
  includeTrends: boolean
  includePredictions: boolean
  format: ReportFormat
}

// 리포트 타입
export type ReportType = 
  | 'cost_analysis' 
  | 'price_trends' 
  | 'supplier_comparison'
  | 'recipe_costs'
  | 'market_overview'
  | 'profit_analysis'

// 리포트 형식
export type ReportFormat = 'pdf' | 'excel' | 'html' | 'json'

// 리포트 옵션
export interface ReportOptions {
  title?: string
  subtitle?: string
  includeExecutiveSummary: boolean
  includeDetailedAnalysis: boolean
  includeRecommendations: boolean
  customBranding?: BrandingOptions
}

// 브랜딩 옵션
export interface BrandingOptions {
  companyName: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
}

// 날짜 범위
export interface DateRange {
  startDate: Date
  endDate: Date
}

// 생성된 리포트
export interface GeneratedReport {
  id: string
  title: string
  type: ReportType
  format: ReportFormat
  filePath: string
  fileSize: number
  generatedAt: Date
  expiresAt?: Date
  downloadUrl: string
  metadata: ReportMetadata
}

// 리포트 메타데이터
export interface ReportMetadata {
  pageCount?: number
  chartCount: number
  tableCount: number
  dataPoints: number
  generationTime: number // 생성 시간 (초)
  parameters: Record<string, any>
}

// 대시보드 데이터
export interface DashboardData {
  summary: DashboardSummary
  charts: DashboardChart[]
  alerts: DashboardAlert[]
  recentActivities: RecentActivity[]
  kpis: KPIMetric[]
}

// 대시보드 요약
export interface DashboardSummary {
  totalIngredients: number
  activeSuppliers: number
  totalRecipes: number
  averageCostPerRecipe: number
  monthlySpending: number
  costSavingsThisMonth: number
  topExpensiveIngredient: {
    name: string
    cost: number
  }
  bestValueSupplier: {
    name: string
    savings: number
  }
}

// 대시보드 차트
export interface DashboardChart {
  id: string
  title: string
  type: ChartType
  data: ChartDataSet
  config: ChartConfig
}

// 차트 타입
export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'area' 
  | 'scatter'
  | 'heatmap'

// 차트 데이터셋
export interface ChartDataSet {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    fill?: boolean
  }[]
}

// 차트 설정
export interface ChartConfig {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins?: Record<string, any>
  scales?: Record<string, any>
}

// 대시보드 알림
export interface DashboardAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  ingredient?: string
  supplier?: string
  actionRequired: boolean
  createdAt: Date
}

// 알림 타입
export type AlertType = 
  | 'price_spike' 
  | 'price_drop' 
  | 'supplier_unavailable'
  | 'cost_budget_exceeded'
  | 'new_better_price'

// 알림 심각도
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

// 최근 활동
export interface RecentActivity {
  id: string
  type: ActivityType
  description: string
  timestamp: Date
  relatedEntity?: {
    type: 'ingredient' | 'supplier' | 'recipe'
    id: string
    name: string
  }
}

// 활동 타입
export type ActivityType = 
  | 'price_update' 
  | 'new_supplier' 
  | 'recipe_created'
  | 'report_generated'
  | 'alert_triggered'

// KPI 지표
export interface KPIMetric {
  id: string
  name: string
  value: number
  unit: string
  change: number // 변화량
  changePercentage: number
  trend: 'up' | 'down' | 'stable'
  target?: number
  isGood: boolean // 긍정적 지표인지
}

// PDF 생성기
export interface PDFGenerator extends ReportGenerator {
  /**
   * HTML을 PDF로 변환
   */
  htmlToPdf(html: string, options: PDFOptions): Promise<Buffer>
  
  /**
   * 차트를 이미지로 생성
   */
  generateChartImage(chartConfig: ChartConfig): Promise<string>
}

// PDF 옵션
export interface PDFOptions {
  format: 'A4' | 'A3' | 'Letter'
  orientation: 'portrait' | 'landscape'
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headerTemplate?: string
  footerTemplate?: string
  printBackground: boolean
}

// Excel 생성기
export interface ExcelGenerator extends ReportGenerator {
  /**
   * 데이터를 Excel 파일로 변환
   */
  dataToExcel(data: ExcelData[], options: ExcelOptions): Promise<Buffer>
  
  /**
   * 차트가 포함된 Excel 생성
   */
  createExcelWithCharts(
    worksheets: ExcelWorksheet[]
  ): Promise<Buffer>
}

// Excel 데이터
export interface ExcelData {
  sheetName: string
  headers: string[]
  data: any[][]
  formatting?: ExcelFormatting
}

// Excel 워크시트
export interface ExcelWorksheet extends ExcelData {
  charts?: ExcelChart[]
}

// Excel 차트
export interface ExcelChart {
  type: 'line' | 'bar' | 'pie'
  title: string
  dataRange: string
  position: {
    row: number
    column: number
  }
}

// Excel 옵션
export interface ExcelOptions {
  fileName: string
  includeCharts: boolean
  autoWidth: boolean
  freezeHeader: boolean
}

// Excel 포맷팅
export interface ExcelFormatting {
  headerStyle?: {
    font?: { bold?: boolean; color?: string }
    fill?: { fgColor?: string }
  }
  dataStyle?: {
    numberFormat?: string
    alignment?: { horizontal?: string }
  }
}