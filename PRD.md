# CostScanner 프로젝트 요구사항 정의서 (PRD)

## 프로젝트 개요

### 프로젝트명
**CostScanner** - 식자재 최저가 모니터링 및 판매처 탐색 시스템

### 프로젝트 목적
외식업체의 식자재 가격 변동을 실시간으로 모니터링하고 최저가 판매처를 자동으로 탐색하여, 체계적인 원가 관리와 수익성 개선을 지원하는 통합 관리 시스템 개발

### 프로젝트 정체성
- **Domain**: 외식업 식자재 원가 관리 솔루션
- **Target Users**: 식당, 카페, 프랜차이즈 점주 등 외식업 사업자
- **Core Value**: 자동화된 식자재 가격 모니터링과 체계적인 레시피 원가 관리

## 기술 스택

### 개발 환경
- **Platform**: Windows 10/11
- **IDE**: Cursor (Claude Code 통합 개발 환경)
- **Runtime**: Node.js v22.15.0
- **Package Manager**: npm 10.9.2
- **MCP Integration**: 11개 MCP 서버 설치 완료

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **UI Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Chart.js 또는 Recharts (식자재 가격 트렌드 시각화)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

### 백엔드 & 인프라
- **Database**: Supabase (PostgreSQL 기반)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (가격 변동 실시간 알림)
- **Storage**: Supabase Storage (거래명세서 이미지 저장)
- **Deployment**: Vercel (Next.js 최적화 배포)

### 추가 서비스
- **OCR**: Tesseract.js 또는 Google Cloud Vision API
- **Web Scraping**: Puppeteer (식자재 가격 수집)
- **Notifications**: 이메일(Resend), SMS(Twilio) 알림
- **Cron Jobs**: Vercel Cron 또는 GitHub Actions

### 도구 및 라이브러리
- **패키지 관리**: npm
- **버전 관리**: Git
- **타입 체킹**: TypeScript
- **테스팅**: Jest + React Testing Library
- **린팅**: ESLint + Prettier
- **API 검증**: Zod

## 프로젝트 배경

### 외식업 식자재 관리의 현실
- **가격 변동성**: 식자재 가격은 장마, 가뭄 등 이슈 발생 시 5~15배까지 급등
- **대체재 필요성**: 고가격 식자재의 대체품 탐색과 대체 메뉴 개발이 수익성 유지의 핵심
- **관리의 어려움**: 바쁜 업주들이 체계적인 가격 모니터링과 원가 관리에 소홀하기 쉬움
- **시스템 부재**: 소규모 업장의 경우 체계적인 관리 시스템이 없어 원가율조차 파악 못하는 경우 대다수

### 해결해야 할 문제
1. 지속적인 최저가 검색과 판매처 탐색의 자동화 필요
2. 레시피별 정확한 원가율 계산과 관리
3. 거래명세서 관리와 기록 보존
4. 식자재 가격 변동에 따른 즉각적인 대응 체계 구축

## 핵심 기능 요구사항

### 1. 식자재 가격 모니터링 시스템
- **실시간 가격 수집**: 공개 사이트에서 식자재 가격 정보 자동 수집
- **가격 비교 분석**: 동일 식자재의 판매처별 가격 비교
- **가격 알림**: 설정한 임계값 기준 가격 변동 알림
- **최저가 추천**: 현재 시점 최저가 판매처 자동 추천

### 2. 레시피 및 원가 관리
- **레시피 등록**: 메뉴별 레시피와 사용 식자재 입력 관리
- **원가율 계산**: 실시간 식자재 가격 기반 레시피별 원가율 자동 계산
- **원가율 변동 추적**: 식자재 가격 변동에 따른 레시피 원가율 변화 모니터링
- **메뉴 수익성 분석**: 판매가 대비 원가율 분석과 수익성 평가

### 3. 구매 관리 시스템
- **발주서 생성**: 발주 시스템이 없는 업체용 표준 발주서 양식 제공
- **구매 계획**: 최저가 기반 구매 계획 수립 지원
- **공급업체 관리**: 거래 업체별 가격, 품질, 배송 정보 관리
- **구매 이력 관리**: 구매 내역과 가격 변동 이력 추적

### 4. 거래명세서 OCR 처리
- **이미지 업로드**: 거래명세서 원장 이미지 업로드 기능
- **OCR 인식**: 거래명세서에서 날짜, 품목, 규격, 수량, 가격 정보 자동 인식
- **데이터 저장**: 인식된 정보를 구조화하여 데이터베이스 저장
- **원장 관리**: 디지털 거래 원장 보관 및 검색 기능

### 5. 대시보드 및 리포팅
- **실시간 대시보드**: 주요 식자재 가격 동향과 원가율 현황 한눈에 보기
- **가격 트렌드 차트**: 시간별, 일별, 월별 식자재 가격 변화 시각화
- **원가율 리포트**: 메뉴별, 카테고리별 원가율 분석 리포트
- **절약 효과 분석**: 최저가 구매를 통한 절약 금액 및 효과 분석

### 6. 관리자 페이지 시스템
- **시스템 모니터링**: 가격 수집 작업 상태, API 응답 시간, 오류 로그 관리
- **식자재 마스터 관리**: 전체 식자재 데이터베이스 관리, 카테고리 분류, 중복 제거
- **사용자 관리**: 가입 사용자 현황, 구독 상태, 지원 요청 관리
- **가격 데이터 관리**: 수집된 가격 데이터 품질 검증, 이상치 탐지 및 수정
- **공급업체 관리**: 가격 수집 대상 사이트 관리, 스크래핑 정책 설정
- **알림 설정**: 시스템 장애 알림, 사용자 지원 요청 알림
- **통계 대시보드**: 플랫폼 사용량, 인기 식자재, 사용자 행동 분석
- **콘텐츠 관리**: 공지사항, 도움말, FAQ 관리

## 비기능 요구사항

### 성능
- **페이지 로딩**: 초기 페이지 로딩 2초 이내
- **가격 수집**: 식자재 가격 수집 5분 주기로 자동 실행
- **OCR 처리**: 거래명세서 이미지 처리 10초 이내
- **동시 사용자**: 중소규모 외식업체 기준 100명 동시 접속 지원

### 보안
- **사용자 인증**: Supabase Auth를 통한 안전한 로그인
- **데이터 보호**: RLS(Row Level Security)를 통한 사용자별 데이터 격리
- **이미지 보안**: 거래명세서 이미지의 안전한 저장과 접근 제어
- **API 보안**: API 키와 민감 정보의 환경변수 관리

### 사용성
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **직관적 UI**: 비전문가도 쉽게 사용할 수 있는 간단한 인터페이스
- **실시간 알림**: 가격 변동과 중요 이벤트에 대한 즉시 알림
- **오프라인 지원**: PWA를 통한 기본적인 오프라인 기능

### 확장성
- **모듈화**: 새로운 식자재 공급업체 추가 용이성
- **API 설계**: 외부 POS 시스템과의 연동 가능한 API 제공
- **데이터베이스**: Supabase PostgreSQL의 수평적 확장 지원
- **배포**: Vercel을 통한 글로벌 CDN 및 자동 스케일링

## UI/UX 설계 가이드라인

### 완성된 디자인 시스템
> **📋 완전한 디자인 시스템**: [DESIGN.md](./DESIGN.md) 파일에 CostScanner 프로젝트의 완전한 디자인 시스템이 체계적으로 정리되어 있습니다. 모든 디자인 작업 시 필수 참조 문서입니다.

### 디자인 레퍼런스
**B2B SaaS 전문성 기반 디자인 원칙**:
- **JNF 브랜딩**: 오렌지(#FF7A00) 기반 전문적인 브랜딩 시스템
- **전문적인 외관**: B2B SaaS 서비스에 적합한 신뢰감 있는 디자인
- **클린한 타이포그래피**: 6단계 텍스트 스케일과 가독성 최적화
- **직관적 네비게이션**: 명확한 메뉴 구조와 breadcrumb
- **데이터 중심 레이아웃**: 재무 데이터와 통계를 위한 전문 카드 시스템

**디자인 레퍼런스 사이트**:
- **Linear**: 미니멀한 디자인과 뛰어난 성능
- **Notion**: 직관적인 UI/UX와 강력한 기능성
- **Stripe Dashboard**: 금융 데이터 시각화
- **토스페이먼츠**: 금융 데이터 표현과 한국형 UX

### 웹 최적화 UI 원칙
- **데스크톱 우선 설계**: 웹 환경에서의 생산성 극대화
- **멀티 윈도우 지원**: 여러 데이터 비교를 위한 탭/모달 시스템
- **키보드 단축키**: 자주 사용하는 기능의 키보드 접근성
- **대용량 데이터 표시**: 가상화된 테이블과 페이지네이션

### shadcn/ui 기반 디자인 시스템

#### 컬러 팔레트
```css
/* Primary Colors - 식자재/비용 관련 */
--primary: 213 94% 68%;      /* Blue 500 - 신뢰감, 전문성 */
--primary-foreground: 0 0% 98%;

/* Secondary Colors - 가격/절약 관련 */  
--secondary: 142 76% 36%;    /* Green 600 - 절약, 이익 */
--destructive: 0 84% 60%;    /* Red 500 - 가격 상승, 경고 */

/* Background Colors */
--background: 0 0% 100%;     /* White - 깔끔함 */
--card: 0 0% 100%;          /* Card background */
--muted: 210 40% 98%;       /* Light gray - 부가 정보 */
```

#### 타이포그래피 시스템
- **Heading 1**: 2.25rem (36px) - 페이지 제목
- **Heading 2**: 1.875rem (30px) - 섹션 제목
- **Heading 3**: 1.5rem (24px) - 카드 제목
- **Body**: 0.875rem (14px) - 본문 텍스트
- **Small**: 0.75rem (12px) - 부가 정보
- **Font Family**: system-ui, -apple-system, sans-serif

#### 컴포넌트 라이브러리 구성

**기본 UI 컴포넌트**:
- Button, Input, Select, Checkbox, Radio
- Card, Dialog, Sheet, Popover, Tooltip
- Table, Badge, Progress, Skeleton
- Alert, Toast, Form components

**비즈니스 특화 컴포넌트**:
- PriceCard: 가격 정보 표시 카드
- TrendChart: 가격 트렌드 차트
- IngredientSelector: 식자재 선택 컴포넌트
- CostCalculator: 원가율 계산 위젯
- PriceAlert: 가격 알림 설정 패널
- ReceiptUploader: 거래명세서 업로드 영역

#### 레이아웃 시스템
- **Container**: 최대 너비 1280px, 중앙 정렬
- **Grid System**: 12-column CSS Grid 기반
- **Sidebar**: 고정폭 256px, 접기/펼치기 지원
- **Header**: 높이 64px, 고정 헤더
- **Content Area**: 동적 높이, 스크롤 가능

### 반응형 디자인 전략
```css
/* Breakpoints */
--screen-sm: 640px;   /* 태블릿 */
--screen-md: 768px;   /* 중간 태블릿 */
--screen-lg: 1024px;  /* 데스크톱 */
--screen-xl: 1280px;  /* 대형 데스크톱 */

/* Layout adjustments */
Desktop (1024px+): 사이드바 + 메인 콘텐츠 2-column 레이아웃
Tablet (768-1023px): 접이식 사이드바, 메인 콘텐츠 full-width
Mobile (< 768px): 하단 네비게이션, 스택 레이아웃
```

### 접근성 지침
- **키보드 네비게이션**: Tab, Enter, Space, Arrow keys 지원
- **스크린 리더**: ARIA 레이블과 역할 정의
- **색상 대비**: WCAG 2.1 AA 기준 4.5:1 이상
- **포커스 표시**: 명확한 포커스 인디케이터
- **텍스트 크기**: 최소 14px, 확대 200% 지원

## 프로젝트 구조

```
CostScanner/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # 인증 페이지 그룹
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/               # 메인 대시보드
│   ├── ingredients/             # 식자재 관리
│   ├── recipes/                 # 레시피 관리
│   ├── purchase/                # 구매 관리
│   ├── reports/                 # 리포트
│   ├── admin/                   # 관리자 페이지
│   │   ├── dashboard/           # 관리자 대시보드
│   │   ├── users/               # 사용자 관리
│   │   ├── ingredients/         # 식자재 마스터 관리
│   │   ├── suppliers/           # 공급업체 관리
│   │   ├── monitoring/          # 시스템 모니터링
│   │   └── content/             # 콘텐츠 관리
│   ├── settings/                # 설정
│   ├── api/                     # API 라우트
│   │   ├── ingredients/
│   │   ├── recipes/
│   │   ├── purchase/
│   │   └── scraping/
│   ├── globals.css              # 전역 CSS
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 홈페이지
├── components/                   # 재사용 컴포넌트
│   ├── ui/                      # 기본 UI 컴포넌트
│   ├── charts/                  # 차트 컴포넌트
│   ├── forms/                   # 폼 컴포넌트
│   └── layout/                  # 레이아웃 컴포넌트
├── lib/                         # 유틸리티 라이브러리
│   ├── supabase/               # Supabase 클라이언트
│   ├── scraping/               # 웹 스크래핑 로직
│   ├── ocr/                    # OCR 처리
│   └── utils.ts                # 공통 유틸리티
├── types/                       # TypeScript 타입 정의
├── public/                      # 정적 파일
├── supabase/                    # Supabase 설정
│   ├── migrations/             # 데이터베이스 마이그레이션
│   └── seed.sql                # 초기 데이터
├── docs/                        # 프로젝트 문서
│   ├── claude.md               # 개발 지침서
│   ├── PRD.md                  # 요구사항 정의서
│   ├── DESIGN.md               # 완전한 디자인 시스템 문서
│   └── all_prompt.md           # 프롬프트 로그
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example
```

## 개발 단계

### Phase 1: 기본 인프라 구축
- **Next.js 프로젝트 초기화**: TypeScript, Tailwind CSS 설정
- **Supabase 설정**: 데이터베이스 스키마 설계 및 인증 설정
- **기본 UI 컴포넌트**: shadcn/ui 기반 컴포넌트 라이브러리 구축
- **Vercel 배포**: 기본 배포 환경 구성

### Phase 2: 핵심 기능 개발
- **사용자 인증**: 회원가입, 로그인, 프로필 관리
- **식자재 관리**: CRUD 기능과 기본 가격 정보
- **레시피 관리**: 메뉴별 레시피 등록과 원가 계산
- **가격 수집**: 기본적인 웹 스크래핑 로직 구현

### Phase 3: 고도화 기능
- **실시간 가격 모니터링**: 자동 가격 수집과 알림 시스템
- **OCR 기능**: 거래명세서 이미지 처리
- **대시보드**: 가격 트렌드와 원가율 시각화
- **모바일 최적화**: 반응형 디자인 완성

### Phase 4: 완성도 향상
- **성능 최적화**: 이미지 최적화, 캐싱, 코드 스플리팅
- **테스트 코드**: 단위 테스트와 E2E 테스트 작성
- **PWA 구현**: 오프라인 지원과 푸시 알림
- **사용자 피드백**: 베타 테스트와 UI/UX 개선

## 성공 지표

### 기능적 지표
- **가격 정확도**: 수집된 가격 정보의 95% 이상 정확도
- **OCR 정확도**: 거래명세서 인식률 90% 이상
- **응답 속도**: 페이지 로딩 2초 이내, API 응답 1초 이내

### 사용자 지표
- **사용자 만족도**: 베타 테스트 기준 4.5점 이상 (5점 만점)
- **재방문율**: 월 활성 사용자(MAU) 80% 이상
- **기능 활용도**: 핵심 기능별 주 1회 이상 사용률

### 비즈니스 지표
- **원가 절감 효과**: 사용자당 월평균 식자재 비용 5% 이상 절감
- **시간 절약**: 기존 수동 관리 대비 70% 이상 시간 단축
- **오류 감소**: 원가 계산 오류율 90% 이상 감소

## MCP (Model Context Protocol) 통합

### 설치된 MCP 서버 (11개)
| MCP 서버 | 상태 | 용도 |
|----------|------|------|
| **mcp-installer** | ✅ | MCP 서버 설치 도구 |
| **context7** | ✅ | 최신 라이브러리 문서 참조 |
| **g-search-mcp** | ✅ | Google 검색 통합 |
| **sequential-thinking** | ✅ | 단계별 문제 해결 |
| **playwright** | ✅ | 브라우저 자동화 |
| **task-master-ai** | ✅ | AI 태스크 관리 |
| **github-mcp** | ✅ | GitHub API 연동 |
| **figma-mcp** | ⚠️ | Figma 디자인 연동 (API 키 필요) |
| **chadcn-ui** | ✅ | shadcn/ui 컴포넌트 참조 |
| **tosspayments-mcp** | ✅ | 토스페이먼츠 결제 연동 |
| **supabase-mcp** | ✅ | Supabase 데이터베이스 관리 |

### MCP 활용 계획
- **개발 생산성**: context7로 Next.js, Supabase 최신 문서 참조
- **UI 컴포넌트**: chadcn-ui로 식자재 관리용 UI 컴포넌트 참조
- **데이터베이스**: supabase-mcp로 식자재, 레시피, 구매 데이터 관리
- **결제 연동**: tosspayments-mcp로 프리미엄 구독 결제 시스템 구축
- **테스팅**: playwright로 식자재 가격 수집과 OCR 기능 E2E 테스트
- **검색 기능**: g-search-mcp로 식자재 정보와 공급업체 검색

## 데이터베이스 스키마

### 주요 테이블
```sql
-- 사용자 정보 (Supabase Auth 연동)
users (
  id uuid PRIMARY KEY,
  email varchar,
  business_name varchar,
  business_type varchar,
  subscription_plan varchar DEFAULT 'free',
  is_admin boolean DEFAULT false,
  created_at timestamp
)

-- 식자재 마스터
ingredients (
  id uuid PRIMARY KEY,
  name varchar NOT NULL,
  category varchar,
  unit varchar,
  description text,
  created_at timestamp
)

-- 식자재 가격 이력
ingredient_prices (
  id uuid PRIMARY KEY,
  ingredient_id uuid REFERENCES ingredients(id),
  supplier_name varchar,
  price decimal,
  unit varchar,
  source_url varchar,
  collected_at timestamp
)

-- 레시피
recipes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  name varchar NOT NULL,
  serving_size integer,
  selling_price decimal,
  created_at timestamp
)

-- 레시피 재료
recipe_ingredients (
  id uuid PRIMARY KEY,
  recipe_id uuid REFERENCES recipes(id),
  ingredient_id uuid REFERENCES ingredients(id),
  quantity decimal,
  unit varchar
)

-- 구매 내역
purchases (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  supplier_name varchar,
  total_amount decimal,
  receipt_image_url varchar,
  purchase_date date,
  created_at timestamp
)

-- 구매 상세
purchase_items (
  id uuid PRIMARY KEY,
  purchase_id uuid REFERENCES purchases(id),
  ingredient_id uuid REFERENCES ingredients(id),
  quantity decimal,
  unit_price decimal,
  total_price decimal
)

-- 관리자 활동 로그
admin_logs (
  id uuid PRIMARY KEY,
  admin_id uuid REFERENCES users(id),
  action_type varchar,
  target_table varchar,
  target_id uuid,
  description text,
  created_at timestamp
)

-- 시스템 설정
system_settings (
  id uuid PRIMARY KEY,
  setting_key varchar UNIQUE,
  setting_value text,
  description text,
  updated_by uuid REFERENCES users(id),
  updated_at timestamp
)

-- 가격 수집 작업 상태
scraping_jobs (
  id uuid PRIMARY KEY,
  job_name varchar,
  status varchar,
  started_at timestamp,
  completed_at timestamp,
  records_processed integer,
  error_message text
)
```

## 프로젝트 현재 상태 (업데이트: 2025-08-29)

### 완료된 인프라 구축 (Phase 1 + 2A - 95% 완료)

#### 개발 환경 및 도구 설정
- ✅ **개발 환경**: Node.js v22.15.0, npm 10.9.2 안정화 완료
- ✅ **프로젝트 문서**: claude.md, PRD.md, all_prompt.md 체계적 관리
- ✅ **MCP 서버 생태계**: 11개 MCP 서버 설치 및 구성 완료
- ✅ **개발 가이드라인**: 인터페이스 우선 개발, 모듈화 원칙 확립
- ✅ **기술 스택**: Next.js 14 + Supabase + shadcn/ui + TypeScript 통합

#### 핵심 인프라 완성
- ✅ **Next.js 14 프로젝트**: App Router + TypeScript 5.3+ 설정 완료
- ✅ **Tailwind CSS 3.4+**: 완전한 반응형 디자인 시스템
- ✅ **shadcn/ui 컴포넌트 시스템**: 12개 핵심 UI 컴포넌트 + 1개 커스텀 컴포넌트 통합
  - Badge, Button, Card, Dialog, Dropdown Menu, Input, Label, Progress, Separator, Status Badge, Table, Tooltip
- ✅ **프로젝트 구조**: 완전한 모듈화 아키텍처 구현
- ✅ **라우팅 시스템**: 모든 주요 페이지 및 API 라우트 구조화
- ✅ **로컬 개발 환경**: http://localhost:3000 고정 포트 운영

#### 데이터베이스 및 타입 시스템
- ✅ **PostgreSQL 스키마**: 완전한 데이터베이스 설계 구현
  - 8개 ENUM 타입 정의 (ingredient_category, price_source, etc.)
  - 12+ 테이블 구조 및 관계 정의
  - RLS 정책 및 데이터베이스 함수 구현
- ✅ **TypeScript 타입 시스템**: 157줄의 포괄적 타입 정의
  - 25+ 비즈니스 엔티티 인터페이스
  - API 응답 타입 표준화
  - 폼 데이터 및 차트 데이터 타입

#### 완성된 디자인 시스템 (Phase 2A - 95% 완료)
- ✅ **DESIGN.md 생성**: 완전한 디자인 시스템 문서화 (411줄, 9개 주요 섹션)
  - 디자인 철학, 컬러 시스템, 타이포그래피, 컴포넌트 시스템
  - 레이아웃 시스템, 애니메이션 시스템, 기술 스택, 디자인 레퍼런스, 개발 가이드라인
- ✅ **JNF 브랜딩**: 오렌지(#FF7A00) 기반 전문 B2B 색상 시스템
- ✅ **6단계 타이포그래피**: display, headline, title, subtitle, body, caption 스케일
- ✅ **전문 카드 시스템**: professional-card, stats-card B2B 최적화 스타일링
- ✅ **애니메이션 시스템**: fadeIn, scaleIn, slideUp 커스텀 애니메이션
- ✅ **접근성 준수**: WCAG 2.1 AA 기준 색상 대비 및 키보드 내비게이션
- ✅ **반응형 디자인**: 모바일 퍼스트 접근법으로 완전한 반응형 지원

### 완료된 비즈니스 로직 아키텍처 (Phase 2A - 70% 완료)

#### 모듈 인터페이스 정의
- ✅ **데이터 수집 모듈**: 완전한 인터페이스 계약 정의
  - DataCollector, WebScrapingCollector, OCRCollector 인터페이스
  - CollectionScheduler 자동화 시스템 설계
  - Puppeteer 및 Tesseract.js 통합 준비
- ✅ **비용 분석 모듈**: 핵심 분석 로직 인터페이스
  - CostAnalyzer 가격 분석 및 트렌드 계산
  - 레시피 원가 계산 및 수익성 분석
- ✅ **리포트 생성 모듈**: 보고서 생성 인터페이스
  - PDF/Excel 내보내기 계약 정의
- ✅ **알림 서비스 모듈**: 다채널 알림 시스템 설계

#### UI 컴포넌트 및 페이지 구현
- ✅ **인증 시스템**: 로그인/회원가입 컴포넌트 완성
  - AuthLayout, LoginForm, SignUpForm 구현
  - shadcn/ui 기반 일관된 디자인
- ✅ **대시보드 레이아웃**: 완전한 네비게이션 시스템
  - DashboardLayout, DashboardOverview 구현
  - 사이드바 네비게이션 및 반응형 헤더
- ✅ **핵심 페이지 구조**: 모든 주요 기능 페이지 기본 구조
  - 식자재 관리, 공급업체 관리, 레시피 관리
  - 리포트, 설정 페이지 기본 구조

### 현재 구현 상태 (Phase 2B - 70% 완료)

#### 완료된 디자인 시스템 통합
- ✅ **DESIGN.md 문서화**: 411줄의 포괄적 디자인 시스템 가이드
- ✅ **컴포넌트 시스템**: 12개 shadcn/ui + 1개 커스텀 컴포넌트 완전 통합
- ✅ **브랜딩 시스템**: JNF 오렌지 기반 전문 B2B 색상 팔레트
- ✅ **타이포그래피**: 6단계 텍스트 스케일 및 한국어 최적화
- ✅ **애니메이션**: 커스텀 CSS 애니메이션 시스템 (fadeIn, scaleIn, slideUp)

#### 즉시 구현 가능한 기능들
- 🔄 **Supabase 프로덕션 연결**: 환경 설정 완료, 실제 데이터베이스 연동 대기
- 🔄 **인증 플로우**: Supabase Auth 미들웨어 및 콜백 구현 준비
- 🔄 **CRUD 기본 기능**: 식자재, 공급업체, 레시피 관리 기능
- 🔄 **대시보드 데이터 연동**: 실제 데이터와 UI 컴포넌트 연결

#### 구현 대기 중인 핵심 기능
- ⏳ **가격 수집 시스템**: 웹 스크래핑 및 OCR 로직 구현
- ⏳ **실시간 가격 모니터링**: Supabase Realtime 통합
- ⏳ **비용 분석 엔진**: 실제 분석 알고리즘 구현
- ⏳ **리포트 생성**: PDF/Excel 내보내기 기능

### 주요 기술적 성취

#### 아키텍처 및 설계
- **인터페이스 우선 개발**: 모든 비즈니스 로직 모듈의 계약 우선 정의
- **타입 안전성**: 엄격한 TypeScript 설정으로 런타임 오류 사전 방지
- **모듈화 아키텍처**: 4개 주요 모듈의 완전한 인터페이스 분리
  - 데이터 수집 (5개 인터페이스), 비용 분석, 리포트 생성, 알림 서비스
- **컴포넌트 시스템**: shadcn/ui 기반 일관된 디자인 시스템

#### 개발 환경 및 품질
- **빌드 시스템**: 0 TypeScript 오류, 성공적인 프로덕션 빌드
- **의존성 최적화**: 25개 프로덕션 + 13개 개발 의존성 효율적 관리
- **환경 설정**: 보안 환경변수 관리 및 개발/프로덕션 환경 분리
- **코드 품질**: ESLint + Prettier 통합, 일관된 코드 스타일

#### 데이터베이스 및 스키마
- **완전한 PostgreSQL 스키마**: 12+ 테이블, 8개 ENUM 타입
- **보안 설계**: Row Level Security 정책으로 멀티테넌트 보안
- **성능 최적화**: 시계열 데이터 인덱싱 및 한국어 전문검색 지원
- **자동화**: 트리거 기반 updated_at 관리 및 데이터 함수

### 현재 운영 상태 및 접근 가능 기능

#### 로컬 개발 환경
- **개발 서버**: http://localhost:3000 (포트 고정, 자동 충돌 해결)
- **빌드 시간**: ~5초 (최적화된 Next.js 14)
- **핫 리로드**: 실시간 코드 변경 반영
- **타입 체크**: 실시간 TypeScript 검증

#### 구현된 페이지 및 기능
- ✅ **랜딩 페이지** (`/`) - 마케팅 페이지 구조
- ✅ **인증 시스템** (`/auth/login`, `/auth/signup`) - 완전 구현
- ✅ **메인 대시보드** (`/dashboard`) - 개요 위젯 및 네비게이션
- ✅ **식자재 관리** (`/dashboard/ingredients`) - 기본 UI 구조
- ✅ **공급업체 관리** (`/dashboard/suppliers`) - 테이블 컴포넌트
- ✅ **레시피 관리** (`/dashboard/recipes`) - 폼 및 모달 구조
- ✅ **리포트** (`/dashboard/reports`) - 차트 및 분석 레이아웃
- ✅ **설정** (`/dashboard/settings`) - 사용자 설정 인터페이스

#### API 엔드포인트 구조
- ✅ **인증 콜백** (`/auth/callback`) - Supabase 통합 준비
- ✅ **데이터 수집** (`/api/collect`) - 가격 수집 API 기본 구조
- ✅ **분석 엔진** (`/api/analyze`) - 비용 분석 API 인터페이스

### 다음 개발 단계 (Phase 2B - 우선순위)

#### 1단계: 기본 기능 활성화 (1-2주)
1. **Supabase 프로덕션 연결**: 실제 데이터베이스 생성 및 마이그레이션 실행
2. **인증 플로우 완성**: 로그인/로그아웃/회원가입 실제 작동
3. **기본 CRUD 구현**: 식자재, 공급업체 등록/수정/삭제 기능
4. **대시보드 데이터 연동**: 실제 데이터베이스와 UI 컴포넌트 연결

#### 2단계: 핵심 비즈니스 로직 (2-3주)
1. **레시피 관리**: 메뉴 등록 및 원가 계산 로직 구현
2. **기본 가격 수집**: 수동 가격 입력 및 OCR 기능 프로토타입
3. **가격 비교 분석**: 공급업체별 가격 비교 기능
4. **기본 리포트**: 원가율 분석 및 PDF 내보내기

#### 3단계: 자동화 및 고도화 (3-4주)
1. **웹 스크래핑**: Puppeteer 기반 자동 가격 수집
2. **실시간 알림**: 가격 변동 알림 시스템
3. **고급 분석**: 트렌드 분석 및 예측 기능
4. **모바일 최적화**: 반응형 디자인 완성

### 현재 기술 부채 및 개선 사항
- **ESLint 설정 경고**: 비기능적 경고 해결 필요
- **추가 UI 컴포넌트**: Dialog, Select, Checkbox 등 확장
- **오류 처리**: 전역 에러 바운더리 및 API 오류 처리 패턴
- **로딩 상태**: 사용자 경험 개선을 위한 로딩 인디케이터
- **폼 검증**: Zod 기반 클라이언트 검증 강화

## 위험 요소 및 대응 방안

### 기술적 위험
- **웹 스크래핑 차단**: 식자재 사이트의 봇 차단 → User-Agent 로테이션 및 프록시 사용
- **가격 정확성**: 수집된 가격 데이터의 신뢰성 → 다중 소스 교차 검증
- **OCR 정확도**: 거래명세서 인식 오류 → 수동 검증 기능 및 학습 데이터 확장
- **실시간 처리**: 대량 가격 데이터 처리 성능 → Supabase Edge Functions 활용

### 비즈니스 위험
- **사용자 획득**: 외식업체의 디지털 도구 사용 저항 → 직관적 UI와 단계별 온보딩
- **데이터 보안**: 거래 정보 유출 위험 → RLS 적용 및 이미지 암호화 저장
- **확장성**: 사용자 증가 시 인프라 비용 → Vercel과 Supabase의 자동 스케일링 활용
- **경쟁사**: 기존 POS 업체의 유사 기능 출시 → 차별화된 UX와 전문화된 기능