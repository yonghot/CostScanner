# DESIGN.md - CostScanner 디자인 시스템

CostScanner 프로젝트의 UI/UX 디자인, 프론트엔드, CSS, UI 디자인 컴포넌트, 테마 컬러 등 디자인 관련 요소를 체계적으로 정리한 디자인 시스템 문서입니다.

## 📋 목차

1. [디자인 철학](#디자인-철학)
2. [컬러 시스템](#컬러-시스템)
3. [타이포그래피](#타이포그래피)
4. [컴포넌트 시스템](#컴포넌트-시스템)
5. [레이아웃 시스템](#레이아웃-시스템)
6. [애니메이션 시스템](#애니메이션-시스템)
7. [기술 스택](#기술-스택)
8. [디자인 레퍼런스](#디자인-레퍼런스)
9. [개발 가이드라인](#개발-가이드라인)

---

## 🎨 디자인 철학

### B2B SaaS 전문성
- **데이터 중심**: 재무 데이터와 통계를 명확하게 표현
- **전문성**: 비즈니스 사용자를 위한 신뢰할 수 있는 인터페이스
- **효율성**: 복잡한 업무 프로세스를 단순화하는 UX

### 브랜딩 정체성
- **JNF 컬러**: 오렌지(#FF7A00) 기반 브랜딩 시스템
- **한국 로컬라이제이션**: 한국어 폰트 최적화 및 문화적 적응
- **접근성**: WCAG 2.1 AA 준수를 위한 색상 대비 및 키보드 내비게이션

---

## 🎨 컬러 시스템

### Primary Colors (브랜드 컬러)
```css
/* JNF 브랜드 컬러 */
primary: {
  DEFAULT: "#FF7A00",      /* JNF 오렌지 */
  foreground: "#ffffff",   /* 흰색 텍스트 */
  light: "#FFB366",        /* 밝은 오렌지 */
  dark: "#CC5500",         /* 어두운 오렌지 */
}
```

### Semantic Colors (의미론적 컬러)
```css
success: {
  DEFAULT: "#2E7D32",      /* 성공/수익 */
  foreground: "#ffffff",
  light: "#66BB6A",
  dark: "#1B5E20",
}

warning: {
  DEFAULT: "#FF9800",      /* 경고/주의 */
  foreground: "#ffffff",
}

error: {
  DEFAULT: "#D32F2F",      /* 오류/손실 */
  foreground: "#ffffff",
}
```

### Neutral Colors (중성 컬러)
HSL 기반 CSS 변수 시스템으로 다크모드 지원:
```css
--background: 0 0% 100%;           /* 화이트 배경 */
--foreground: 222.2 84% 4.9%;      /* 다크 그레이 텍스트 */
--muted: 210 40% 96%;              /* 뮤트된 배경 */
--muted-foreground: 215.4 16.3% 46.9%;
--border: 214.3 31.8% 91.4%;       /* 보더 컬러 */
```

### 컬러 사용 가이드라인
- **Primary**: 메인 CTA 버튼, 브랜딩 요소, 활성 상태
- **Success**: 수익 증가, 성공 메시지, 양수 값 표시
- **Warning**: 주의가 필요한 상황, 임계값 근접
- **Error**: 손실, 오류 상태, 음수 값 표시

---

## ✍️ 타이포그래피

### 텍스트 스케일 시스템
```css
.text-display    /* 4xl-5xl: 메인 제목 */
.text-headline   /* 2xl-3xl: 섹션 헤딩 */
.text-title      /* xl-2xl: 카드/컴포넌트 제목 */
.text-subtitle   /* lg: 부제목, 설명 */
.text-body       /* base: 본문 텍스트 */
.text-caption    /* sm: 캡션, 메타 정보 */
```

### 특수 텍스트 스타일
```css
.text-gradient   /* 그라데이션 텍스트 (Primary → Success) */
```

### 폰트 특성
- **한국어 최적화**: 한글 폰트 렌더링 품질 향상
- **가독성**: `font-feature-settings: "rlig" 1, "calt" 1`
- **반응형**: 모바일에서 자동으로 축소되는 텍스트 크기

---

## 🧩 컴포넌트 시스템

### shadcn/ui 기반 컴포넌트 (12개)
프로젝트에서 사용 중인 shadcn/ui 컴포넌트들:

#### 기본 컴포넌트
- `Badge` - 상태 표시, 태그, 카테고리 라벨
- `Button` - 6가지 variant (default, destructive, outline, secondary, ghost, link)
- `Card` - 콘텐츠 컨테이너, 데이터 카드
- `Input` - 폼 입력 필드
- `Label` - 폼 라벨

#### 인터랙션 컴포넌트
- `Dialog` - 모달 다이얼로그
- `Dropdown Menu` - 드롭다운 메뉴
- `Tooltip` - 도움말 툴팁

#### 데이터 표시
- `Table` - 데이터 테이블
- `Progress` - 진행률 표시
- `Separator` - 구분선

#### 커스텀 컴포넌트
- `StatusBadge` - 활성/비활성 상태 표시용 커스텀 배지

### Radix UI 프리미티브 (9개)
headless UI 컴포넌트로 접근성과 키보드 내비게이션 보장:
```
@radix-ui/react-alert-dialog    ^1.0.5
@radix-ui/react-avatar          ^1.0.4  
@radix-ui/react-dialog          ^1.0.5
@radix-ui/react-dropdown-menu   ^2.0.6
@radix-ui/react-label           ^2.0.2
@radix-ui/react-progress        ^1.1.7
@radix-ui/react-select          ^2.0.0
@radix-ui/react-separator       ^1.1.7
@radix-ui/react-tabs            ^1.0.4
@radix-ui/react-tooltip         ^1.0.7
```

### B2B 전용 스타일 클래스
```css
/* 전문성을 강조하는 카드 시스템 */
.professional-card        /* 기본 전문 카드 */
.professional-card-header /* 카드 헤더 */
.professional-card-content /* 카드 본문 */
.professional-card-footer /* 카드 푸터 */

/* 통계 데이터 표시용 카드 */
.stats-card              /* 통계 카드 */
.stats-card-icon         /* 아이콘 영역 */
.stats-card-value        /* 수치 값 */
.stats-card-label        /* 라벨 텍스트 */
```

---

## 🏗️ 레이아웃 시스템

### 컨테이너 시스템
```css
.container {
  max-width: 6xl (1152px);
  margin: auto;
  padding: lg (24px);
}
```

### DashboardLayout 패턴
**구조**: 고정 사이드바 + 상단 헤더 + 메인 콘텐츠
- **사이드바**: 264px 고정폭, 모바일에서 오버레이
- **헤더**: 64px 높이, 브레드크럼 + 사용자 메뉴
- **메인**: 최대 7xl (1280px) 컨테이너

### 반응형 브레이크포인트
```css
sm:   640px   /* 모바일 */
md:   768px   /* 태블릿 */
lg:   1024px  /* 데스크톱 */
xl:   1280px  /* 큰 데스크톱 */
2xl:  1536px  /* 초대형 */
```

### 간격 시스템
```css
xs:   4px     /* 미세한 간격 */
sm:   8px     /* 작은 간격 */ 
md:   16px    /* 기본 간격 */
lg:   24px    /* 큰 간격 */
xl:   32px    /* 매우 큰 간격 */
xxl:  48px    /* 섹션 간격 */
xxxl: 64px    /* 페이지 간격 */
```

---

## 🎬 애니메이션 시스템

### 커스텀 애니메이션
```css
.fade-in     /* 페이드 인 (0.4s) */
.scale-in    /* 스케일 인 (0.3s) */
.slide-up    /* 슬라이드 업 (0.5s) */
```

### 인터랙션 애니메이션
```css
.interactive-hover  /* 호버시 1.01배 스케일 + 그림자 */
.focus-ring        /* 포커스 링 스타일 */
```

### Tailwind Animate 플러그인
- accordion-down/up 애니메이션
- 자연스러운 easing 함수 적용

### 애니메이션 원칙
- **성능**: GPU 가속 속성 우선 사용 (transform, opacity)
- **자연스러움**: ease-out 이징으로 부드러운 감속
- **일관성**: 전역적으로 일관된 duration과 easing

---

## 💻 기술 스택

### 핵심 프레임워크
```json
{
  "next": "14.1.0",
  "react": "^18.2.0", 
  "typescript": "^5.3.3"
}
```

### 스타일링 시스템
```json
{
  "tailwindcss": "^3.4.1",
  "tailwindcss-animate": "^1.0.7",
  "tailwind-merge": "^2.2.1",
  "class-variance-authority": "^0.7.0"
}
```

### UI 컴포넌트 라이브러리  
```json
{
  "lucide-react": "^0.331.0",
  "@radix-ui/*": "다양한 버전"
}
```

### 유틸리티
```json
{
  "clsx": "^2.1.0",
  "date-fns": "^3.3.1"
}
```

---

## 🎯 디자인 레퍼런스

### B2B SaaS 벤치마크
- **Linear**: 미니멀한 디자인과 뛰어난 성능
- **Notion**: 직관적인 UI/UX와 강력한 기능성
- **Figma**: 협업 중심의 인터페이스 디자인
- **Stripe Dashboard**: 금융 데이터 시각화
- **Vercel Dashboard**: 개발자 친화적 인터페이스

### 한국 B2B 서비스
- **토스페이먼츠**: 금융 데이터 표현과 한국형 UX
- **카카오워크**: 한국어 타이포그래피 최적화
- **네이버 클라우드**: 엔터프라이즈 대시보드 패턴

### 색상 및 타이포그래피 참고
- **Material Design 3**: 색상 시스템과 접근성
- **Apple HIG**: 한국어 폰트 렌더링 가이드
- **shadcn/ui**: 컴포넌트 디자인 패턴

---

## 🛠️ 개발 가이드라인

### 컴포넌트 개발 원칙

#### 1. shadcn/ui 우선 사용
```tsx
// ✅ 좋은 예: shadcn/ui 컴포넌트 사용
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// ❌ 나쁜 예: 직접 스타일링
<div className="px-4 py-2 bg-blue-500">버튼</div>
```

#### 2. 컬러 토큰 사용
```tsx
// ✅ 좋은 예: 의미론적 컬러 사용
<Button variant="destructive">삭제</Button>
<span className="text-success">+12%</span>

// ❌ 나쁜 예: 하드코딩된 색상
<span className="text-green-500">+12%</span>
```

#### 3. 타이포그래피 클래스 활용
```tsx
// ✅ 좋은 예: 정의된 텍스트 클래스
<h1 className="text-headline">대시보드</h1>
<p className="text-body">본문 내용</p>

// ❌ 나쁜 예: 직접 크기 지정
<h1 className="text-3xl font-bold">대시보드</h1>
```

### CSS 작성 가이드라인

#### 1. Utility-First 접근
```css
/* ✅ 좋은 예: 재사용 가능한 유틸리티 클래스 */
.stats-card {
  @apply professional-card p-4 hover:scale-[1.02] transition-transform;
}

/* ❌ 나쁜 예: 하드코딩된 스타일 */
.stats-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  /* ... */
}
```

#### 2. 반응형 우선
```tsx
// ✅ 좋은 예: 모바일 퍼스트
<div className="p-4 md:p-6 lg:p-8">

// ❌ 나쁜 예: 데스크톱 우선
<div className="p-8 md:p-6 sm:p-4">
```

### 성능 최적화

#### 1. 번들 크기 최적화
- Radix UI 컴포넌트는 필요한 것만 import
- Lucide 아이콘은 개별 import 권장
```tsx
// ✅ 좋은 예
import { ChefHat, Package } from "lucide-react"

// ❌ 나쁜 예  
import * as Icons from "lucide-react"
```

#### 2. 애니메이션 성능
- `transform`과 `opacity` 우선 사용
- `will-change` 속성 신중히 사용
- 60fps 목표로 애니메이션 최적화

### 접근성 가이드라인

#### 1. 키보드 내비게이션
```tsx
// Radix UI 컴포넌트로 자동 보장
<DropdownMenu>
  <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>항목 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 2. 색상 대비
- Primary 색상: 4.5:1 대비율 보장
- Success/Warning/Error: WCAG AA 준수
- 텍스트/배경 조합 검증 필요

#### 3. 스크린 리더
```tsx
// ✅ 좋은 예: 의미론적 HTML
<main>
  <h1>대시보드</h1>
  <section aria-label="통계 요약">
    <h2>주요 지표</h2>
  </section>
</main>
```

---

## 🔄 업데이트 로그

### 2025-08-29
- **초기 버전**: 기본 디자인 시스템 구축
- **JNF 브랜딩**: Primary 컬러 #FF7A00 적용
- **shadcn/ui 통합**: 12개 기본 컴포넌트 + 1개 커스텀 컴포넌트
- **B2B 전용 스타일**: professional-card, stats-card 시스템 구축
- **타이포그래피**: 6단계 텍스트 스케일 시스템 완성
- **문서 동기화**: CLAUDE.md, PRD.md와 디자인 시스템 통합 완료

---

*이 문서는 CostScanner 프로젝트의 디자인 시스템이 발전함에 따라 지속적으로 업데이트됩니다.*