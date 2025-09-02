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
  RefreshCw
} from 'lucide-react'
import { APP_CONFIG } from '@/constants/app'
import { useDemoContext } from '@/contexts/DemoContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Play className="h-5 w-5" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">데모 체험 모드</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    무료 체험
                  </Badge>
                </div>
                <p className="text-sm text-primary-foreground/80">
                  {demoState.user.name}님, CostScanner의 모든 기능을 자유롭게 체험해보세요
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost" 
                size="sm"
                onClick={resetDemo}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                초기화
              </Button>
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-primary/5"
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

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-lg font-bold text-gray-900">{APP_CONFIG.name}</span>
            </div>
            
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const IconComponent = item.icon
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/5 text-primary border-primary/20'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Demo Info Card */}
            <div className="p-4">
              <Card className="bg-gradient-to-br from-primary/5 to-purple-50 border-primary/20">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-sm font-semibold text-primary-dark">데모 계정 정보</div>
                    <div className="text-xs text-primary">
                      <div>{demoState.user.company}</div>
                      <div>{demoState.user.email}</div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {demoState.user.subscription_tier === 'pro' ? '프로 플랜' : '무료 플랜'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-lg font-bold text-gray-900">{APP_CONFIG.name}</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const IconComponent = item.icon
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                          isActive
                            ? 'bg-primary/5 text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <IconComponent
                          className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
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
            <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
              <Button
                variant="ghost"
                size="sm"
                className="px-4 border-r border-gray-200 text-gray-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex-1 px-4 flex justify-between items-center">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span className="ml-2 text-lg font-bold text-gray-900">{APP_CONFIG.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}