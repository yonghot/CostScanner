# CLAUDE.md - API Routes (`src/app/api/`)

> 이 디렉토리에서 작업할 때 적용되는 규칙

## 1. 라우트 작성 규칙

### 파일 구조
```
src/app/api/{resource}/route.ts          # 표준 핸들러
src/app/api/{resource}/__tests__/route.test.ts  # 테스트
```

### HTTP 메서드 export
- `GET`, `POST`, `PUT`, `PATCH`, `DELETE` 함수로 named export
- 사용하지 않는 메서드는 export 하지 않음 (Next.js 자동 405)

### 응답 포맷 (필수)
```typescript
// 성공
return NextResponse.json({ success: true, data: result }, { status: 200 });

// 실패
return NextResponse.json({ success: false, error: '메시지' }, { status: 400 });
```

## 2. 인증 (Supabase)

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createServerComponentClient({ cookies });
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
```

> ⚠️ `@supabase/auth-helpers-nextjs` 0.10은 deprecated 경향. 새 라우트는 `@supabase/ssr` 마이그레이션 검토.

## 3. 입력 검증 (Zod)

```typescript
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['price_trend', 'supplier_comparison', 'recipe_cost', 'supplier_analysis']),
  ingredient_id: z.string().uuid().optional(),
});

const body = await req.json();
const parsed = schema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
}
```

## 4. 에러 로깅

- `src/lib/logger.ts` 통합 사용
- `console.error` 직접 호출 금지
- 민감 데이터 (토큰, 비밀번호) 로깅 금지

## 5. 비즈니스 로직 분리

- 라우트 핸들러는 **얇게**: 인증 → 검증 → 모듈 호출 → 응답
- 실제 로직은 `src/modules/**`로 위임
- DB 쿼리 직접 작성 금지, 모듈/lib 함수 사용

## 6. 테스트

- 모든 라우트는 `__tests__/route.test.ts` 작성
- jest + node 환경 (브라우저 API 의존 금지)
- Mock: `__mocks__/@supabase/auth-helpers-nextjs.ts`

## 7. 현재 라우트 (참고)

| 경로 | 메서드 | 모듈 호출 |
|------|--------|-----------|
| `/api/analyze` | POST | cost-analyzer |
| `/api/collect` | POST | data-collector |

## 8. 신규 라우트 추가 시 체크리스트

- [ ] 인증 검증
- [ ] Zod 입력 스키마
- [ ] 비즈니스 로직 모듈로 분리
- [ ] 표준 응답 포맷
- [ ] 에러 로깅 (logger.ts)
- [ ] 테스트 파일 작성
- [ ] feature_list.json 갱신
