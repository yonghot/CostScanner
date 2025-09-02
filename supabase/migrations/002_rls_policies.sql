-- Row Level Security (RLS) 정책 설정
-- 사용자별 데이터 격리 및 보안

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_reports ENABLE ROW LEVEL SECURITY;

-- 프로필 정책 (사용자는 자신의 프로필만 접근 가능)
CREATE POLICY "사용자는 자신의 프로필만 조회 가능" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "사용자는 자신의 프로필만 업데이트 가능" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "새 사용자 프로필 생성 가능" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 공급업체 정책 (모든 인증된 사용자가 조회 가능, 관리자만 수정)
CREATE POLICY "인증된 사용자는 공급업체 조회 가능" ON public.suppliers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "서비스 역할만 공급업체 생성/수정 가능" ON public.suppliers
  FOR ALL TO service_role USING (true);

-- 식자재 정책 (모든 인증된 사용자가 조회 가능, 관리자만 수정)
CREATE POLICY "인증된 사용자는 식자재 조회 가능" ON public.ingredients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "서비스 역할만 식자재 생성/수정 가능" ON public.ingredients
  FOR ALL TO service_role USING (true);

-- 가격 정보 정책 (모든 인증된 사용자가 조회 가능, 시스템이 생성)
CREATE POLICY "인증된 사용자는 가격 정보 조회 가능" ON public.price_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "서비스 역할만 가격 정보 생성/수정 가능" ON public.price_records
  FOR ALL TO service_role USING (true);

-- 레시피 정책 (사용자는 자신의 레시피만 접근)
CREATE POLICY "사용자는 자신의 레시피만 조회 가능" ON public.recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 레시피만 생성 가능" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 레시피만 수정 가능" ON public.recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 레시피만 삭제 가능" ON public.recipes
  FOR DELETE USING (auth.uid() = user_id);

-- 레시피-식자재 정책 (해당 레시피 소유자만 접근)
CREATE POLICY "레시피 소유자만 식자재 연결 조회 가능" ON public.recipe_ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = recipe_ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "레시피 소유자만 식자재 연결 생성 가능" ON public.recipe_ingredients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = recipe_ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "레시피 소유자만 식자재 연결 수정 가능" ON public.recipe_ingredients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = recipe_ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "레시피 소유자만 식자재 연결 삭제 가능" ON public.recipe_ingredients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = recipe_ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- 가격 알림 정책 (사용자는 자신의 알림만 접근)
CREATE POLICY "사용자는 자신의 가격 알림만 조회 가능" ON public.price_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 가격 알림만 생성 가능" ON public.price_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 가격 알림만 수정 가능" ON public.price_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 가격 알림만 삭제 가능" ON public.price_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- 알림 정책 (사용자는 자신의 알림만 접근)
CREATE POLICY "사용자는 자신의 알림만 조회 가능" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "시스템은 사용자에게 알림 생성 가능" ON public.notifications
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "사용자는 자신의 알림만 수정 가능" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 비용 리포트 정책 (사용자는 자신의 리포트만 접근)
CREATE POLICY "사용자는 자신의 리포트만 조회 가능" ON public.cost_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 리포트만 생성 가능" ON public.cost_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 리포트만 수정 가능" ON public.cost_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 리포트만 삭제 가능" ON public.cost_reports
  FOR DELETE USING (auth.uid() = user_id);

-- 프로필 자동 생성 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$;

-- 새 사용자 가입 시 프로필 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();