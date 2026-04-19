# CLAUDE.md - Components (`src/components/`)

> 이 디렉토리에서 작업할 때 적용되는 규칙

## 1. 디렉토리 구조

```
src/components/
├── ui/              # shadcn/ui 원시 컴포넌트 (Button, Dialog, Input, ...)
├── auth/            # 인증 (LoginForm, SignUpForm, AuthLayout)
├── dashboard/       # 대시보드 기능 (overview, ingredients/, recipes/, suppliers/)
├── demo/            # 데모 모드 (DemoLayout, AddIngredientModal, ...)
└── landing/         # 랜딩 페이지 (DashboardPreview, ...)
```

## 2. 컴포넌트 작성 규칙

### Server vs Client
- 기본은 **Server Component** (use client 미선언)
- 다음 경우만 `'use client'` 선언:
  - useState/useEffect/useRef 등 React Hooks 사용
  - 이벤트 핸들러 (onClick, onChange)
  - 브라우저 API 사용 (window, localStorage)
  - Context Provider/Consumer

### 명명 규칙
- 파일/디렉토리: `kebab-case.tsx` 또는 `PascalCase.tsx` (현재 프로젝트는 PascalCase 다수)
- 컴포넌트 export: `default` 대신 **named export** 권장 (트리쉐이킹)
- Props 타입: `{ComponentName}Props` 형식

### 스타일
- Tailwind 우선 (CSS-in-JS 사용 금지)
- 조건부 클래스: `cn()` 헬퍼 사용 (`@/lib/utils`)
- shadcn/ui 컴포넌트 우선 활용, 부족 시 ui/에 추가

## 3. 폼 (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, '필수 입력'),
  price: z.number().positive('0보다 커야 합니다'),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

## 4. 디자인 토큰 (DESIGN.md 준수)

| 토큰 | 값 |
|------|-----|
| Primary | `#FF7A00` (JNF 오렌지) |
| Success | `#2E7D32` |
| Warning | `#FF9800` |
| Error | `#D32F2F` |
| 본문 폰트 | system-ui, -apple-system |
| 간격 단위 | 4/8/16/24/32/48/64 px (Tailwind 기본 스케일) |

## 5. 접근성 (WCAG 2.1 AA)

- 인터랙티브 요소: `aria-label`, `role` 적절히 사용
- 색상 대비: 4.5:1 이상 (Tailwind text-primary on bg-white = OK)
- 키보드 탐색: Tab 순서 자연스럽게
- 폼 필드: `<label>` 또는 `aria-labelledby` 연결

## 6. 데모 모드 vs 실 데이터

- 데모 컴포넌트는 `DemoContext`에서 데이터 가져옴
- 실 데이터 컴포넌트는 Supabase 클라이언트 직접 호출 또는 SWR/Server Component
- 두 모드 컴포넌트는 분리 (혼용 금지)

## 7. 테스트

- 핵심 폼 (LoginForm, SignUpForm 등): testing-library 단위 테스트
- 시각 회귀: 추후 Storybook + Chromatic 검토
- 테스트 파일: `__tests__/{Component}.test.tsx`

## 8. 신규 컴포넌트 추가 시 체크리스트

- [ ] 적절한 디렉토리 (ui/, dashboard/, ...)
- [ ] Server/Client 컴포넌트 결정 ('use client' 정확히 사용)
- [ ] Props 타입 정의
- [ ] DESIGN.md 토큰 준수
- [ ] 접근성 검토
- [ ] 핵심 컴포넌트는 테스트 작성
