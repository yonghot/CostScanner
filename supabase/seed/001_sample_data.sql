-- 샘플 데이터 삽입
-- 개발 및 테스트용 기본 데이터

-- 공급업체 샘플 데이터
INSERT INTO public.suppliers (id, name, contact_person, phone, email, website) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '마켓컬리', '김컬리', '02-1234-5678', 'contact@kurly.com', 'https://www.kurly.com'),
  ('550e8400-e29b-41d4-a716-446655440002', '쿠팡', '박쿠팡', '02-2345-6789', 'contact@coupang.com', 'https://www.coupang.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'G마켓', '이지마켓', '02-3456-7890', 'contact@gmarket.co.kr', 'https://www.gmarket.co.kr'),
  ('550e8400-e29b-41d4-a716-446655440004', '11번가', '최일일', '02-4567-8901', 'contact@11st.co.kr', 'https://www.11st.co.kr'),
  ('550e8400-e29b-41d4-a716-446655440005', '이마트몰', '정이마트', '02-5678-9012', 'contact@emart.co.kr', 'https://emart.ssg.com'),
  ('550e8400-e29b-41d4-a716-446655440006', '롯데마트몰', '김롯데', '02-6789-0123', 'contact@lottemart.com', 'https://www.lottemart.com'),
  ('550e8400-e29b-41d4-a716-446655440007', '농협하나로마트', '농협이', '02-7890-1234', 'contact@nonghyup.com', 'https://www.nonghyup.com'),
  ('550e8400-e29b-41d4-a716-446655440008', '홈플러스', '홍홈플', '02-8901-2345', 'contact@homeplus.co.kr', 'https://www.homeplus.co.kr');

-- 식자재 샘플 데이터
INSERT INTO public.ingredients (id, name, category, unit, description) VALUES
  -- 채소류
  ('660e8400-e29b-41d4-a716-446655440001', '양파', '채소', 'kg', '국산 황양파'),
  ('660e8400-e29b-41d4-a716-446655440002', '당근', '채소', 'kg', '국산 당근'),
  ('660e8400-e29b-41d4-a716-446655440003', '감자', '채소', 'kg', '국산 수미감자'),
  ('660e8400-e29b-41d4-a716-446655440004', '대파', '채소', '단', '국산 대파 1단(1kg)'),
  ('660e8400-e29b-41d4-a716-446655440005', '마늘', '채소', 'kg', '국산 마늘 깐마늘'),
  ('660e8400-e29b-41d4-a716-446655440006', '생강', '채소', 'kg', '국산 생강'),
  ('660e8400-e29b-41d4-a716-446655440007', '배추', '채소', '포기', '국산 배추 1포기(2-3kg)'),
  ('660e8400-e29b-41d4-a716-446655440008', '무', '채소', 'kg', '국산 무'),
  
  -- 육류
  ('660e8400-e29b-41d4-a716-446655440011', '돼지고기 목살', '육류', 'kg', '국산 돼지 목살'),
  ('660e8400-e29b-41d4-a716-446655440012', '돼지고기 삼겹살', '육류', 'kg', '국산 돼지 삼겹살'),
  ('660e8400-e29b-41d4-a716-446655440013', '소고기 등심', '육류', 'kg', '한우 등심'),
  ('660e8400-e29b-41d4-a716-446655440014', '닭고기 가슴살', '육류', 'kg', '국산 닭가슴살'),
  ('660e8400-e29b-41d4-a716-446655440015', '닭고기 다리살', '육류', 'kg', '국산 닭다리살'),
  
  -- 생선
  ('660e8400-e29b-41d4-a716-446655440021', '고등어', '생선', 'kg', '국산 고등어'),
  ('660e8400-e29b-41d4-a716-446655440022', '갈치', '생선', 'kg', '국산 갈치'),
  ('660e8400-e29b-41d4-a716-446655440023', '연어', '생선', 'kg', '노르웨이산 연어'),
  ('660e8400-e29b-41d4-a716-446655440024', '오징어', '생선', 'kg', '국산 오징어'),
  
  -- 유제품
  ('660e8400-e29b-41d4-a716-446655440031', '우유', '유제품', '리터', '서울우유 1L'),
  ('660e8400-e29b-41d4-a716-446655440032', '버터', '유제품', 'g', '서울우유 버터 450g'),
  ('660e8400-e29b-41d4-a716-446655440033', '치즈', '유제품', 'g', '체다치즈 슬라이스'),
  ('660e8400-e29b-41d4-a716-446655440034', '요구르트', '유제품', '개', '플레인 요구르트'),
  
  -- 곡물
  ('660e8400-e29b-41d4-a716-446655440041', '쌀', '곡물', 'kg', '국산 백미'),
  ('660e8400-e29b-41d4-a716-446655440042', '밀가루', '곡물', 'kg', '중력분 밀가루'),
  ('660e8400-e29b-41d4-a716-446655440043', '현미', '곡물', 'kg', '국산 현미'),
  
  -- 조미료
  ('660e8400-e29b-41d4-a716-446655440051', '소금', '조미료', 'kg', '천일염'),
  ('660e8400-e29b-41d4-a716-446655440052', '설탕', '조미료', 'kg', '백설탕'),
  ('660e8400-e29b-41d4-a716-446655440053', '간장', '조미료', 'ml', '조선간장 500ml'),
  ('660e8400-e29b-41d4-a716-446655440054', '된장', '조미료', 'g', '전통 된장 500g'),
  ('660e8400-e29b-41d4-a716-446655440055', '고추장', '조미료', 'g', '태양초 고추장 500g'),
  ('660e8400-e29b-41d4-a716-446655440056', '식용유', '조미료', 'ml', '대두유 900ml'),
  ('660e8400-e29b-41d4-a716-446655440057', '참기름', '조미료', 'ml', '참기름 320ml');

-- 가격 정보 샘플 데이터 (최근 30일간의 가격 변동 시뮬레이션)
DO $$
DECLARE
  supplier_rec RECORD;
  ingredient_rec RECORD;
  base_price DECIMAL(10,2);
  price_variation DECIMAL(10,2);
  days_ago INTEGER;
  random_factor DECIMAL(3,2);
BEGIN
  -- 각 공급업체와 식자재 조합에 대해 가격 데이터 생성
  FOR supplier_rec IN SELECT id, name FROM suppliers LOOP
    FOR ingredient_rec IN SELECT id, name, unit FROM ingredients LOOP
      -- 기본 가격 설정 (식자재별로 다른 가격대)
      CASE 
        WHEN ingredient_rec.name LIKE '%소고기%' THEN base_price := 25000 + (random() * 10000);
        WHEN ingredient_rec.name LIKE '%돼지고기%' THEN base_price := 8000 + (random() * 4000);
        WHEN ingredient_rec.name LIKE '%닭고기%' THEN base_price := 6000 + (random() * 3000);
        WHEN ingredient_rec.name LIKE '%연어%' THEN base_price := 15000 + (random() * 5000);
        WHEN ingredient_rec.name LIKE '%고등어%' OR ingredient_rec.name LIKE '%갈치%' THEN base_price := 8000 + (random() * 3000);
        WHEN ingredient_rec.name LIKE '%우유%' THEN base_price := 2500 + (random() * 500);
        WHEN ingredient_rec.name LIKE '%쌀%' THEN base_price := 3000 + (random() * 1000);
        WHEN ingredient_rec.name IN ('양파', '당근', '감자') THEN base_price := 1500 + (random() * 1000);
        WHEN ingredient_rec.name LIKE '%대파%' THEN base_price := 2000 + (random() * 1500);
        WHEN ingredient_rec.name LIKE '%마늘%' THEN base_price := 8000 + (random() * 3000);
        WHEN ingredient_rec.name LIKE '%배추%' THEN base_price := 3000 + (random() * 2000);
        ELSE base_price := 2000 + (random() * 3000);
      END CASE;
      
      -- 공급업체별 가격 조정 (일부는 더 비싸고 일부는 더 저렴)
      CASE supplier_rec.name
        WHEN '마켓컬리' THEN base_price := base_price * 1.1; -- 10% 더 비쌈
        WHEN '쿠팡' THEN base_price := base_price * 0.95; -- 5% 더 저렴
        WHEN 'G마켓' THEN base_price := base_price * 0.98; -- 2% 더 저렴
        WHEN '농협하나로마트' THEN base_price := base_price * 0.90; -- 10% 더 저렴
        ELSE base_price := base_price; -- 기본 가격 유지
      END CASE;
      
      -- 지난 30일간의 가격 데이터 생성
      FOR days_ago IN 0..29 LOOP
        random_factor := 0.8 + (random() * 0.4); -- 0.8 ~ 1.2 사이의 변동
        price_variation := base_price * random_factor;
        
        -- 가격이 0보다 작으면 최소 가격으로 설정
        IF price_variation < 100 THEN
          price_variation := 100;
        END IF;
        
        -- 80% 확률로 가격 데이터 삽입 (일부 날짜는 가격 정보 없음)
        IF random() > 0.2 THEN
          INSERT INTO price_records (
            ingredient_id, 
            supplier_id, 
            price, 
            unit, 
            source, 
            created_at
          ) VALUES (
            ingredient_rec.id,
            supplier_rec.id,
            price_variation,
            ingredient_rec.unit,
            'scraping',
            NOW() - INTERVAL '1 day' * days_ago - INTERVAL '1 hour' * (random() * 24)
          );
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;