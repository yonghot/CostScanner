# Supabase Seed Data - CostScanner

> 002 시드는 admin/demo 사용자 의존. 실행 절차 준수 필수.

## 실행 순서

### 0. 사전 조건
- Supabase 프로젝트 생성 완료
- `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 설정
- `supabase/migrations/001_*` 적용 완료

### 1. Auth 사용자 생성 (Supabase Studio)
**Authentication → Users → Add user** (Invite + email confirmed):
- `admin@costscanner.local` / `Admin123!`
- `demo@costscanner.local` / `Demo123!`

생성 후 각각의 **UUID를 메모**.

### 2. 002 시드 사용자 ID 치환
`002_users_and_p0_data.sql`의 다음 두 UUID를 위에서 메모한 실제 ID로 치환:
- `00000000-0000-0000-0000-000000000001` → admin auth UID
- `00000000-0000-0000-0000-000000000002` → demo auth UID

### 3. 시드 실행 순서
```bash
# 옵션 A: Supabase CLI (로컬)
npx supabase db reset           # migrations 재적용
psql $DATABASE_URL -f supabase/seed/001_sample_data.sql
psql $DATABASE_URL -f supabase/seed/002_users_and_p0_data.sql

# 옵션 B: Supabase Studio SQL Editor
# 001 → 002 순서로 붙여넣고 실행
```

## 시드 데이터 구성

| 시드 | 내용 | 행 수 |
|------|------|-------|
| 001 | suppliers (8) + ingredients (~30) | ~38 |
| 002 | users (2) + price_records (~180) + recipes (2) + recipe_ingredients (5) + price_alerts (2) + notifications (1) + collection_jobs (1) | ~193 |

## 테스트 계정

| 역할 | 이메일 | 비밀번호 | 권한 |
|------|--------|----------|------|
| 관리자 | admin@costscanner.local | Admin123! | role: admin |
| 데모 사용자 | demo@costscanner.local | Demo123! | role: user |

> ⚠️ 프로덕션 배포 시 위 비밀번호 절대 사용 금지. 시연/QA 전용.

## 데모 모드 (DemoContext)

`/demo` 경로는 인증 없이 접근 가능. 시드 DB와 무관하게 `src/lib/mock-data.ts` 정적 데이터 사용.
