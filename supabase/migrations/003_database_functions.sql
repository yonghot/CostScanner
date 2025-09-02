-- 데이터베이스 함수들
-- 비용 분석, 가격 트렌드 등 복잡한 쿼리를 위한 함수들

-- 식자재 최신 가격 조회 함수
CREATE OR REPLACE FUNCTION get_latest_ingredient_price(ingredient_uuid UUID)
RETURNS TABLE (
  ingredient_id UUID,
  supplier_id UUID,
  supplier_name TEXT,
  price DECIMAL(10,2),
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (pr.supplier_id)
    pr.ingredient_id,
    pr.supplier_id,
    s.name as supplier_name,
    pr.price,
    pr.unit,
    pr.created_at
  FROM price_records pr
  JOIN suppliers s ON s.id = pr.supplier_id
  WHERE pr.ingredient_id = ingredient_uuid
  ORDER BY pr.supplier_id, pr.created_at DESC;
END;
$$;

-- 식자재 가격 트렌드 조회 함수
CREATE OR REPLACE FUNCTION get_price_trend(
  ingredient_uuid UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  avg_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  supplier_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(pr.created_at) as date,
    AVG(pr.price)::DECIMAL(10,2) as avg_price,
    MIN(pr.price)::DECIMAL(10,2) as min_price,
    MAX(pr.price)::DECIMAL(10,2) as max_price,
    COUNT(DISTINCT pr.supplier_id)::INTEGER as supplier_count
  FROM price_records pr
  WHERE pr.ingredient_id = ingredient_uuid
    AND pr.created_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY DATE(pr.created_at)
  ORDER BY date DESC;
END;
$$;

-- 레시피 총 원가 계산 함수
CREATE OR REPLACE FUNCTION calculate_recipe_cost(recipe_uuid UUID)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
  total_cost DECIMAL(10,2) := 0;
  ingredient_cost DECIMAL(10,2);
  recipe_ingredient RECORD;
BEGIN
  -- 레시피의 모든 식자재에 대해 반복
  FOR recipe_ingredient IN 
    SELECT ri.ingredient_id, ri.quantity, ri.unit
    FROM recipe_ingredients ri
    WHERE ri.recipe_id = recipe_uuid
  LOOP
    -- 각 식자재의 최저 가격 조회
    SELECT MIN(pr.price) INTO ingredient_cost
    FROM price_records pr
    WHERE pr.ingredient_id = recipe_ingredient.ingredient_id
      AND pr.created_at >= NOW() - INTERVAL '7 days' -- 최근 7일 내 가격
      AND pr.unit = recipe_ingredient.unit;
    
    -- 가격이 없으면 0으로 처리
    IF ingredient_cost IS NULL THEN
      ingredient_cost := 0;
    END IF;
    
    -- 수량 * 단가로 총 비용 누적
    total_cost := total_cost + (recipe_ingredient.quantity * ingredient_cost);
  END LOOP;
  
  -- 계산된 총 원가를 레시피 테이블에 업데이트
  UPDATE recipes SET total_cost = total_cost WHERE id = recipe_uuid;
  
  RETURN total_cost;
END;
$$;

-- 공급업체별 평균 가격 비교 함수
CREATE OR REPLACE FUNCTION compare_supplier_prices(ingredient_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  supplier_id UUID,
  supplier_name TEXT,
  avg_price DECIMAL(10,2),
  price_count INTEGER,
  last_update TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as supplier_id,
    s.name as supplier_name,
    AVG(pr.price)::DECIMAL(10,2) as avg_price,
    COUNT(pr.*)::INTEGER as price_count,
    MAX(pr.created_at) as last_update
  FROM suppliers s
  JOIN price_records pr ON pr.supplier_id = s.id
  WHERE pr.ingredient_id = ingredient_uuid
    AND pr.created_at >= NOW() - INTERVAL '1 day' * days_back
    AND s.is_active = true
  GROUP BY s.id, s.name
  HAVING COUNT(pr.*) >= 3 -- 최소 3개 이상의 가격 데이터가 있는 업체만
  ORDER BY avg_price ASC;
END;
$$;

-- 가격 급등/급락 탐지 함수
CREATE OR REPLACE FUNCTION detect_price_anomalies(
  ingredient_uuid UUID DEFAULT NULL,
  threshold_percentage DECIMAL DEFAULT 20.0
)
RETURNS TABLE (
  ingredient_id UUID,
  ingredient_name TEXT,
  supplier_id UUID,
  supplier_name TEXT,
  current_price DECIMAL(10,2),
  previous_avg DECIMAL(10,2),
  change_percentage DECIMAL(5,2),
  anomaly_type TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH recent_prices AS (
    SELECT 
      pr.ingredient_id,
      pr.supplier_id,
      pr.price as current_price,
      pr.created_at,
      ROW_NUMBER() OVER (PARTITION BY pr.ingredient_id, pr.supplier_id ORDER BY pr.created_at DESC) as rn
    FROM price_records pr
    WHERE (ingredient_uuid IS NULL OR pr.ingredient_id = ingredient_uuid)
      AND pr.created_at >= NOW() - INTERVAL '3 days'
  ),
  historical_avg AS (
    SELECT 
      pr.ingredient_id,
      pr.supplier_id,
      AVG(pr.price) as avg_price
    FROM price_records pr
    WHERE (ingredient_uuid IS NULL OR pr.ingredient_id = ingredient_uuid)
      AND pr.created_at >= NOW() - INTERVAL '30 days'
      AND pr.created_at < NOW() - INTERVAL '3 days'
    GROUP BY pr.ingredient_id, pr.supplier_id
  )
  SELECT 
    rp.ingredient_id,
    i.name as ingredient_name,
    rp.supplier_id,
    s.name as supplier_name,
    rp.current_price,
    ha.avg_price as previous_avg,
    (((rp.current_price - ha.avg_price) / ha.avg_price) * 100)::DECIMAL(5,2) as change_percentage,
    CASE 
      WHEN rp.current_price > ha.avg_price * (1 + threshold_percentage/100) THEN '급등'
      WHEN rp.current_price < ha.avg_price * (1 - threshold_percentage/100) THEN '급락'
      ELSE '정상'
    END as anomaly_type
  FROM recent_prices rp
  JOIN historical_avg ha ON ha.ingredient_id = rp.ingredient_id AND ha.supplier_id = rp.supplier_id
  JOIN ingredients i ON i.id = rp.ingredient_id
  JOIN suppliers s ON s.id = rp.supplier_id
  WHERE rp.rn = 1
    AND (
      rp.current_price > ha.avg_price * (1 + threshold_percentage/100) OR
      rp.current_price < ha.avg_price * (1 - threshold_percentage/100)
    )
  ORDER BY ABS(((rp.current_price - ha.avg_price) / ha.avg_price) * 100) DESC;
END;
$$;

-- 월별 비용 분석 함수
CREATE OR REPLACE FUNCTION get_monthly_cost_analysis(user_uuid UUID, months_back INTEGER DEFAULT 12)
RETURNS TABLE (
  month TEXT,
  total_recipes INTEGER,
  total_cost DECIMAL(12,2),
  avg_cost_per_recipe DECIMAL(10,2),
  most_expensive_recipe TEXT,
  cost_trend DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH monthly_data AS (
    SELECT 
      TO_CHAR(r.updated_at, 'YYYY-MM') as month,
      COUNT(r.*) as recipe_count,
      SUM(COALESCE(r.total_cost, 0)) as month_total_cost,
      AVG(COALESCE(r.total_cost, 0)) as avg_recipe_cost
    FROM recipes r
    WHERE r.user_id = user_uuid
      AND r.updated_at >= NOW() - INTERVAL '1 month' * months_back
      AND r.is_active = true
    GROUP BY TO_CHAR(r.updated_at, 'YYYY-MM')
  ),
  expensive_recipes AS (
    SELECT DISTINCT ON (TO_CHAR(r.updated_at, 'YYYY-MM'))
      TO_CHAR(r.updated_at, 'YYYY-MM') as month,
      r.name as recipe_name
    FROM recipes r
    WHERE r.user_id = user_uuid
      AND r.updated_at >= NOW() - INTERVAL '1 month' * months_back
      AND r.is_active = true
    ORDER BY TO_CHAR(r.updated_at, 'YYYY-MM'), r.total_cost DESC NULLS LAST
  )
  SELECT 
    md.month,
    md.recipe_count::INTEGER as total_recipes,
    md.month_total_cost::DECIMAL(12,2) as total_cost,
    md.avg_recipe_cost::DECIMAL(10,2) as avg_cost_per_recipe,
    er.recipe_name as most_expensive_recipe,
    COALESCE(
      ((md.month_total_cost - LAG(md.month_total_cost) OVER (ORDER BY md.month)) / 
       NULLIF(LAG(md.month_total_cost) OVER (ORDER BY md.month), 0) * 100), 0
    )::DECIMAL(5,2) as cost_trend
  FROM monthly_data md
  LEFT JOIN expensive_recipes er ON er.month = md.month
  ORDER BY md.month DESC;
END;
$$;

-- 식자재 검색 함수 (전문 검색)
CREATE OR REPLACE FUNCTION search_ingredients(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category ingredient_category,
  unit TEXT,
  description TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.name,
    i.category,
    i.unit,
    i.description,
    ts_rank(to_tsvector('korean', i.name || ' ' || COALESCE(i.description, '')), 
            plainto_tsquery('korean', search_term)) as rank
  FROM ingredients i
  WHERE i.is_active = true
    AND (
      to_tsvector('korean', i.name || ' ' || COALESCE(i.description, '')) @@ 
      plainto_tsquery('korean', search_term)
      OR i.name ILIKE '%' || search_term || '%'
    )
  ORDER BY rank DESC, i.name;
END;
$$;

-- 대시보드 요약 데이터 함수
CREATE OR REPLACE FUNCTION get_dashboard_summary(user_uuid UUID)
RETURNS TABLE (
  total_recipes INTEGER,
  active_price_alerts INTEGER,
  avg_recipe_cost DECIMAL(10,2),
  monthly_spending DECIMAL(12,2),
  cost_savings_this_month DECIMAL(12,2),
  top_expensive_ingredient TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  current_month_start DATE := DATE_TRUNC('month', CURRENT_DATE);
  prev_month_start DATE := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
BEGIN
  RETURN QUERY
  WITH summary_data AS (
    SELECT 
      (SELECT COUNT(*) FROM recipes WHERE user_id = user_uuid AND is_active = true)::INTEGER as recipe_count,
      (SELECT COUNT(*) FROM price_alerts WHERE user_id = user_uuid AND is_active = true)::INTEGER as alert_count,
      (SELECT AVG(total_cost) FROM recipes WHERE user_id = user_uuid AND is_active = true)::DECIMAL(10,2) as avg_cost,
      (SELECT SUM(total_cost) FROM recipes WHERE user_id = user_uuid AND updated_at >= current_month_start)::DECIMAL(12,2) as month_spending,
      (SELECT SUM(total_cost) FROM recipes WHERE user_id = user_uuid AND updated_at >= prev_month_start AND updated_at < current_month_start)::DECIMAL(12,2) as prev_month_spending
  ),
  top_ingredient AS (
    SELECT i.name
    FROM recipe_ingredients ri
    JOIN recipes r ON r.id = ri.recipe_id
    JOIN ingredients i ON i.id = ri.ingredient_id
    WHERE r.user_id = user_uuid AND r.is_active = true
    GROUP BY i.id, i.name
    ORDER BY SUM(ri.quantity * COALESCE((
      SELECT price FROM price_records pr 
      WHERE pr.ingredient_id = i.id 
      ORDER BY created_at DESC 
      LIMIT 1
    ), 0)) DESC
    LIMIT 1
  )
  SELECT 
    sd.recipe_count as total_recipes,
    sd.alert_count as active_price_alerts,
    COALESCE(sd.avg_cost, 0) as avg_recipe_cost,
    COALESCE(sd.month_spending, 0) as monthly_spending,
    COALESCE(sd.prev_month_spending - sd.month_spending, 0) as cost_savings_this_month,
    COALESCE(ti.name, '데이터 없음') as top_expensive_ingredient
  FROM summary_data sd
  LEFT JOIN top_ingredient ti ON true;
END;
$$;