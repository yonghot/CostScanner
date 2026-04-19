'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Package,
  ChefHat,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Play,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { APP_CONFIG } from '@/constants/app'
import { useDemoContext } from '@/contexts/DemoContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '대시보드', href: '/demo/trial', icon: BarChart3 },
  { name: '식자재', href: '/demo/trial/ingredients', icon: Package },
  { name: '레시피', href: '/demo/trial/recipes', icon: ChefHat },
  { name: '공급업체', href: '/demo/trial/suppliers', icon: Users },
  { name: '리포트', href: '/demo/trial/reports', icon: FileText },
  { name: '설정', href: '/demo/trial/settings', icon: Settings },
]

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { demoState, resetDemo } = useDemoContext()

  return (
    <div className="min-h-screen bg-cream">
      {/* Demo Mode Banner */}
      <div className="bg-ink-900 text-cream border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-brand">
                <Play className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">데모 체험 모드</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary-100 border-primary/30 text-[10px]"
                  >
                    무료 체험
                  </Badge>
                </div>
                <p className="text-xs text-ink-300 mt-0.5">
                  {demoState.user.name}님, CostScanner의 모든 기능을 자유롭게 체험해보세요
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDemo}
                className="text-cream hover:bg-ink-800 focus-ring"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                초기화
              </Button>
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary-600 shadow-brand focus-ring"
                asChild
              >
                <Link href="/auth/signup">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  정식 버전 시작
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow overflow-y-auto bg-ink-900 border-r border-ink-800">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-brand">
                <BarChart3 className="h-5 w-5" strokeWidth={2.4} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-cream">코스트스캐너</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-400">
                  {APP_CONFIG.name}
                </span>
              </div>
            </div>

            <nav className="flex-1 px-3 pb-4 space-y-1" aria-label="주 메뉴">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus-ring',
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-soft-1'
                        : 'text-ink-100 hover:bg-ink-800 hover:text-cream'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isActive ? 'text-primary-600' : 'text-ink-300 group-hover:text-cream'
                      )}
                      strokeWidth={2.2}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Demo Info Card */}
            <div className="p-4 mt-auto">
              <div className="rounded-xl border border-ink-800 bg-ink-800/40 p-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary-100">
                    데모 계정
                  </div>
                  <div className="space-y-0.5 text-xs text-ink-200">
                    <div className="font-medium text-cream truncate">
                      {demoState.user.business_name}
                    </div>
                    <div className="text-ink-400 truncate">{demoState.user.email}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-primary/10 text-primary-100 border-primary/40"
                  >
                    무료 체험
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-ink-900 shadow-soft-3">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-cream hover:bg-ink-800"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="메뉴 닫기"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center gap-3 px-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-brand">
                    <BarChart3 className="h-5 w-5" strokeWidth={2.4} />
                  </div>
                  <span className="text-base font-bold text-cream">코스트스캐너</span>
                </div>
                <nav className="mt-6 px-3 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const IconComponent = item.icon

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-ink-100 hover:bg-ink-800 hover:text-cream'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <IconComponent
                          className={cn(
                            'h-5 w-5',
                            isActive ? 'text-primary-600' : 'text-ink-300 group-hover:text-cream'
                          )}
                          strokeWidth={2.2}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden">
            <div className="relative z-10 flex-shrink-0 flex h-16 bg-cream border-b border-ink-100 shadow-soft-1">
              <Button
                variant="ghost"
                size="sm"
                className="px-4 border-r border-ink-100 text-ink-600 rounded-none hover:bg-ink-50"
                onClick={() => setSidebarOpen(true)}
                aria-label="메뉴 열기"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex-1 px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-brand">
                    <BarChart3 className="h-4 w-4" strokeWidth={2.4} />
                  </div>
                  <span className="text-base font-bold text-ink-900">코스트스캐너</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 relative overflow-y-auto bg-cream focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
