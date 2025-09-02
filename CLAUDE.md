# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CostScanner** is a comprehensive B2B ingredient cost management system designed for restaurant and foodservice businesses. The system provides real-time price monitoring, recipe cost calculation, supplier comparison, and automated cost analysis through advanced web scraping, OCR processing, and AI-powered data collection.

### Current Development Status
- **Phase**: Core Development (Phase 2B - 70% Complete)
- **Infrastructure**: 95% Complete (Next.js 14 + Supabase + shadcn/ui)
- **Database Schema**: 100% Complete (PostgreSQL with ENUM types)
- **Type System**: 100% Complete (Comprehensive TypeScript definitions)
- **Design System**: 95% Complete (Comprehensive DESIGN.md + shadcn/ui integration)
- **UI Components**: 85% Complete (12 shadcn/ui components + custom components)
- **Business Logic**: 70% Complete (Interface-driven module architecture)
- **Authentication**: Ready for Supabase integration
- **Server Status**: Running on http://localhost:3000 (fixed port)

## Common Development Commands

```bash
# Development
npm run dev              # Start development server at http://localhost:3000
npm run build           # Create production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking without output

# Testing  
npm run test            # Run Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Database (Supabase)
npm run db:generate     # Generate TypeScript types from database
npm run db:reset        # Reset local database
npm run db:seed         # Run database seed scripts
```

## High-Level Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4+, shadcn/ui component system
- **Database**: Supabase (PostgreSQL 15+) with Row Level Security (RLS)
- **Authentication**: Supabase Auth with middleware protection
- **Data Collection**: Puppeteer 21.9+ (scraping), Tesseract.js 5.0+ (OCR)
- **Charts**: Recharts 2.10+ for price trend visualization
- **UI Library**: Radix UI primitives with class-variance-authority
- **Forms**: React Hook Form 7.49+ with Zod validation
- **Date Handling**: date-fns 3.3+ for Korean locale support
- **Icons**: Lucide React 0.331+ (consistent icon system)

### Core Architecture Patterns

**Modular Design**: Business logic is separated into dedicated modules under `src/modules/`:
- `data-collector/`: Web scraping, OCR, and API data collection interfaces
- `cost-analyzer/`: Price analysis, trend calculation, and cost optimization
- `report-generator/`: PDF/Excel report generation interfaces
- `notification-service/`: Email, SMS, and push notification interfaces

**Interface-First Development**: All modules define TypeScript interfaces before implementation, ensuring consistent contracts across the system.

**Database-First Schema**: Comprehensive PostgreSQL schema with proper indexing, triggers, and RLS policies defined in `supabase/migrations/`.

### Project Structure

```
src/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Registration page
│   ├── auth/callback/route.ts   # Supabase auth callback
│   ├── dashboard/               # Main application
│   │   ├── ingredients/page.tsx # Ingredient management
│   │   ├── recipes/page.tsx    # Recipe management
│   │   ├── suppliers/page.tsx  # Supplier management  
│   │   ├── reports/page.tsx    # Analytics and reports
│   │   ├── settings/page.tsx   # User settings
│   │   ├── layout.tsx         # Dashboard layout wrapper
│   │   └── page.tsx           # Dashboard overview
│   ├── api/                    # API route handlers
│   │   ├── analyze/route.ts   # Cost analysis endpoints
│   │   └── collect/route.ts   # Data collection endpoints
│   ├── layout.tsx             # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── badge.tsx         # Status badges
│   │   ├── button.tsx        # Action buttons (6 variants)
│   │   ├── card.tsx          # Content containers
│   │   ├── dialog.tsx        # Modal dialogs
│   │   ├── dropdown-menu.tsx # Dropdown menus
│   │   ├── input.tsx         # Form inputs
│   │   ├── label.tsx         # Form labels
│   │   ├── progress.tsx      # Progress indicators
│   │   ├── separator.tsx     # Visual separators
│   │   ├── status-badge.tsx  # Custom status display
│   │   ├── table.tsx         # Data tables
│   │   └── tooltip.tsx       # Help tooltips
│   ├── auth/                  # Authentication components
│   │   ├── AuthLayout.tsx    # Auth page wrapper
│   │   ├── LoginForm.tsx     # Login form component
│   │   └── SignUpForm.tsx    # Registration form
│   ├── dashboard/             # Feature-specific components
│   │   ├── DashboardLayout.tsx    # Main layout
│   │   ├── DashboardOverview.tsx  # Overview widgets
│   │   ├── ingredients/           # Ingredient components
│   │   ├── recipes/              # Recipe components
│   │   └── suppliers/           # Supplier components
│   └── landing/               # Marketing components
├── modules/                   # Business logic (interface-first)
│   ├── data-collector/       # Data collection interfaces
│   │   ├── collector-interface.ts     # Core collector contracts
│   │   ├── web-scraping-collector.ts  # Web scraping implementation
│   │   ├── ocr-collector.ts          # OCR processing implementation
│   │   ├── api-collector.ts          # API integration
│   │   └── collection-scheduler.ts   # Automated collection
│   ├── cost-analyzer/        # Analysis and calculation
│   │   ├── analyzer-interface.ts     # Analysis contracts
│   │   └── cost-analyzer-impl.ts     # Cost calculation logic
│   ├── report-generator/     # Report generation
│   │   └── generator-interface.ts    # Report contracts
│   └── notification-service/ # Notification system
│       └── notifier-interface.ts     # Notification contracts
├── types/                    # Comprehensive TypeScript definitions
│   ├── index.ts             # Core business entity types
│   ├── dashboard.ts         # Dashboard-specific types
│   └── supabase.ts         # Database schema types
├── lib/                     # Utilities and configurations
│   ├── supabase.ts         # Supabase client configuration
│   ├── utils.ts            # Utility functions (cn, pick, omit)
│   ├── mock-data.ts        # Development mock data
│   └── utils/              # Additional utilities
├── constants/               # Application constants
│   ├── app.ts              # App configuration
│   └── navigation.ts       # Navigation structure
├── hooks/                   # Custom React hooks (future)
├── styles/
│   └── globals.css         # Global Tailwind CSS
└── utils/                   # Additional utility functions
    ├── format.ts           # Formatting functions
    └── validation.ts       # Validation schemas
```

### Key Design Decisions

**TypeScript-First**: Strict TypeScript configuration with comprehensive type definitions in `src/types/index.ts`. All business entities, API responses, and form data have proper typing.

**Component Architecture**: Uses shadcn/ui as the foundational design system, with business-specific components building on top of these primitives.

**Database Schema**: Follows PostgreSQL best practices with:
- UUID primary keys for all entities
- Proper foreign key relationships
- Time-series optimization for price data
- Full-text search capabilities for ingredients/suppliers
- Automatic updated_at triggers

**Authentication & Security**: Leverages Supabase Auth with Row Level Security (RLS) policies to ensure data isolation between users.

## Important Development Notes

### Database Integration
The system uses Supabase with a comprehensive PostgreSQL schema supporting:
- **Multi-tenant architecture**: User-specific data isolation through RLS policies
- **Time-series optimization**: Price data with proper indexing for trend analysis
- **Korean full-text search**: Ingredient/supplier names with Korean language support
- **ENUM types**: Consistent data categories (ingredient_category, price_source, notification_type, etc.)
- **Complete schema**: 001_initial_schema.sql with proper relationships and constraints
- **RLS policies**: 002_rls_policies.sql for secure multi-tenant data access
- **Database functions**: 003_database_functions.sql for automated operations
- **Seed data**: Sample data for development and testing

### Module Interfaces
Before implementing any business logic, review the interface definitions in `src/modules/`. These define the contracts that all implementations must follow:

**Data Collection Module** (`src/modules/data-collector/`):
- `DataCollector`: Base interface for all collection methods
- `WebScrapingCollector`: Browser-based price scraping with Puppeteer
- `OCRCollector`: Invoice processing with Tesseract.js
- `APICollector`: Third-party API integration
- `CollectionScheduler`: Automated collection job management

**Cost Analysis Module** (`src/modules/cost-analyzer/`):
- `CostAnalyzer`: Price analysis and trend calculation
- Recipe cost calculation and profit margin analysis
- Supplier price comparison and recommendation

**Report Generation Module** (`src/modules/report-generator/`):
- `ReportGenerator`: Base interface for report creation
- PDF/Excel export functionality for cost reports
- Chart generation for price trend visualization

**Notification Service Module** (`src/modules/notification-service/`):
- `NotificationService`: Multi-channel alert system
- Email, SMS, and push notification support
- Price alert threshold management

### Type Safety
Comprehensive TypeScript type system with strict typing across all modules:

**Core Business Types** (`src/types/index.ts`):
- `BaseEntity`: Common fields for all database entities
- `User`, `Ingredient`, `Supplier`, `Recipe`: Core business entities
- `PriceRecord`, `RecipeIngredient`: Relational data types
- `PriceAlert`, `Notification`: Alert and notification system
- `CostReport`, `TrendAnalysis`: Analytics and reporting types

**API Response Types**:
- `ApiResponse<T>`: Standardized API response format
- `PaginatedResponse<T>`: Paginated data responses
- Form validation types with Zod integration

**Specialized Types**:
- `src/types/dashboard.ts`: Dashboard-specific component types
- `src/types/supabase.ts`: Database schema types (auto-generated)
- Module-specific interfaces in respective `src/modules/` directories

### Path Aliases
The project uses comprehensive path aliases defined in `tsconfig.json`:
- `@/*` - Source root
- `@/components/*` - UI components
- `@/modules/*` - Business logic modules
- `@/types/*` - Type definitions
- `@/lib/*`, `@/utils/*`, `@/hooks/*`, `@/constants/*`

### Styling System
Uses Tailwind CSS with shadcn/ui components. The design system emphasizes:
- B2B professional appearance with clean typography
- Data-focused layouts optimized for financial information
- Responsive design with desktop-first approach
- Korean language support with proper font handling

### Design System (DESIGN.md)
A comprehensive design system document covering all UI/UX aspects:

#### Core Design Principles
- **JNF Branding**: Orange (#FF7A00) primary color system
- **B2B SaaS Professionalism**: Data-centric layouts with trustworthy appearance
- **Korean Localization**: Optimized Korean fonts and cultural adaptation
- **Accessibility**: WCAG 2.1 AA compliance throughout

#### Component Architecture (12 shadcn/ui + 1 Custom)
- **Basic Components**: Badge, Button, Card, Input, Label
- **Interactive Components**: Dialog, Dropdown Menu, Tooltip
- **Data Display**: Table, Progress, Separator
- **Custom Components**: StatusBadge for business-specific status display
- **Radix UI Integration**: 9 headless UI primitives for accessibility

#### Color System
```css
/* Primary - JNF Brand */
primary: "#FF7A00"              /* JNF Orange */

/* Semantic Colors */
success: "#2E7D32"              /* Revenue/Profit */
warning: "#FF9800"              /* Attention/Threshold */
error: "#D32F2F"                /* Loss/Error */

/* HSL-based CSS Variables for Dark Mode Support */
--background: 0 0% 100%         /* White Background */
--foreground: 222.2 84% 4.9%    /* Dark Gray Text */
```

#### Typography Scale (6-tier)
- `text-display` (4xl-5xl): Main titles
- `text-headline` (2xl-3xl): Section headings
- `text-title` (xl-2xl): Card/component titles
- `text-subtitle` (lg): Subtitles, descriptions
- `text-body` (base): Body text
- `text-caption` (sm): Captions, meta info

#### Professional Card System
- `.professional-card`: B2B optimized card styling
- `.stats-card`: Statistical data display cards
- Custom animations: fadeIn, scaleIn, slideUp
- Interactive hover effects with GPU acceleration

### Performance Considerations
- Price data is indexed for time-series queries
- Uses Next.js 14 App Router for optimized rendering
- Supabase real-time subscriptions for live price updates
- Image optimization configured for Supabase storage

## Development Workflow

1. **Schema Changes**: Update `supabase/migrations/` first, then run `npm run db:generate` to update TypeScript types
2. **Module Development**: Define interfaces in `src/modules/` before implementation
3. **Type Safety**: Always use the predefined types from `src/types/index.ts`
4. **Component Development**: Build on shadcn/ui primitives, follow the established patterns in `src/components/dashboard/`
5. **Testing**: Use the established Jest configuration, with coverage reports available

## MCP Server Integration

The project has 11 MCP servers configured for enhanced development capabilities:
- **context7**: Latest documentation for Next.js, Supabase, React
- **chadcn-ui**: UI component library reference and code generation (used for DESIGN.md creation)
- **supabase-mcp**: Database management and query assistance
- **sequential-thinking**: Complex problem solving and debugging
- **playwright**: E2E testing and browser automation
- **tosspayments-mcp**: Payment integration for subscription features

### Design Documentation
- **DESIGN.md**: Comprehensive design system documentation with 9 major sections
  - Design philosophy, color systems, typography, components, layouts
  - Animation system, tech stack, references, development guidelines
  - Created using chadcn-ui MCP for component analysis and best practices

## 트러블슈팅 및 디버깅 지침

### 근본 원인 분석 원칙
문제 해결 시 **임시방편이나 우회 방법 대신 반드시 근본 원인을 파악하고 완전히 해결**해야 합니다. 같은 오류가 재발하지 않도록 시스템적으로 접근해야 합니다.

### 디버깅 프로세스
1. **증상 분석**: 오류 메시지, 로그, 사용자 리포트 등을 통해 문제 현상을 정확히 파악
2. **근본 원인 추적**: 표면적 증상 뒤의 실제 원인을 단계적으로 추적
3. **완전한 해결**: 원인을 제거하는 완전한 수정 사항 구현
4. **재발 방지**: 같은 유형의 문제가 다시 발생하지 않도록 구조적 개선
5. **문서화**: 해결 과정과 예방 지침을 claude.md에 업데이트

### 일반적인 오류 유형과 근본 원인

#### 1. 타입 불일치 오류
**증상**: TypeScript 컴파일 에러, 런타임 타입 오류
**근본 원인**: snake_case ↔ camelCase 불일치, 인터페이스 정의 불완전
**완전한 해결**:
- `src/types/index.ts`에서 통일된 타입 정의 사용
- 변환 유틸리티 함수로 일관성 보장
- 모든 API 응답과 데이터베이스 필드에 대한 명확한 타입 정의

#### 2. Mock 데이터 불일치
**증상**: 데모 모드에서 데이터가 올바르게 표시되지 않음
**근본 원인**: Mock 데이터 구조가 실제 타입 정의와 불일치
**완전한 해결**:
- `src/lib/mock-data.ts`의 모든 데이터가 `src/types/index.ts` 타입과 일치하도록 보장
- 필수 필드 누락 방지 (예: `is_active` 필드)
- 타입 안전성 검증을 위한 자동화된 테스트 추가

#### 3. 컴포넌트 상태 관리 오류
**증상**: UI 상태가 예상과 다르게 동작
**근본 원인**: 상태 업데이트 로직 불완전, props drilling 문제
**완전한 해결**:
- Context API 또는 상태 관리 라이브러리 적절한 사용
- 상태 업데이트의 불변성 보장
- 컴포넌트 간 데이터 흐름 명확화

#### 4. 데이터베이스 스키마 불일치
**증상**: 쿼리 실패, 필드 접근 오류
**근본 원인**: 마이그레이션과 타입 정의 간 동기화 문제
**완전한 해결**:
- 스키마 변경 시 반드시 `npm run db:generate` 실행
- 마이그레이션 파일과 타입 정의 동시 업데이트
- 개발/프로덕션 환경 간 스키마 일관성 보장

### 재발 방지를 위한 시스템적 개선

#### 자동화된 검증
- TypeScript strict 모드 활성화 유지
- ESLint/Prettier 규칙으로 코드 일관성 보장  
- Jest 테스트로 타입 안전성 검증

#### 개발 워크플로우 개선
- PR 전 타입 체크 (`npm run type-check`) 필수
- Mock 데이터 변경 시 타입 정의와 동시 검증
- 컴포넌트 개발 시 PropTypes 또는 TypeScript 인터페이스 우선 정의

#### 코드 품질 관리
- 코드 리뷰에서 근본 원인 해결 여부 확인
- 임시방편 코드에 대한 기술부채 관리
- 정기적인 리팩토링으로 구조적 문제 해결

### 문제 해결 사례 기록

#### 사례 1: Mock 데이터 is_active 필드 누락
**문제**: 데모 모드에서 모든 항목이 비활성 상태로 표시
**근본 원인**: Mock 데이터에 `is_active` 필드가 정의되지 않음
**해결**: 모든 Mock 데이터 객체에 `is_active: true` 추가
**재발 방지**: Mock 데이터 생성 시 타입 정의 기반 검증 로직 추가

이 지침을 따라 모든 문제는 **근본적으로 해결**하고, 같은 문제가 재발하지 않도록 **시스템적 개선**을 함께 수행해야 합니다.