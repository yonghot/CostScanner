# Architecture - CostScanner

> 자동 생성: 2026-04-17 | 시스템 아키텍처 명세

## 1. 전체 구조

```
┌──────────────────────────────────────────────────────────┐
│                  Browser (React Client)                   │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │  Landing   │  │  Dashboard  │  │  Demo Mode       │  │
│  │   Pages    │  │    Pages    │  │  (DemoContext)   │  │
│  └────────────┘  └─────────────┘  └──────────────────┘  │
└─────────────────────┬─────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼─────────────────────────────────────┐
│              Next.js 14 App Router (Vercel)               │
│  ┌────────────────────────┐  ┌─────────────────────────┐ │
│  │  Server Components     │  │  Route Handlers (API)   │ │
│  │  (RSC, default)        │  │  /api/analyze           │ │
│  │                        │  │  /api/collect           │ │
│  └────────────────────────┘  └─────────────┬───────────┘ │
│                                             │              │
│  ┌────────────────────────────────────────────────────┐  │
│  │           Business Modules (src/modules/)          │  │
│  │  cost-analyzer  data-collector  notification  report│  │
│  └─────────────────────────┬────────────────────────────┘  │
└─────────────────────────────┼─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                       Supabase                            │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Auth     │  │  PostgreSQL  │  │  Storage        │  │
│  │ (RLS+JWT)  │  │  (10 tables) │  │  (receipts/imgs)│  │
│  └────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
│  Resend      │    │  Twilio          │   │  Google      │
│  (이메일)    │    │  (SMS)           │   │  Vision OCR  │
└──────────────┘    └──────────────────┘   └──────────────┘
```

## 2. 레이어 책임

### 2.1 Presentation Layer (`src/app/**`, `src/components/**`)
- **App Router 페이지**: 라우팅, 데이터 fetching (RSC), 메타데이터
- **Components**: shadcn/ui 기반 38개 컴포넌트 (ui/, dashboard/, auth/, demo/, landing/)
- **Contexts**: DemoContext (mock 데이터, 비인증 trial)

### 2.2 API Layer (`src/app/api/**`)
- **`/api/analyze`** (POST): price_trend, supplier_comparison, recipe_cost, supplier_analysis
- **`/api/collect`** (POST): start, stop, status (데이터 수집 잡 제어)
- 인증: Supabase 세션 토큰 검증
- 응답 포맷: `{ success: boolean, data?: T, error?: string }`

### 2.3 Business Module Layer (`src/modules/**`)
- **cost-analyzer**: 가격 추세, 공급업체 비교, 레시피 원가 산출
- **data-collector**: WebScraping, OCR, API, Scheduler
- **notification-service**: Email/SMS/Push 추상화
- **report-generator**: PDF/Excel 출력

### 2.4 Data Layer (Supabase)
- **Auth**: Supabase Auth (이메일/패스워드, 추후 OAuth)
- **Database**: PostgreSQL + RLS (사용자별 데이터 격리)
- **Storage**: 영수증 이미지, 리포트 파일

## 3. 데이터 모델 (핵심)

```
users ─┬─ ingredients ──┬─ price_records ── suppliers
       │                │
       │                ├─ recipe_ingredients ── recipes
       │                │
       │                └─ price_alerts ── notifications
       │
       ├─ cost_reports
       └─ collection_jobs
```

자세한 스키마: `supabase/migrations/001_initial_schema_fixed.sql`

## 4. 주요 흐름 (Sequence)

### 4.1 가격 추세 조회
```
User → Dashboard
     → fetch /api/analyze {type: 'price_trend', ingredient_id}
     → Supabase 쿼리 (price_records JOIN ingredients)
     → cost-analyzer 모듈에서 트렌드 계산
     → Recharts 차트로 시각화
```

### 4.2 가격 알림 트리거
```
Cron / Edge Function
  → data-collector (스크래핑/OCR/API)
  → 신규 price_records INSERT
  → DB 트리거 (또는 polling)
  → price_alerts 비교
  → notification-service (이메일/SMS)
  → notifications INSERT (감사 로그)
```

## 5. 배포 구성

- **Frontend/API**: Vercel (Next.js 14, Edge + Node runtime 혼합)
- **DB**: Supabase Managed PostgreSQL
- **OCR**: Tesseract.js (브라우저) + Google Vision (서버 fallback)
- **스크래핑**: 별도 워커 (Vercel 미지원 → Railway/Fly.io 검토 필요)
- **CI/CD**: GitHub → Vercel 자동 배포 (main 브랜치)

## 6. 보안 / 컴플라이언스

- **인증**: Supabase JWT (httpOnly 쿠키)
- **인가**: Postgres RLS (user_id 기반)
- **시크릿**: Vercel 환경 변수, .env.local 절대 커밋 X
- **개인정보**: 한국 PIPA 준수 (회원가입 시 동의, 삭제 권리)

## 7. 미해결 / 향후 결정

[TODO: 오너 확인]
- 스크래핑 워커 호스팅 결정 (Railway / Fly.io / 자체 서버)
- 리포트 PDF 생성 라이브러리 (Puppeteer vs react-pdf)
- 실시간 알림 채널 (Supabase Realtime vs WebSocket vs Push)
- 멀티 테넌트 (단일 사장 vs 프랜차이즈 본부) 데이터 모델 분기 시점
