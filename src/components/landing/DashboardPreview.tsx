'use client'

import Link from 'next/link'
import { 
  ChefHat, 
  Bell, 
  DollarSign, 
  TrendingDown, 
  TrendingUp,
  Package,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils/formatting'
import { mockDashboardStats, mockIngredients } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function DashboardPreview() {
  // 목업 데이터에서 가격 변동 정보 추출
  const recentPriceChanges = [
    { 
      name: '양파', 
      currentPrice: 3500, 
      previousPrice: 3040, 
      change: 0.151,
      trend: 'up' as const
    },
    { 
      name: '대파', 
      currentPrice: 4200, 
      previousPrice: 4590, 
      change: -0.085,
      trend: 'down' as const
    },
    { 
      name: '마늘', 
      currentPrice: 8500, 
      previousPrice: 7650, 
      change: 0.111,
      trend: 'up' as const
    }
  ]

  const recentAlerts = [
    { id: 1, type: 'price_increase', message: '한우등심 가격 7% 상승', time: '2시간 전' },
    { id: 2, type: 'low_stock', message: '참기름 재고 부족', time: '5시간 전' },
    { id: 3, type: 'price_drop', message: '대파 가격 8% 하락', time: '1일 전' }
  ]

  const stats = [
    {
      name: '등록된 레시피',
      value: mockDashboardStats.totalRecipes,
      icon: ChefHat,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      name: '활성 알림',
      value: mockDashboardStats.priceAlertsActive,
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: '월간 지출',
      value: formatCurrency(mockDashboardStats.monthlySpending),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: '이달 절약액',
      value: formatCurrency(mockDashboardStats.costSavingsThisMonth),
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">실시간 대시보드 프리뷰</CardTitle>
        <p className="text-sm text-muted-foreground">실제 CostScanner 대시보드의 주요 기능을 미리 체험해보세요</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 가격 변동 및 알림 섹션 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 최근 가격 변동 */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">최근 가격 변동</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPriceChanges.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-background">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.currentPrice)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.trend === 'up' ? 'destructive' : 'secondary'}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercent(Math.abs(item.change))}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 최신 알림 */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">최신 알림</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center p-3 rounded-lg border bg-muted/50">
                  <div className={`p-2 rounded-full mr-3 ${
                    alert.type === 'price_increase' ? 'bg-destructive/10' : 
                    alert.type === 'low_stock' ? 'bg-warning/10' : 'bg-success/10'
                  }`}>
                    {alert.type === 'price_increase' ? (
                      <TrendingUp className="h-3 w-3 text-destructive" />
                    ) : alert.type === 'low_stock' ? (
                      <Package className="h-3 w-3 text-warning" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-success" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 차트 영역 */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">월별 원가 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-primary/5 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* 간단한 차트 목업 */}
              <div className="absolute inset-4 flex items-end justify-around">
                <div className="w-8 bg-primary/60 rounded-t" style={{height: '40%'}}></div>
                <div className="w-8 bg-primary/70 rounded-t" style={{height: '60%'}}></div>
                <div className="w-8 bg-primary rounded-t" style={{height: '80%'}}></div>
                <div className="w-8 bg-secondary/60 rounded-t" style={{height: '45%'}}></div>
                <div className="w-8 bg-secondary/80 rounded-t" style={{height: '70%'}}></div>
                <div className="w-8 bg-secondary rounded-t" style={{height: '55%'}}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">실제 차트는 인터랙티브합니다</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />
        
        {/* CTA 섹션 */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            실제 대시보드에서 더 많은 기능을 확인하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                대시보드 둘러보기
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}