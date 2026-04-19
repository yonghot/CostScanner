# PRD Analysis - CostScanner

> 자동 생성: 2026-04-17 | PRD.md (656줄) 역추출 + 기능 매핑

## 1. PRD 핵심 요약

**제품**: CostScanner — 외식업 식자재 최저가 모니터링 + 판매처 탐색 SaaS
**도메인**: B2B 외식업 SaaS (한국)
**기술 스택**: Next.js 14, TypeScript, Supabase, Tailwind, Tesseract.js, Puppeteer

## 2. 6대 핵심 기능 매핑

| # | 기능 | 현재 상태 | 구현 위치 | 우선순위 |
|---|------|-----------|-----------|----------|
| F1 | 식자재 마스터 관리 | ✅ 구현됨 | src/components/dashboard/ingredients/ | P0 |
| F2 | 공급업체 관리 | ✅ 구현됨 | src/components/dashboard/suppliers/ | P0 |
| F3 | 가격 추적 + 트렌드 | ✅ 구현됨 (analyze API) | src/modules/cost-analyzer/ | P0 |
| F4 | 레시피 원가 계산 | ✅ 구현됨 (recipe_cost) | src/components/dashboard/recipes/ | P0 |
| F5 | 가격 알림 | ⚠️ 부분 (DB 테이블만) | (notification-service 인터페이스만) | P1 |
| F6 | 데이터 자동 수집 | ⚠️ 부분 (collect API) | src/modules/data-collector/ | P1 |

추가 검토 필요:
| F7 | 리포트 생성 (PDF/Excel) | ⚠️ 인터페이스만 | src/modules/report-generator/ | P2 |
| F8 | 멀티 점포 관리 | ❌ 미구현 | (DB 모델 확장 필요) | P3 |

## 3. P0 핵심 사용자 여정

### J1: 신규 점주 온보딩
1. 회원가입 (`/auth/signup`) → 이메일 인증
2. 자주 쓰는 식자재 5~10개 등록 (`/dashboard/ingredients`)
3. 거래 공급업체 1~3곳 등록 (`/dashboard/suppliers`)
4. 가격 정보 수기 입력 또는 영수증 OCR
5. 첫 가격 트렌드 차트 확인 (`/dashboard`)

### J2: 일일 가격 점검
1. 대시보드 진입 → 어제 대비 변동 식자재 확인
2. 알림 설정한 식자재 임계가격 도달 시 푸시/이메일 수신
3. 공급업체별 가격 비교 → 최적 발주처 결정

### J3: 메뉴 가격 결정
1. 신메뉴 레시피 등록 (`/dashboard/recipes/new`)
2. 식자재별 수량 입력 → 자동 원가 산출
3. 목표 마진율 입력 → 권장 판매가 제시

## 4. 데모 모드 (Trial)

- DemoContext에 mock 데이터 (ingredients, recipes, suppliers, alerts)
- 비인증 상태로 `/demo` 접근 가능
- 회원가입 유도 모달 (SignupPromptModal) 노출
- [TODO: 오너 확인] 데모 → 가입 전환율 측정 트래킹 미구현

## 5. PRD vs 현재 갭

| PRD 요구 | 현재 상태 | 갭 분석 |
|----------|-----------|---------|
| 6대 기능 | 4개 완료, 2개 부분 | 알림 + 자동 수집 마무리 필요 |
| Tesseract.js OCR | 인터페이스만 존재 | 실제 영수증 처리 로직 미구현 |
| Puppeteer 스크래핑 | 인터페이스만 존재 | 대상 사이트 / 호스팅 미정 |
| 모바일 반응형 | Tailwind 기반, 부분 적용 | 모바일 우선 디자인 검증 필요 |
| 다국어 (한/영) | 한글 우선 | i18n 인프라 없음 |

## 6. 권장 다음 스프린트

**Sprint 1 (1주)**: P0 안정화
- `.env.local` Supabase 키 입력 + 시드 데이터
- 테스트 TS 에러 211 정리
- 기존 4개 P0 기능 E2E 시나리오 검증

**Sprint 2 (1~2주)**: P1 알림 완성
- notification-service 실제 구현 (Resend 우선)
- price_alerts 트리거 + 알림 발송
- 사용자 알림 설정 UI

**Sprint 3 (2주)**: P1 데이터 수집
- 1개 대상 사이트 스크래핑 PoC
- 영수증 OCR PoC (Tesseract.js 한글 정확도 측정)
- Vercel Cron + Edge Function 통합

## 7. 미정 결정 사항 (TODO 오너 확인)

- [ ] 1차 타겟: 단일 점주 vs 프랜차이즈 본부
- [ ] 가격 데이터 수집 우선순위 (수기/OCR/스크래핑/API)
- [ ] 결제 모델 (구독/Freemium/일회)
- [ ] 모바일 우선 vs 데스크탑 우선
- [ ] 베타 출시 일정 / 채널
- [ ] 스크래핑 대상 사이트 합법성 검토 결과
