-- CostScanner 초기 데이터베이스 스키마 (수정본)
-- 식자재 최저가 모니터링 시스템

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE ingredient_category AS ENUM (
  '채소', '과일', '육류', '생선', '유제품', '곡물', '조미료', '기타'
);

CREATE TYPE price_source AS ENUM (
  'manual', 'scraping', 'ocr', 'api'
);

CREATE TYPE notification_type AS ENUM (
  'price_alert', 'cost_report', 'supplier_update', 'system_maintenance', 'marketing', 'security'
);

CREATE TYPE notification_channel AS ENUM (
  'email', 'sms', 'push', 'webhook'
);

CREATE TYPE alert_type AS ENUM (
  'price_drop', 'price_increase', 'new_supplier'
);

CREATE TYPE report_type AS ENUM (
  'daily', 'weekly', 'monthly', 'custom'
);

-- 사용자 프로필 테이블 (auth.users 확장)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 공급업체 테이블
CREATE TABLE public.suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 식자재 마스터 테이블
CREATE TABLE public.ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category ingredient_category NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 가격 정보 테이블 (시계열 데이터)
CREATE TABLE public.price_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  unit TEXT NOT NULL,
  source price_source DEFAULT 'manual',
  quality_grade TEXT,
  notes TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 레시피 테이블
CREATE TABLE public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  servings INTEGER NOT NULL CHECK (servings > 0),
  image_url TEXT,
  total_cost DECIMAL(10,2),
  profit_margin DECIMAL(5,2),
  selling_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 레시피-식자재 연결 테이블
CREATE TABLE public.recipe_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

-- 가격 알림 설정 테이블
CREATE TABLE public.price_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  threshold_price DECIMAL(10,2),
  threshold_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  notification_methods notification_channel[] DEFAULT '{email}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림 이력 테이블
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 비용 리포트 테이블
CREATE TABLE public.cost_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  total_ingredients INTEGER DEFAULT 0,
  total_cost DECIMAL(12,2) DEFAULT 0,
  average_cost DECIMAL(10,2) DEFAULT 0,
  cost_trend DECIMAL(5,2) DEFAULT 0,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
-- 가격 정보 조회 최적화
CREATE INDEX idx_price_records_ingredient_created ON price_records(ingredient_id, created_at DESC);
CREATE INDEX idx_price_records_supplier_created ON price_records(supplier_id, created_at DESC);
CREATE INDEX idx_price_records_source ON price_records(source);
CREATE INDEX idx_price_records_created_at ON price_records(created_at DESC);

-- 사용자별 데이터 조회 최적화
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_cost_reports_user_id ON cost_reports(user_id);

-- 식자재 및 공급업체 검색 최적화
CREATE INDEX idx_ingredients_category ON ingredients(category);
-- 한국어 검색 대신 일반 텍스트 패턴 매칭 사용
CREATE INDEX idx_ingredients_name_pattern ON ingredients(name text_pattern_ops);
CREATE INDEX idx_suppliers_name_pattern ON suppliers(name text_pattern_ops);

-- 알림 관련 최적화
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_price_alerts_active ON price_alerts(user_id, is_active) WHERE is_active = true;

-- Updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 모든 테이블에 updated_at 트리거 적용
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_records_updated_at BEFORE UPDATE ON price_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_ingredients_updated_at BEFORE UPDATE ON recipe_ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON price_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_reports_updated_at BEFORE UPDATE ON cost_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();