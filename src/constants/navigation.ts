export interface NavigationItem {
  name: string
  href: string
  icon?: string
  description?: string
  children?: NavigationItem[]
}

export const DASHBOARD_NAVIGATION: NavigationItem[] = [
  {
    name: '대시보드',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    description: '전체 현황 확인'
  },
  {
    name: '식자재 관리',
    href: '/dashboard/ingredients',
    icon: 'Package',
    description: '식자재 목록 및 가격 모니터링'
  },
  {
    name: '공급업체 관리',
    href: '/dashboard/suppliers',
    icon: 'Building2',
    description: '공급업체 정보 및 가격 비교'
  },
  {
    name: '레시피 관리',
    href: '/dashboard/recipes',
    icon: 'ChefHat',
    description: '레시피별 원가 계산'
  },
  {
    name: '리포트',
    href: '/dashboard/reports',
    icon: 'BarChart3',
    description: '비용 분석 리포트'
  },
  {
    name: '설정',
    href: '/dashboard/settings',
    icon: 'Settings',
    description: '계정 및 알림 설정'
  }
]

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  CALLBACK: '/auth/callback'
} as const

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing'
} as const

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  INGREDIENTS: '/dashboard/ingredients',
  SUPPLIERS: '/dashboard/suppliers',
  RECIPES: '/dashboard/recipes',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings'
} as const

export const API_ROUTES = {
  AUTH_CALLBACK: '/auth/callback',
  COLLECT: '/api/collect',
  ANALYZE: '/api/analyze'
} as const