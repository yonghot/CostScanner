import { PriceRecord, TrendAnalysis, ChartDataPoint } from '@/types'

// 비용 분석기 인터페이스
export interface CostAnalyzer {
  /**
   * 가격 트렌드 분석
   */
  analyzePriceTrend(
    ingredientId: string,
    dateRange: DateRange
  ): Promise<TrendAnalysis>
  
  /**
   * 여러 식자재 가격 비교 분석
   */
  compareIngredientPrices(
    ingredientIds: string[],
    dateRange: DateRange
  ): Promise<PriceComparison[]>
  
  /**
   * 공급업체별 가격 분석
   */
  analyzeSupplierPrices(
    supplierId: string,
    dateRange: DateRange
  ): Promise<SupplierAnalysis>
  
  /**
   * 레시피 원가 계산
   */
  calculateRecipeCost(recipeId: string): Promise<RecipeCostAnalysis>
  
  /**
   * 시장 가격 예측
   */
  predictPrices(
    ingredientId: string,
    daysAhead: number
  ): Promise<PricePrediction>
}

// 날짜 범위
export interface DateRange {
  startDate: Date
  endDate: Date
}

// 가격 비교 결과
export interface PriceComparison {
  ingredient_id: string
  ingredient_name: string
  suppliers: SupplierPrice[]
  lowest_price: number
  highest_price: number
  average_price: number
  price_variance: number
  recommended_supplier?: string
}

// 공급업체별 가격
export interface SupplierPrice {
  supplier_id: string
  supplier_name: string
  current_price: number
  previous_price?: number
  price_change?: number
  last_updated: Date
  availability: 'available' | 'out_of_stock' | 'limited'
  quality_grade?: string
}

// 공급업체 분석 결과
export interface SupplierAnalysis {
  supplier_id: string
  supplier_name: string
  total_ingredients: number
  average_price_level: 'low' | 'medium' | 'high'
  price_stability: number // 0-1 스코어
  reliability_score: number // 0-1 스코어
  ingredient_categories: CategoryAnalysis[]
  monthly_trends: MonthlyTrend[]
}

// 카테고리별 분석
export interface CategoryAnalysis {
  category: string
  ingredient_count: number
  average_price: number
  price_trend: 'increasing' | 'decreasing' | 'stable'
}

// 월별 트렌드
export interface MonthlyTrend {
  month: string
  total_cost: number
  ingredient_count: number
  average_price: number
  price_change_percentage: number
}

// 레시피 원가 분석
export interface RecipeCostAnalysis {
  recipe_id: string
  recipe_name: string
  total_cost: number
  cost_per_serving: number
  ingredient_costs: IngredientCost[]
  cost_breakdown: CostBreakdown
  profitability: ProfitabilityAnalysis
  recommendations: CostRecommendation[]
}

// 식자재별 원가
export interface IngredientCost {
  ingredient_id: string
  ingredient_name: string
  quantity: number
  unit: string
  unit_price: number
  total_cost: number
  cost_percentage: number // 전체 레시피 대비 비율
  suppliers: SupplierOption[]
}

// 공급업체 옵션
export interface SupplierOption {
  supplier_id: string
  supplier_name: string
  price: number
  potential_saving: number
  quality_grade?: string
}

// 원가 구성
export interface CostBreakdown {
  ingredients_cost: number
  ingredients_percentage: number
  labor_cost?: number
  overhead_cost?: number
  total_cost: number
}

// 수익성 분석
export interface ProfitabilityAnalysis {
  current_selling_price?: number
  suggested_selling_price: number
  gross_margin: number
  gross_margin_percentage: number
  break_even_price: number
  competitive_price_range: {
    min: number
    max: number
  }
}

// 원가 절감 추천
export interface CostRecommendation {
  type: 'supplier_switch' | 'ingredient_substitute' | 'quantity_optimize'
  ingredient_id: string
  ingredient_name: string
  current_cost: number
  recommended_action: string
  potential_saving: number
  impact_level: 'low' | 'medium' | 'high'
  feasibility: 'easy' | 'moderate' | 'difficult'
}

// 가격 예측
export interface PricePrediction {
  ingredient_id: string
  ingredient_name: string
  prediction_date: Date
  predicted_price: number
  confidence_level: number // 0-1
  price_range: {
    min: number
    max: number
  }
  factors: PredictionFactor[]
  historical_accuracy?: number
}

// 예측 요인
export interface PredictionFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number // 영향도
  description: string
}

// 시장 분석기
export interface MarketAnalyzer {
  /**
   * 시장 평균 가격 계산
   */
  calculateMarketAverage(ingredientId: string): Promise<MarketPrice>
  
  /**
   * 가격 이상치 탐지
   */
  detectPriceAnomalies(priceRecords: PriceRecord[]): Promise<PriceAnomaly[]>
  
  /**
   * 계절성 분석
   */
  analyzeSeasonality(
    ingredientId: string,
    years: number
  ): Promise<SeasonalityAnalysis>
}

// 시장 가격
export interface MarketPrice {
  ingredient_id: string
  average_price: number
  median_price: number
  price_range: {
    min: number
    max: number
  }
  data_points: number
  last_updated: Date
}

// 가격 이상치
export interface PriceAnomaly {
  price_record_id: string
  ingredient_id: string
  supplier_id: string
  recorded_price: number
  expected_price: number
  deviation_percentage: number
  anomaly_type: 'unusually_high' | 'unusually_low'
  confidence: number
}

// 계절성 분석
export interface SeasonalityAnalysis {
  ingredient_id: string
  has_seasonality: boolean
  seasonal_pattern: SeasonalPattern[]
  peak_season: string
  low_season: string
  price_volatility: number
}

// 계절 패턴
export interface SeasonalPattern {
  month: number
  month_name: string
  average_price: number
  price_index: number // 연평균 대비 지수
  volatility: number
}