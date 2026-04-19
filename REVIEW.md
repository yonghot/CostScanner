# REVIEW.md - CostScanner 코드베이스 리뷰

> 자동 생성: 2026-04-17 | 프로젝트 이어받기 시점의 스냅샷
> 갱신: 주요 변경 시 수동 업데이트

## 1. 종합 평가

| 항목 | 점수 | 비고 |
|------|------|------|
| 코드 구조 | 8/10 | Next.js 14 App Router 표준 준수, 모듈 분리 명확 |
| 타입 안전성 | 7/10 | 프로덕션 0 에러, 테스트 211 에러 미정비 |
| 테스트 커버리지 | 3/10 | ~10% (목표 40%, jest-dom 타입 미설정) |
| 문서 품질 | 8/10 | CLAUDE.md, PRD.md, DESIGN.md 풍부 (단 CLAUDE.md 467줄 - 분할 권장) |
| 디자인 시스템 | 8/10 | shadcn/ui + JNF 오렌지 팔레트 일관됨 |
| 보안 | 6/10 | RLS 정책 정의됨, 그러나 시크릿/감사 미흡 |
| 빌드 가능성 | 7/10 | npm install 성공, .env.local 채우면 즉시 실행 |
| **종합** | **6.7/10** | 70% 완료, 핵심 기능 동작 가능 상태 |

## 2. 강점 (Strengths)

- ✅ **모듈 아키텍처**: cost-analyzer, data-collector, notification-service, report-generator 4개 도메인 분리
- ✅ **데이터베이스 설계**: 10개 테이블 + 6개 ENUM, RLS 정책 사전 정의
- ✅ **컴포넌트 라이브러리**: shadcn/ui 기반 38개 컴포넌트 정리
- ✅ **타입스크립트 strict 모드**: 프로덕션 코드 0 에러 유지
- ✅ **명확한 문서**: PRD 656줄로 비즈니스 요구사항 상세 기술

## 3. 약점 (Weaknesses) / 개선 필요

| 우선 | 항목 | 조치 |
|------|------|------|
| P0 | `.env.local` placeholder 11개 | 실제 Supabase 키 입력 필요 (개발자 액션) |
| P0 | 테스트 코드 TS 211 에러 | `tsconfig.json` types 배열에 `["jest","@testing-library/jest-dom"]` 추가 |
| P1 | CLAUDE.md 467줄 (200줄 초과) | 섹션 분할 → src/api/CLAUDE.md, src/components/CLAUDE.md로 일부 이전 |
| P1 | 테스트 커버리지 10% | 핵심 모듈 (cost-analyzer-impl) 단위 테스트 추가 |
| P2 | API 엔드포인트 2개만 구현 | PRD 6대 기능 중 알림/리포트/스크래핑 라우트 미구현 |
| P2 | 보안 감사 미수행 | RLS 정책 + 시크릿 처리 + 인증 흐름 점검 필요 |
| P3 | 데모 모드와 프로덕션 분기 | DemoContext와 Supabase 라우트 간 일관성 보강 |

## 4. 위험 요소 (Risks)

- **데이터 수집 모듈**: WebScrapingCollector, OCRCollector 인터페이스만 있고 실제 구현 검증 필요. 외부 사이트 정책/로보트 처리 미확인.
- **Supabase 의존**: auth-helpers-nextjs 0.10 (deprecated 경향) - `@supabase/ssr`로 마이그레이션 검토.
- **Next.js 14.1**: 14.2+의 보안 패치 미반영 가능성.
- **테스트 부재**: 결제/알림/가격 비교 로직 회귀 테스트 없음 → 버그 시 즉시 감지 어려움.

## 5. 다음 단계 권장

1. **즉시 (P0)**: Supabase 키 설정 → `npm run dev` 가동 → 데모 모드 점검
2. **단기 (P1)**: CLAUDE.md 분할 + tsconfig 테스트 타입 보강 + jest-dom 매처 활성화
3. **중기 (P2)**: 누락 API 라우트 (알림/리포트) 구현 + 핵심 모듈 단위 테스트
4. **장기 (P3)**: Supabase SSR 마이그레이션 + 보안 감사 + Vercel 프로덕션 배포 검증

## 6. 참고

- 분석 시점: 프로젝트 이어받기 자동화 (2026-04-17)
- 분석 도구: codebase-analyzer + environment-setup + harness-generator (3-way 병렬)
- 보존된 기존 파일: CLAUDE.md, PRD.md, DESIGN.md, .claude/settings.local.json
