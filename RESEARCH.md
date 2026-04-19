# RESEARCH.md - CostScanner 리서치 노트

> 자동 생성: 2026-04-17 | 도메인/기술 리서치 누적 문서
> 갱신: 새로운 조사 결과 발견 시 추가

## 1. 제품 도메인: 외식업 식자재 원가 관리

### 시장 배경
- **타겟 시장**: 한국 외식업 (음식점/카페/프랜차이즈 본부) 약 70만 사업체
- **문제 정의**: 식자재 가격 일일 변동성 → 마진 직접 영향, 그러나 수기 관리 일반적
- **경쟁 솔루션**: 농수산물 유통공사 KAMIS (공공), 푸드뱅크 (B2B), 마켓보로 (대형) - 일반 음식점 대상 통합 도구는 부재

### 핵심 페르소나
- 1인 운영 자영업자: 단순 가격 추적 + 알림
- 5~20석 가게 사장: 레시피 원가 계산 + 메뉴 가격 결정
- 프랜차이즈 본부: 다점포 통합 분석 + 공급업체 비교

[TODO: 오너 확인] 실제 페르소나 인터뷰 데이터 첨부 필요

## 2. 기술 스택 리서치

### Next.js 14 App Router
- **Server Components 기본**: 기본 SSR, `'use client'` 명시 시 CSR
- **Route Handlers**: `app/api/**/route.ts` (현재 2개: analyze, collect)
- **Streaming/Suspense**: 데이터 수집 진행률 UI에 활용 가능
- **참고**: https://nextjs.org/docs/app

### Supabase
- **현재 사용**: `@supabase/auth-helpers-nextjs` (0.10) → **deprecated** 경향, `@supabase/ssr`로 마이그레이션 검토
- **RLS**: 사용자별 데이터 격리, 002_rls_policies.sql 적용
- **실시간**: 가격 변동 알림에 Realtime Subscription 활용 가능
- **참고**: https://supabase.com/docs/guides/auth/server-side/nextjs

### 데이터 수집 기술
- **Tesseract.js**: OCR (영수증 → 가격 추출). 한글 인식 정확도 검증 필요
- **Puppeteer**: 웹 스크래핑. 헤드리스 크롬 → 호스팅 환경 (Vercel) 미지원, 별도 워커 필요
- **대안**: Playwright (스크래핑) + Edge Function (수집 트리거)
- [TODO: 오너 확인] 스크래핑 대상 사이트 (마켓컬리/오아시스/G마켓 등) 결정

### 디자인 시스템
- **shadcn/ui**: Radix UI + Tailwind + class-variance-authority
- **JNF 오렌지**: #FF7A00 (브랜드 컬러)
- **참고**: https://ui.shadcn.com/

## 3. 도메인 지식

### 식자재 카테고리 (DB ENUM 기준)
- vegetables, fruits, meat, seafood, dairy, grains, seasonings, beverages, processed, other (10종)
- [TODO] 한국 농수산물 표준분류 (KOSIS) 매핑 검토

### 가격 단위
- KAMIS 표준: kg, g, L, ml, 개, 박스, 케이스
- 외식업 실용: '인분', '봉', '판' 등 단위 변환 필요

### 알림 채널
- **이메일** (Resend): SMTP 대비 deliverability 우수
- **SMS** (Twilio): 한국 발송 비용 ~₩50/건
- **푸시** (FCM/APNs): PWA 모드 활성화 시 사용 가능

## 4. 경쟁사 분석 (요약)

| 솔루션 | 강점 | 약점 |
|--------|------|------|
| KAMIS | 공공 데이터 신뢰성 | UX 1990년대, 매장별 추적 X |
| 푸드뱅크 | B2B 유통망 | 가입 진입장벽, 일반 점주 X |
| 엑셀 수기 | 무료/유연 | 시간 소모, 분석 부재 |
| **CostScanner (목표)** | 통합 추적 + 자동 알림 + 원가 계산 | (구축 중) |

## 5. 외부 자료 / 참고 링크

- Next.js 14 마이그레이션 가이드: https://nextjs.org/docs/app/building-your-application/upgrading
- Supabase RLS 베스트 프랙티스: https://supabase.com/docs/guides/auth/row-level-security
- 한국 농수산물 도매시장 통계: https://www.kamis.or.kr/
- shadcn/ui 컴포넌트 카탈로그: https://ui.shadcn.com/docs/components

## 6. 미해결 질문 (Open Questions)

[TODO: 오너 확인]
- Q1: 1차 타겟 고객은 단일 점주인가, 프랜차이즈 본부인가?
- Q2: 가격 데이터 수집 방식의 우선순위 (수기 입력 / OCR / 스크래핑 / API)?
- Q3: 결제 모델 (월간 구독 vs Freemium vs 일회 구매)?
- Q4: 모바일 우선 vs 데스크탑 우선?
- Q5: 데이터 보관 기간 / GDPR-K(개인정보보호법) 대응 범위?
