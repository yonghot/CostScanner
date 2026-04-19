# Design System Gap Analysis - CostScanner

> 자동 생성: 2026-04-17 (design-consultation 점검 모드)
> **DESIGN.md는 보존**, 본 문서는 갭 + 강화 제안만 기록

## 1. 기존 시스템 강점 ✅

| 영역 | 현황 | 평가 |
|------|------|------|
| 브랜드 컬러 | JNF 오렌지(#FF7A00) + light/dark 변형 | ✅ 명확 |
| 시맨틱 컬러 | success/warning/error + dark 변형 | ✅ 표준 |
| HSL 변수 시스템 | 다크모드 대응 가능 구조 | ✅ 확장성 |
| 접근성 원칙 | WCAG 2.1 AA 명시 | ✅ 기준 명확 |
| 디자인 철학 | B2B SaaS 전문성 + 한국 로컬라이제이션 | ✅ 페르소나 정합 |

## 2. 갭 / 강화 제안 ⚠️

| # | 갭 | 영향 | 강화 제안 |
|---|----|------|-----------|
| G1 | 타이포그래피 폰트 패밀리 미명시 (system-ui만) | 한글 가독성 편차 | Pretendard or Wanted Sans 도입 검토 (한국어 최적) |
| G2 | 모듈러 타입 스케일 미정의 | 헤딩/본문 비율 즉흥적 | 1.250 (Major Third) 스케일 + 12/14/16/20/24/30/36/48 px 명시 |
| G3 | 데이터 테이블 폰트(tabular-nums) 미명시 | 가격/숫자 정렬 어긋남 | Geist 또는 DM Sans tabular-nums 활성화 |
| G4 | 모션 사양 미정의 | 일관성 결여 | enter ease-out / exit ease-in / 150~250ms 표준 |
| G5 | 다크모드 토큰만 있고 적용 가이드 X | 컴포넌트 변환 비일관 | 표면 색상 단계 (bg/surface/elevated) 정의 + 스크린샷 가이드 |
| G6 | 컴포넌트 간격 토큰 부재 | shadcn/ui 기본값 의존 | 4/8/16/24/32/48/64 px 스케일 강제 + Tailwind class 매핑 |
| G7 | 차트(Recharts) 색상 팔레트 미정의 | 가격 트렌드 시각화 분산 | 데이터 시리즈 5색 표준 (primary→success→warning→info→neutral) |
| G8 | 빈 상태(Empty State) 일러스트 가이드 없음 | 데모/실 모두 빈 화면 어색 | 미니멀 SVG + 행동 유도 카피 패턴 정의 |
| G9 | 알림(Toast/Banner) 변형 미정의 | F5 알림 구현 시 즉흥 디자인 위험 | 4종 (info/success/warning/error) + dismiss UX 명시 |
| G10 | 한국어 줄바꿈/단어 끊김 처리 | 모바일 좁은 폭에서 가독성 저하 | `word-break: keep-all` 기본 + 예외 클래스 |

## 3. 우선순위 권장

### P0 (즉시 적용 - 코드 품질에 직접 영향)
- **G3**: tabular-nums (가격 표시 핵심)
- **G7**: 차트 색상 (현재 P0 기능 F3에서 사용)
- **G10**: word-break: keep-all (모바일 UX)

### P1 (다음 스프린트 - 일관성)
- **G2**: 타입 스케일 표준화
- **G6**: 간격 토큰 강제
- **G9**: 알림 변형 (F5 구현 직전)

### P2 (장기 - 브랜드 강화)
- **G1**: 한국어 폰트 패밀리 (Pretendard)
- **G4**: 모션 사양
- **G5**: 다크모드 적용 가이드
- **G8**: 빈 상태 디자인

## 4. 향후 적용 시 코드 변경 포인트

| 갭 | 변경 파일 |
|----|-----------|
| G1 | `tailwind.config.ts` `fontFamily`, `src/app/layout.tsx` Google Font 로드 |
| G2 | `tailwind.config.ts` `fontSize` 스케일 |
| G3 | `tailwind.config.ts` `fontVariantNumeric: 'tabular-nums'` 유틸리티 |
| G6 | `tailwind.config.ts` `spacing` 토큰 (이미 기본 스케일이지만 명시화) |
| G7 | `src/lib/chart-colors.ts` 신규 파일, Recharts 컴포넌트에서 import |
| G9 | `src/components/ui/toast.tsx` (shadcn add) + 변형 정의 |
| G10 | `src/styles/globals.css`에 `body { word-break: keep-all }` |

## 5. 결정사항 (DESIGN.md 추가 ❌, 별도 추적)

**DESIGN.md 보존**. 본 갭 분석은 docs/design-gap-analysis.md로 분리.
실제 토큰 갱신은 사용자 승인 후 별도 PR에서 수행.

## 6. 다음 단계

1. design-review로 실제 컴포넌트 (38개) 갭 적용 현황 감사
2. 우선 P0 3건만 코드 적용 (G3, G7, G10)
3. P1 변경은 Sprint 2에서 알림 구현과 함께
