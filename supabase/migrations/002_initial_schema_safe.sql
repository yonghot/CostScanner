-- 002_initial_schema_safe.sql
-- Safe version with DROP IF EXISTS for re-running migrations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing types if they exist
DROP TYPE IF EXISTS ingredient_category CASCADE;
DROP TYPE IF EXISTS supplier_type CASCADE;
DROP TYPE IF EXISTS price_source CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS report_type CASCADE;
DROP TYPE IF EXISTS alert_status CASCADE;

-- Create ENUM types for consistent data
CREATE TYPE ingredient_category AS ENUM (
  'vegetables',
  'fruits',
  'meat',
  'seafood',
  'dairy',
  'grains',
  'seasonings',
  'beverages',
  'processed',
  'other'
);

CREATE TYPE supplier_type AS ENUM (
  'wholesale',
  'retail',
  'direct_farm',
  'import',
  'manufacturer'
);

CREATE TYPE price_source AS ENUM (
  'manual',
  'web_scraping',
  'ocr',
  'api',
  'email'
);

CREATE TYPE notification_type AS ENUM (
  'email',
  'sms',
  'push',
  'in_app'
);

CREATE TYPE report_type AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
  'custom'
);

CREATE TYPE alert_status AS ENUM (
  'active',
  'triggered',
  'resolved',
  'disabled'
);

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.supplier_ingredients CASCADE;
DROP TABLE IF EXISTS public.collection_jobs CASCADE;
DROP TABLE IF EXISTS public.cost_reports CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.price_alerts CASCADE;
DROP TABLE IF EXISTS public.recipe_ingredients CASCADE;
DROP TABLE IF EXISTS public.recipes CASCADE;
DROP TABLE IF EXISTS public.price_records CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.ingredients CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  company_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ko TEXT,
  category ingredient_category NOT NULL DEFAULT 'other',
  unit TEXT NOT NULL DEFAULT 'kg',
  description TEXT,
  min_stock_level DECIMAL(10,2),
  current_stock DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type supplier_type NOT NULL DEFAULT 'wholesale',
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  business_number TEXT,
  payment_terms TEXT,
  delivery_days INTEGER[],
  minimum_order_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Price records table (time-series optimized)
CREATE TABLE IF NOT EXISTS public.price_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  quantity DECIMAL(10,2) DEFAULT 1,
  unit TEXT NOT NULL,
  source price_source NOT NULL DEFAULT 'manual',
  source_url TEXT,
  source_document TEXT,
  is_verified BOOLEAN DEFAULT false,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  serving_size INTEGER DEFAULT 1,
  preparation_time INTEGER,
  selling_price DECIMAL(10,2),
  target_cost_ratio DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Recipe ingredients junction table
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  threshold_value DECIMAL(10,2),
  threshold_percentage DECIMAL(5,2),
  status alert_status DEFAULT 'active',
  last_triggered_at TIMESTAMPTZ,
  notification_channels notification_type[] DEFAULT ARRAY['email']::notification_type[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cost reports table
CREATE TABLE IF NOT EXISTS public.cost_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type report_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL,
  summary JSONB,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data collection jobs table
CREATE TABLE IF NOT EXISTS public.collection_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  schedule TEXT,
  config JSONB DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier ingredients junction table
CREATE TABLE IF NOT EXISTS public.supplier_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  default_price DECIMAL(10,2),
  lead_time_days INTEGER,
  minimum_order_quantity DECIMAL(10,2),
  is_preferred BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supplier_id, ingredient_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON public.ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON public.ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON public.ingredients(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_name_trgm ON public.ingredients USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ingredients_name_ko_trgm ON public.ingredients USING gin(name_ko gin_trgm_ops) WHERE name_ko IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON public.suppliers(type);
CREATE INDEX IF NOT EXISTS idx_suppliers_name_trgm ON public.suppliers USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_price_records_user_id ON public.price_records(user_id);
CREATE INDEX IF NOT EXISTS idx_price_records_ingredient_id ON public.price_records(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_price_records_supplier_id ON public.price_records(supplier_id) WHERE supplier_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_price_records_recorded_at ON public.price_records(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_records_composite ON public.price_records(ingredient_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_name_trgm ON public.recipes USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_id ON public.recipe_ingredients(ingredient_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_ingredient_id ON public.price_alerts(ingredient_id) WHERE ingredient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON public.price_alerts(status) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_cost_reports_user_id ON public.cost_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_reports_period ON public.cost_reports(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_collection_jobs_user_id ON public.collection_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_jobs_next_run ON public.collection_jobs(next_run_at) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_supplier_ingredients_supplier_id ON public.supplier_ingredients(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_ingredients_ingredient_id ON public.supplier_ingredients(ingredient_id);

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist and recreate
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ingredients_updated_at ON public.ingredients;
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON public.ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipes_updated_at ON public.recipes;
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipe_ingredients_updated_at ON public.recipe_ingredients;
CREATE TRIGGER update_recipe_ingredients_updated_at BEFORE UPDATE ON public.recipe_ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_price_alerts_updated_at ON public.price_alerts;
CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cost_reports_updated_at ON public.cost_reports;
CREATE TRIGGER update_cost_reports_updated_at BEFORE UPDATE ON public.cost_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collection_jobs_updated_at ON public.collection_jobs;
CREATE TRIGGER update_collection_jobs_updated_at BEFORE UPDATE ON public.collection_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_supplier_ingredients_updated_at ON public.supplier_ingredients;
CREATE TRIGGER update_supplier_ingredients_updated_at BEFORE UPDATE ON public.supplier_ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS calculate_recipe_cost(UUID);
DROP FUNCTION IF EXISTS get_price_trend(UUID, INTEGER);

-- Create function to calculate recipe cost
CREATE FUNCTION calculate_recipe_cost(recipe_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_cost DECIMAL(10,2) := 0;
  ingredient_cost RECORD;
BEGIN
  FOR ingredient_cost IN
    SELECT 
      ri.quantity,
      ri.unit,
      COALESCE(
        (SELECT price FROM public.price_records pr 
         WHERE pr.ingredient_id = ri.ingredient_id 
         ORDER BY pr.recorded_at DESC 
         LIMIT 1), 
        0
      ) as latest_price
    FROM public.recipe_ingredients ri
    WHERE ri.recipe_id = recipe_id_param
  LOOP
    total_cost := total_cost + (ingredient_cost.quantity * ingredient_cost.latest_price);
  END LOOP;
  
  RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Create function to get ingredient price trend
CREATE FUNCTION get_price_trend(
  ingredient_id_param UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  date DATE,
  avg_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  record_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(recorded_at) as date,
    AVG(price)::DECIMAL(10,2) as avg_price,
    MIN(price)::DECIMAL(10,2) as min_price,
    MAX(price)::DECIMAL(10,2) as max_price,
    COUNT(*)::INTEGER as record_count
  FROM public.price_records
  WHERE ingredient_id = ingredient_id_param
    AND recorded_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
  GROUP BY DATE(recorded_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE public.users IS 'User accounts extending Supabase auth';
COMMENT ON TABLE public.ingredients IS 'Master list of ingredients with Korean language support';
COMMENT ON TABLE public.suppliers IS 'Supplier information and ratings';
COMMENT ON TABLE public.price_records IS 'Time-series price data from various sources';
COMMENT ON TABLE public.recipes IS 'Recipe definitions with cost targets';
COMMENT ON TABLE public.recipe_ingredients IS 'Recipe ingredient relationships and quantities';
COMMENT ON TABLE public.price_alerts IS 'Price monitoring and alert configurations';
COMMENT ON TABLE public.notifications IS 'User notification history';
COMMENT ON TABLE public.cost_reports IS 'Generated cost analysis reports';
COMMENT ON TABLE public.collection_jobs IS 'Automated data collection job configurations';
COMMENT ON TABLE public.supplier_ingredients IS 'Supplier-ingredient relationships and terms';

COMMENT ON FUNCTION calculate_recipe_cost IS 'Calculate total cost of a recipe based on latest ingredient prices';
COMMENT ON FUNCTION get_price_trend IS 'Get price trend data for an ingredient over specified days';