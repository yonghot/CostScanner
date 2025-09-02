# CostScanner - B2B 식재료 원가 관리 시스템

## 📊 프로젝트 소개
CostScanner는 레스토랑과 요식업체를 위한 종합적인 식재료 원가 관리 플랫폼입니다.

### 주요 기능
- 🥬 **식재료 관리**: 실시간 가격 추적 및 재고 관리
- 📈 **가격 모니터링**: 자동 웹 스크래핑 및 OCR을 통한 가격 수집
- 🍳 **레시피 원가 계산**: 자동 원가 계산 및 마진 분석
- 🚚 **공급업체 관리**: 공급업체별 가격 비교 및 평가
- 📱 **실시간 알림**: 가격 변동 및 재고 부족 알림
- 📊 **분석 리포트**: 상세한 원가 분석 및 최적화 제안

### 기술 스택
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS, shadcn/ui
- **Data Collection**: Puppeteer, Tesseract.js

### 시작하기
```bash
npm install
npm run dev
```

### 환경 변수
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 라이센스
MIT

---
*Last updated: 2025-01-03*