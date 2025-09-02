// 공통 타입 정의

export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

export interface User extends BaseEntity {
  email: string
  name: string
  business_name?: string
  business_type?: string
  phone?: string
  is_active: boolean
}

// 식자재 관련 타입
export interface Ingredient extends BaseEntity {
  name: string
  category: string
  unit: string
  description?: string
  image_url?: string
  is_active: boolean
}

export interface Supplier extends BaseEntity {
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  is_active: boolean
}

// 가격 정보 타입
export interface PriceRecord extends BaseEntity {
  ingredient_id: string
  supplier_id: string
  price: number
  unit: string
  source: 'manual' | 'scraping' | 'ocr' | 'api'
  quality_grade?: string
  notes?: string
  scraped_at?: string
}

// 레시피 관련 타입
export interface Recipe extends BaseEntity {
  name: string
  category: string
  description?: string
  servings: number
  image_url?: string
  total_cost?: number
  profit_margin?: number
  selling_price?: number
  is_active: boolean
}

export interface RecipeIngredient extends BaseEntity {
  recipe_id: string
  ingredient_id: string
  quantity: number
  unit: string
  notes?: string
}

// 알림 관련 타입
export interface PriceAlert extends BaseEntity {
  user_id: string
  ingredient_id: string
  alert_type: 'price_drop' | 'price_increase' | 'new_supplier'
  threshold_price?: number
  threshold_percentage?: number
  is_active: boolean
  notification_methods: ('email' | 'sms' | 'push')[]
}

export interface Notification extends BaseEntity {
  user_id: string
  type: 'price_alert' | 'system' | 'promotion'
  title: string
  message: string
  is_read: boolean
  data?: Record<string, any>
}

// 리포트 관련 타입
export interface CostReport extends BaseEntity {
  user_id: string
  report_type: 'daily' | 'weekly' | 'monthly' | 'custom'
  date_from: string
  date_to: string
  total_ingredients: number
  total_cost: number
  average_cost: number
  cost_trend: number
  data: Record<string, any>
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// 폼 관련 타입 (통합)
export interface IngredientFormData {
  name: string
  category: string
  unit: string
  current_price?: number
  suppliers?: string[]
  min_stock_level?: number
  description?: string
}

export interface SupplierFormData {
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  manager?: string
  payment_terms?: string
  min_order?: number
  specialties?: string[]
  notes?: string
}

export interface RecipeFormData {
  name: string
  category: string
  description?: string
  servings: number
  ingredients: {
    ingredient_id: string
    quantity: number
    unit: string
  }[]
  selling_price?: number
  instructions?: string[]
  prep_time?: number
  cook_time?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

// 가격 알림 및 알림 설정
export interface UserSettings {
  user_id: string
  profile: {
    name: string
    email: string
    business_name?: string
    business_type?: string
    phone?: string
  }
  preferences: {
    currency: string
    language: string
    timezone: string
    date_format: string
    notifications: {
      email: boolean
      browser: boolean
      sms: boolean
    }
  }
  subscription: {
    plan: 'free' | 'pro' | 'business'
    status: 'active' | 'inactive' | 'trial'
    expires_at?: string
    features: string[]
  }
}

// 카테고리 타입
export type IngredientCategory = '육류' | '채소' | '과일' | '곡류' | '조미료' | '향신료' | '난류' | '유제품' | '해산물' | '기타'

// 타입 변환 유틸리티 (snake_case ↔ camelCase)
type SnakeToCamel<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Capitalize<SnakeToCamel<`${P2}${P3}`>>}`
  : S

type CamelToSnake<S extends string> = S extends `${infer P1}${Capitalize<infer P2>}${infer P3}`
  ? `${P1}_${Lowercase<P2>}${CamelToSnake<P3>}`
  : S

export type CamelCaseKeys<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K] extends Record<string, any>
    ? CamelCaseKeys<T[K]>
    : T[K]
}

export type SnakeCaseKeys<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K] extends Record<string, any>
    ? SnakeCaseKeys<T[K]>
    : T[K]
}

// UI 전용 camelCase 변환 타입
export type IngredientCamelCase = CamelCaseKeys<Ingredient>
export type SupplierCamelCase = CamelCaseKeys<Supplier>
export type RecipeCamelCase = CamelCaseKeys<Recipe>
export type PriceRecordCamelCase = CamelCaseKeys<PriceRecord>

// 차트 데이터 타입 (통합)
export interface ChartDataPoint {
  date: string
  value: number
  price?: number
  label?: string
  supplier?: string
}

export interface CategoryData {
  category: string
  value: number
  percentage: number
  color?: string
}

export interface TrendAnalysis {
  ingredient_id: string
  ingredient_name: string
  current_price: number
  previous_price: number
  price_change: number
  price_change_percentage: number
  trend: 'increasing' | 'decreasing' | 'stable'
  chart_data: ChartDataPoint[]
}

// UI 컴포넌트용 타입 (dashboard.ts에서 통합)
export interface PricePoint {
  date: string
  price: number
  supplier?: string
}

// 확장된 엔티티 타입 (UI 전용 필드 추가)
export interface IngredientUI extends Ingredient {
  current_price: number
  price_history: PricePoint[]
  suppliers: string[]
  stock_level?: number
  min_stock_level?: number
  status: 'available' | 'low_stock' | 'out_of_stock'
}

export interface SupplierUI extends Supplier {
  rating: number
  delivery_time: string
  min_order: number
  payment_terms: string
  specialties: string[]
  total_orders?: number
  last_order_date?: string
  contact_manager?: string
  notes?: string
}

export interface RecipeIngredientUI {
  ingredient_id: string
  name: string
  quantity: number
  unit: string
  cost: number
}

export interface RecipeUI extends Recipe {
  ingredients: RecipeIngredientUI[]
  cost_per_serving: number
  profit_amount?: number
  instructions?: string[]
  prep_time?: number
  cook_time?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

// 필터링 및 정렬
export interface FilterOptions {
  category?: string
  supplier?: string
  price_range?: {
    min: number
    max: number
  }
  status?: string
  date_range?: {
    start: string
    end: string
  }
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// 대시보드 관련 타입
export interface DashboardStats {
  total_ingredients: number
  total_recipes: number
  total_suppliers: number
  monthly_spending: number
  avg_cost_per_recipe: number
  cost_savings_this_month: number
  price_alerts_active: number
  top_expensive_ingredient: {
    name: string
    price: number
    change: number
  }
}