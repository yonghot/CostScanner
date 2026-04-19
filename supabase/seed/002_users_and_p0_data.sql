-- 002_users_and_p0_data.sql
-- admin + demo 사용자 시드 + P0 기능별 데이터 보강
-- ⚠️ 실행 전 필수:
--   1. Supabase Studio Authentication에서 다음 사용자를 먼저 생성:
--      - admin@costscanner.local / Admin123! (id를 메모)
--      - demo@costscanner.local / Demo123! (id를 메모)
--   2. 아래 ADMIN_UID, DEMO_UID 값을 실제 auth.users.id로 치환

-- ===== 사용자 프로필 =====

INSERT INTO public.users (id, email, name, company_name, phone, role, settings)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@costscanner.local',  '관리자',     'CostScanner', '010-0000-0000', 'admin', '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'demo@costscanner.local',   '데모 사용자', '데모 식당',     '010-1234-5678', 'user',  '{}'::jsonb)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    role = EXCLUDED.role;

-- ===== 가격 이력 (최근 30일, 4개 식자재 × 3개 공급업체) =====

DO $$
DECLARE
  ingr UUID;
  supp UUID;
  d INT;
  base_price NUMERIC;
  noise NUMERIC;
BEGIN
  -- 양파, 돼지고기 목살, 우유, 쌀
  FOR ingr IN SELECT id FROM (VALUES
    ('660e8400-e29b-41d4-a716-446655440001'::uuid, 3500),
    ('660e8400-e29b-41d4-a716-446655440011'::uuid, 18000),
    ('660e8400-e29b-41d4-a716-446655440031'::uuid, 2900),
    ('660e8400-e29b-41d4-a716-446655440041'::uuid, 5500)
  ) AS t(id, base_price) LOOP
    NULL;
  END LOOP;
END $$;

-- 단순 INSERT (실 데이터 — 양파)
INSERT INTO public.price_records (ingredient_id, supplier_id, price, recorded_at, source)
SELECT
  '660e8400-e29b-41d4-a716-446655440001'::uuid,
  s.id,
  3500 + (random() * 800 - 400)::int,
  now() - (i || ' days')::interval,
  'manual'
FROM (SELECT id FROM public.suppliers LIMIT 3) s
CROSS JOIN generate_series(1, 30) i
ON CONFLICT DO NOTHING;

-- 돼지고기 목살
INSERT INTO public.price_records (ingredient_id, supplier_id, price, recorded_at, source)
SELECT
  '660e8400-e29b-41d4-a716-446655440011'::uuid,
  s.id,
  18000 + (random() * 4000 - 2000)::int,
  now() - (i || ' days')::interval,
  'manual'
FROM (SELECT id FROM public.suppliers LIMIT 3) s
CROSS JOIN generate_series(1, 30) i
ON CONFLICT DO NOTHING;

-- ===== 레시피 (demo 사용자) =====

INSERT INTO public.recipes (id, user_id, name, description, selling_price)
VALUES
  ('770e8400-e29b-41d4-a716-446655440001',
   '00000000-0000-0000-0000-000000000002',
   '제육볶음 정식', '돼지고기 목살 + 채소 베이스', 12000),
  ('770e8400-e29b-41d4-a716-446655440002',
   '00000000-0000-0000-0000-000000000002',
   '김치찌개', '돼지고기 + 김치 + 두부', 9000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, quantity)
VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440011', 0.20),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 0.10),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440005', 0.02),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440011', 0.15),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440007', 0.30)
ON CONFLICT DO NOTHING;

-- ===== 가격 알림 =====

INSERT INTO public.price_alerts (id, user_id, ingredient_id, threshold_price, status)
VALUES
  ('880e8400-e29b-41d4-a716-446655440001',
   '00000000-0000-0000-0000-000000000002',
   '660e8400-e29b-41d4-a716-446655440011', 16000, 'active'),
  ('880e8400-e29b-41d4-a716-446655440002',
   '00000000-0000-0000-0000-000000000002',
   '660e8400-e29b-41d4-a716-446655440001',  3000, 'active')
ON CONFLICT (id) DO NOTHING;

-- ===== 알림 기록 (시각화용 1건) =====

INSERT INTO public.notifications (id, user_id, type, content, created_at)
VALUES
  ('990e8400-e29b-41d4-a716-446655440001',
   '00000000-0000-0000-0000-000000000002',
   'in_app',
   '{"title":"양파 가격 알림","body":"양파 가격이 임계값(₩3,000)에 도달했습니다."}'::jsonb,
   now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- ===== 수집 작업 (demo 사용자, 비활성) =====

INSERT INTO public.collection_jobs (id, user_id, schedule, status, last_run)
VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001',
   '00000000-0000-0000-0000-000000000002',
   '0 6 * * *',
   'paused',
   now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;
