# Phase 2 — Chart & Visualization Components

JNF 리디자인의 시그니처 시각화 컴포넌트 5종을 코스트스캐너 프로젝트에 포팅한 TypeScript 버전입니다.
모두 **순수 SVG + Tailwind**로 구현 — Recharts 의존성 없음, CSS 변수(`--primary`/`--border`/`--success`)만 참조하므로 다크모드 자동 대응.

## 📦 설치

```
src/components/ui/charts/
├── Sparkline.tsx        # 테이블 셀용 미니 라인
├── RadarChart.tsx       # 공급처 다차원 점수 (5~6축)
├── ScatterQuadrant.tsx  # 2×2 사분면 매트릭스
├── CostDNABar.tsx       # 원가 구성 수평 스택 바
└── PriceChange.tsx      # 한국형 가격 변동 칩/텍스트
```

적용:
```bash
mkdir -p src/components/ui/charts
cp patch/components/*.tsx src/components/ui/charts/
```

Barrel export 추가 (선택):
```ts
// src/components/ui/charts/index.ts
export * from './Sparkline'
export * from './RadarChart'
export * from './ScatterQuadrant'
export * from './CostDNABar'
export * from './PriceChange'
```

## 🎨 사용 예

### 1. Sparkline (IngredientsTable 셀)
```tsx
import { Sparkline } from '@/components/ui/charts'

<Sparkline
  data={[2100, 2150, 2080, 2200, 2250, 2180, 2300]}
  color={change >= 0 ? '#E8412D' : '#1F9D55'}
  width={90}
  height={26}
/>
```

### 2. PriceChange (어디든)
```tsx
import { PriceChange } from '@/components/ui/charts'

<PriceChange change={0.152} chip />          // +15.2% 빨강 칩
<PriceChange change={-0.085} size="lg" />    // −8.5% 초록 큰 텍스트
```

### 3. CostDNABar (RecipeDetailsModal)
```tsx
import { CostDNABar } from '@/components/ui/charts'

<CostDNABar
  sellPrice={9000}
  segments={[
    { label: '돼지 사골', cost: 2200, color: '#E8412D' },
    { label: '대파',     cost: 71,   color: '#1F9D55' },
    { label: '양파',     cost: 93,   color: '#F2A900' },
    { label: '밥',       cost: 480,  color: '#2B6CB0' },
    { label: '기타',     cost: 320,  color: '#94897A' },
  ]}
/>
```

### 4. RadarChart (공급처 상세)
```tsx
import { RadarChart } from '@/components/ui/charts'

<RadarChart
  axes={['가격', '신뢰', '속도', '품질', '다양성']}
  values={[0.8, 0.9, 0.85, 0.75, 0.7]}
  compareValues={[0.5, 0.6, 0.6, 0.6, 0.5]}  // 시장 평균
  size={260}
/>
```

### 5. ScatterQuadrant (공급처 매트릭스)
```tsx
import { ScatterQuadrant } from '@/components/ui/charts'

<ScatterQuadrant
  size={480}
  xLabel="가격 →"
  yLabel="품질 →"
  idealQuadrant="tl"
  points={suppliers.map(s => ({
    x: s.priceScore,
    y: s.qualityScore,
    r: 8 + s.reliability * 18,
    label: s.name.slice(0, 2),
    color: s.color,
  }))}
  onPointClick={(p) => setSelected(p.id)}
/>
```

## 🧪 검증

- ✅ 의존성 없음 (lucide-react는 Phase 1에서 이미 사용 중)
- ✅ CSS 변수 참조 → 다크모드 자동
- ✅ `'use client'` 지시자 포함 → RSC에서 바로 import 가능
- ✅ 접근성: `role="img"` / `aria-hidden` 적절 배치
