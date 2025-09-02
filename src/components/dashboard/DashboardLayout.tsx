'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
  ChefHat, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Bell,
  User,
  LogOut
} from 'lucide-react'
// import { Database } from '@/types/supabase'
import { DASHBOARD_NAVIGATION } from '@/constants/navigation'
import { APP_CONFIG } from '@/constants/app'

interface DashboardLayoutProps {
  children: React.ReactNode
  session: any
}

export default function DashboardLayout({ children, session }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  // 개발 중에는 Supabase 클라이언트 생성을 비활성화합니다
  const handleSignOut = async () => {
    // 개발 모드에서는 단순히 로그인 페이지로 이동
    router.push('/auth/login')
    router.refresh()
  }

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    LayoutDashboard,
    Package,
    Building2,
    ChefHat,
    BarChart3,
    Settings
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {DASHBOARD_NAVIGATION.map((item) => {
              const IconComponent = iconMap[item.icon || 'LayoutDashboard']
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 사용자 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user?.user_metadata?.name || session.user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.user_metadata?.business_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="lg:hidden -ml-2 mr-2 h-10 w-10 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* 경로 표시 */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {DASHBOARD_NAVIGATION.map((item) => {
                    if (pathname === item.href) {
                      return (
                        <li key={item.href}>
                          <span className="text-gray-500 text-sm">{item.name}</span>
                        </li>
                      )
                    }
                    return null
                  })}
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* 알림 */}
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* 사용자 메뉴 */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </button>

                {/* 드롭다운 메뉴 */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="inline h-4 w-4 mr-2" />
                      설정
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        handleSignOut()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* 사용자 메뉴 오버레이 */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  )
}