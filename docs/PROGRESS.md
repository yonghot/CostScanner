# PROGRESS.md - CostScanner 진행률 추적

> 마지막 갱신: 2026-04-17 (프로젝트 이어받기 자동화 완료)

## 📊 전체 진행률: 70%

```
P0 (5/5) ████████████████████ 100% — 식자재/공급업체/가격/레시피/데모 완료
P1 (0/2) ░░░░░░░░░░░░░░░░░░░░  0% — 알림/자동수집 부분 구현
P2 (0/1) ░░░░░░░░░░░░░░░░░░░░  0% — 리포트 인터페이스만
P3 (0/1) ░░░░░░░░░░░░░░░░░░░░  0% — 멀티점포 미시작
```

## 🎯 즉시 액션 (P0 — 배포 전 필수)

### 사용자 액션
- [ ] **`.env.local` Supabase 키 입력** (11개 placeholder, B3)
- [ ] **Vercel 프로젝트 생성 + `vercel link`** (B4)
- [ ] **admin/demo Auth 사용자 생성** + 002 시드 사용자 ID 치환 (B5, supabase/seed/README.md 절차)

### Claude 후속 작업 (사용자 승인 필요)
- [ ] **B1 multi-tenant 격리** — modules에 userId 주입 (1~2일, 큰 변경)
- [ ] **B2 data-collector 결정** — 실제 puppeteer/tesseract 구현 vs 기능 플래그 비활성화
- [ ] 테스트 TS 211 에러 정리: `tsconfig.json` types에 `["jest","@testing-library/jest-dom"]` 추가

## 🚧 단기 (1주)

- [ ] CLAUDE.md 467줄 → 200줄 이하로 분할 (서브룰 CLAUDE.md로 이전)
  - 루트 CLAUDE.md는 보존 대상이므로 **사용자 확인 후** 진행
- [ ] 핵심 4개 P0 기능 E2E 시나리오 검증 (Playwright)
- [ ] cost-analyzer-impl 단위 테스트 추가 (현재 커버리지 10% → 40% 목표)

## 🔭 중기 (2~4주)

- [ ] **F5 알림 완성**: Resend 통합 + price_alerts 트리거 + 알림 설정 UI
- [ ] **F6 자동 수집 PoC**: 1개 사이트 스크래핑 + 영수증 OCR 한글 검증
- [ ] Vercel 프로덕션 배포 + Supabase 프로덕션 인스턴스 분리

## 🧭 장기 (1~3개월)

- [ ] F7 리포트 생성 (PDF + Excel)
- [ ] @supabase/auth-helpers-nextjs → @supabase/ssr 마이그레이션
- [ ] F8 멀티 점포 / 프랜차이즈 본부 데이터 모델
- [ ] 보안 감사 (RLS 검증, 시크릿 처리, OWASP Top 10)

## 📌 판단 필요 (오너 컨펌 필요)

| 질문 | 영향 | 마감 |
|------|------|------|
| 1차 타겟: 단일 점주 vs 프랜차이즈 본부 | UI/DB 모델 분기점 | Sprint 1 시작 전 |
| 가격 수집 방식 우선순위 (수기/OCR/스크래핑/API) | F6 구현 방향 | Sprint 2 시작 전 |
| 결제 모델 (구독/Freemium/일회) | 인증/권한 설계 | 베타 출시 전 |
| 모바일 우선 vs 데스크탑 우선 | 디자인 리소스 배분 | Sprint 1 |
| 스크래핑 대상 사이트 (마켓컬리/오아시스/...) | 합법성 + 기술 리소스 | F6 PoC 전 |

## 🚨 배포 차단 항목 (2026-04-17 추가, Step 3 검증 결과)

3-way 병렬 검증 (code-reviewer + security-auditor + test-runner) 결과 종합:

### 세션 내 해결 (3건)
| ID | 항목 | 조치 | 검증 |
|----|------|------|------|
| F1 | Next.js 14.0.4 SSRF/Cache poisoning | 14.2.35 업그레이드 | npm ls 확인 |
| F2 | Zod 입력 검증 누락 | /api/analyze에 discriminatedUnion 스키마 적용 | type-check pass |
| F3 | 표준 응답 포맷 위반 `{success,data?,error?}` | analyze + collect 라우트 일괄 수정 | type-check pass |

### 미해결 차단 사유 (배포 절대 불가)
| ID | 카테고리 | 항목 | 권장 조치 |
|----|----------|------|-----------|
| B1 | 🔴 Critical | Multi-tenant IDOR / RLS 우회 | 모듈(cost-analyzer, scheduler) 시그니처에 `userId`/`orgId` 강제 주입 + request-scoped supabase client 전달. 추정 시간: 1~2일 |
| B2 | 🔴 Critical | data-collector 스텁 라이브러리 (puppeteer/tesseract no-op) | 실제 설치 또는 `FEATURE_DATA_COLLECTION=false` 플래그로 라우트 비활성화. **현 세션에서 /api/collect는 503으로 차단 처리 완료** |
| B3 | 🚨 외부 인프라 | `.env.local` placeholder 11건 | 사용자가 Supabase 프로젝트 생성 + 키 입력 |
| B4 | 🚨 외부 인프라 | Vercel 미연동 | `vercel link` + 환경변수 설정 |
| B5 | 🚨 외부 인프라 | admin/demo Auth 사용자 미생성 | Supabase Studio에서 수동 생성 후 002 시드 사용자 ID 치환 |

### 미해결 High 우선순위 (배포 차단은 아니나 강하게 권장)
- @supabase/auth-helpers-nextjs (deprecated) → @supabase/ssr 마이그레이션
- 클라이언트 supabase 인스턴스를 서버 모듈에서 사용 (RLS 컨텍스트 미전달)
- `any` 남용 (cost-analyzer-impl, web-scraping-collector, logger)
- division by zero (cost-analyzer-impl `1 - std/avg`, `calculateLinearTrend`)
- race condition (`executeJob` `isRunning` non-atomic)
- npm dev 의존성 high 12건 (eslint, typescript-eslint)

## 📜 변경 이력

| 일자 | 변경 | 작업자 |
|------|------|--------|
| 2026-04-17 | 프로젝트 이어받기 자동화 (하네스 18개 파일 생성, 기존 4개 보존) | Claude Code |
| 2026-04-17 | 상용화 시도: design-gap-analysis, P0 시드 (002), Next.js 14.2.35 업그레이드, Zod + 응답 포맷 표준화, /api/collect 503 차단, 3-way 병렬 검증 (review/security/test) 통합 | Claude Code |
| 2026-04-19 | **2026 디자인 리뉴얼 적용** (Claude Design 핸드오프 번들 통합): Phase 1 토큰 (Pretendard, 크림 뉴트럴 #FBF8F1, 한국형 금융 UX price-up/down, ink-* 스케일, Major Third 타입 스케일, 차트 6색), Phase 2 차트 컴포넌트 5개 (Sparkline, RadarChart, ScatterQuadrant, CostDNABar, PriceChange) at `src/components/ui/charts/`, Phase 3 시범: DashboardOverview 마이그레이션 (히어로 카드 + Sparkline KPI + PriceChange chip), Phase 3 플레이북 docs/PHASE_3_PLAYBOOK.md 보관 (나머지 5화면) | Claude Code |
| 2026-04-19 | **Phase 3 전체 화면 마감** (Two-pass + 3-way 병렬, ultraplanSessionId: two-pass-3way-2026-04-19): Group A Auth(2-col + AuthVisualPanel + 비밀번호 강도 + 카카오/네이버 소셜), Group B Ingredients(split view + sticky 상세 + Sparkline 행) + Recipes(카드 리스트 + 원가율 chip + CostDNABar + AI 배너), Group C Suppliers(Tabs 매트릭스/리스트 + RadarChart + ScatterQuadrant) + Reports(26주 LineChart + CSS Grid 히트맵 + 액션 카드 3종) + Landing(cream 그라데이션 히어로 + 신뢰 지표 3종). type-check 0 / lint 0 errors / 231 warnings(non-blocking) | Claude Code |
| 2026-04-19 | **Anti-Slop 감사 로그** (Pass 2): 금지어 grep(Inter 폰트 0건, false-positive setInterval만), 임의 hex 0건, tabular-nums 신규 컴포넌트 100% 커버. Playwright 393/1024/1440/1920 스크린샷은 dev 서버 차단(Supabase env placeholder)으로 미수행 → 코드 레벨 자체 검사로 대체. severity matrix: P0=0, P1=0(코드 한정) | Claude Code |

## 🔗 관련 문서

- [PRD.md](../PRD.md) — 제품 요구사항 정의서 (656줄, 보존)
- [CLAUDE.md](../CLAUDE.md) — 프로젝트 가이드 (467줄, 보존, **분할 권장**)
- [DESIGN.md](../DESIGN.md) — 디자인 시스템 (보존)
- [REVIEW.md](../REVIEW.md) — 코드베이스 리뷰
- [RESEARCH.md](../RESEARCH.md) — 도메인/기술 리서치
- [docs/architecture.md](./architecture.md) — 시스템 아키텍처
- [docs/prd-analysis.md](./prd-analysis.md) — PRD 역추출 분석
- [feature_list.json](../feature_list.json) — 기능 인벤토리
