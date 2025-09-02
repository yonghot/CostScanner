export const APP_CONFIG = {
  name: 'CostScanner',
  description: '식자재 원가 관리 솔루션',
  version: '1.0.0',
  company: 'CostScanner Inc.',
  supportEmail: 'support@costscanner.com',
  website: 'https://costscanner.com'
} as const

export const FEATURES = {
  PRICE_MONITORING: '가격 모니터링',
  COST_ANALYSIS: '비용 분석',
  SUPPLIER_COMPARISON: '공급업체 비교',
  RECIPE_MANAGEMENT: '레시피 관리',
  AUTOMATED_COLLECTION: '자동 데이터 수집',
  TREND_PREDICTION: '가격 트렌드 예측'
} as const

export const COLLECTION_SOURCES = {
  WEB_SCRAPING: 'web-scraping',
  OCR: 'ocr',
  API: 'api',
  MANUAL: 'manual'
} as const

export const INGREDIENT_CATEGORIES = {
  VEGETABLES: '채소',
  FRUITS: '과일',
  MEAT: '육류',
  SEAFOOD: '생선',
  DAIRY: '유제품',
  GRAINS: '곡물',
  SEASONINGS: '조미료',
  OTHERS: '기타'
} as const

export const NOTIFICATION_TYPES = {
  PRICE_ALERT: 'price_alert',
  COST_REPORT: 'cost_report',
  SUPPLIER_UPDATE: 'supplier_update',
  SYSTEM_MAINTENANCE: 'system_maintenance'
} as const

export const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom'
} as const

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  quaternary: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
} as const