# Phase 3 — 화면 단위 리디자인 플레이북

이 문서는 각 화면을 **프로토타입 기준으로 점진 마이그레이션**하는 단계별 가이드입니다.
전체 파일 재작성 대신, **이미 동작하는 Supabase/React Query 로직은 보존**하고 UI 레이어만 교체하는 접근을 권장합니다.

## 공통 원칙

1. **Feature flag로 점진 배포** — 각 화면마다 `?v=2` 쿼리나 `NEXT_PUBLIC_DESIGN_V2` env로 전환
2. **Phase 1 토큰, Phase 2 컴포넌트 선적용 확인** — 이 둘 없이는 시작 금지
3. **한 화면당 한 PR** — diff 리뷰 가능한 크기 유지
4. **tabular-nums 필수** — 숫자는 예외 없이 `.tabular-nums` 또는 `tabular-nums` 유틸 적용

---

## 3.1 Dashboard Overview (`/dashboard`)

**참고 프로토타입:** `dashboard.html`

### 구조 변경
- 기존 `stats` 배열 → 4-column KPI 그리드 유지, 각 카드에 `<Sparkline>` 추가
- `recentAlerts` / `priceChanges` → `<PriceChange chip />` 컴포넌트로 교체
- 신규: 상단 "오늘의 총 원가" 히어로 카드 (`DashboardPreview.tsx`의 히어로 스타일 차용)

### diff 포인트
```tsx
// Before
<p className={getPriceChangeColor(change)}>{formatPercent(change)}</p>

// After
<PriceChange change={change} chip size="sm" />
```

### 신규 섹션
- 카테고리별 지출 도넛 (Recharts `PieChart` 유지, `chartSeriesColors` 적용)
- 실시간 알림 사이드바 (기존 알림 로직 재사용)

---

## 3.2 Ingredients (`/dashboard/ingredients`)

**참고 프로토타입:** `ingredients.html`

### 변경점
- `IngredientsTable.tsx` → 분할 뷰(Split view) 레이아웃
  - 좌측: 기존 테이블 + 각 행에 `<Sparkline>` 셀 추가
  - 우측: 선택된 식자재 상세 패널 (sticky, `position: sticky; top: 24`)
- 카테고리 필터 → pill 버튼 그룹 (`ink-900` 활성, `ink-50` 비활성)
- 검색 인풋 → 아이콘 좌측 정렬 (lucide `Search`)

### 상세 패널 구성
1. 헤더 (카테고리 칩 + 이름 + 이모지)
2. 현재 단가 + `<PriceChange size="lg">`
3. 30일 추이 `<Sparkline>` (큰 사이즈 380×80)
4. 공급업체 실시간 가격 순위 (4곳, 1위 하이라이트)
5. CTA 버튼: 알림 설정 / 최저가로 발주

---

## 3.3 Suppliers (`/dashboard/suppliers`)

**참고 프로토타입:** `suppliers.html`

### 시그니처 변경
- `SuppliersTable.tsx` → **사분면 매트릭스 뷰** 신규 (탭으로 "리스트/매트릭스" 전환)
- `<ScatterQuadrant>` 사용: x=가격점수, y=품질점수, r=배송신뢰도

### 상세 카드 3종
| 카드 | 컴포넌트 |
|------|---------|
| 다차원 점수 | `<RadarChart axes={['가격','신뢰','속도','품질','다양성']} />` |
| 대표 품목 가격 | 수평 바 (기존 Progress 컴포넌트 활용) |
| 배송 기록 | Recharts `BarChart` + `chartSeriesColors[0]` |

---

## 3.4 Recipes (`/dashboard/recipes`)

**참고 프로토타입:** `recipes.html`

### 핵심: "원가 DNA" 시각화
- `RecipeDetailsModal.tsx` → 메뉴 선택 시 `<CostDNABar>` 노출
- 재료별 테이블 각 행에 `<PriceChange>` + 변동 바
- 하단 "AI 원가 개선 제안" 배너 (brand-50 배경, brand-500 아이콘)

### 좌측 사이드 리스트
- 각 메뉴 카드에 원가율 칩 표시 (30% 미만 = 초록, 40% 이상 = 빨강)

---

## 3.5 Reports (`/dashboard/reports`)

**참고 프로토타입:** `reports.html`

### 신규 컴포넌트 2개
1. **26주 멀티라인 차트** — Recharts `LineChart` + `chartSeriesColors[0..2]`, stacked area
2. **계절성 히트맵** — CSS Grid 12×6, 셀 배경색을 데이터 값으로 interpolate

### 히트맵 구현 힌트
```tsx
const cellColor = (v: number) => {
  if (v < 0.33) return `rgba(31, 157, 85, ${0.15 + v * 1.5})`  // down
  if (v < 0.66) return `rgba(242, 169, 0, ${0.15 + (v-0.33) * 2})` // warn
  return `rgba(255, 122, 0, ${0.25 + (v-0.66) * 2})` // up
}
```

### 하단 "이번 주 액션 아이템" 3카드
- 매입 전략 / 메뉴 조정 / 공급처 변경
- 각각 icon + tag + title + desc + "자세히 보기" CTA

---

## 3.6 Auth (`/auth/login`, `/auth/signup`)

**참고 프로토타입:** `auth.html`

### 2-column 레이아웃
- 좌측: 기존 `LoginForm` / `SignUpForm` 유지, 스타일만 업데이트
  - 탭 전환 (`@radix-ui/react-tabs` 이미 설치됨 ✅)
  - 비밀번호 강도 표시기 (4 bar)
  - `react-hook-form` + `zod` 그대로 유지
- 우측: `auth-visual` 다크 패널
  - 실시간 가격 프리뷰 (모의 데이터 2.4초마다 순환)
  - "1,247 활성 매장 / ₩8.2억 월 절약 / 96% 재계약율" 소셜프루프

### 소셜 로그인
- 카카오(`#FEE500`), 네이버(`#03C75A`) 버튼 이미 우측 지원
- Supabase OAuth provider에 카카오/네이버 등록 필요 (별도 작업)

---

## 🗓️ 제안 일정

| Sprint | 작업 | PR 수 |
|--------|------|-------|
| S0 | Phase 1 토큰 + Phase 2 컴포넌트 머지 | 1 |
| S1 | Dashboard Overview, Auth | 2 |
| S2 | Ingredients, Recipes | 2 |
| S3 | Suppliers, Reports | 2 |
| S4 | Feature flag 해제, 레거시 코드 제거 | 1 |

총 8개 PR, 약 4 스프린트 (2주 기준).

---

## 🔗 참고 파일

이 프로토타입 프로젝트 내:
- `index.html` — 전체 허브 (Tweaks로 컬러 실험 가능)
- `dashboard.html` / `ingredients.html` / `suppliers.html` / `recipes.html` / `reports.html` / `auth.html`
- `shared/common.jsx` — 원본 컴포넌트 (참조용)
- `shared/tokens.css` — 디자인 토큰 레퍼런스
