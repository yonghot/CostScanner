'use client'

import { useDemoContext } from '@/contexts/DemoContext'
import { 
  ChefHat, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils/formatting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useState } from 'react'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

export default function DemoTrialPage() {
  const { demoState } = useDemoContext()
  const [signupPrompt, setSignupPrompt] = useState({ isOpen: false, feature: '', description: '' })

  // Calculate summary statistics
  const totalIngredients = demoState.ingredients.length
  const totalRecipes = demoState.recipes.length
  const totalSuppliers = demoState.suppliers.length
  const activeAlerts = demoState.priceAlerts.filter(alert => alert.is_active).length

  // Calculate recent price changes from ingredients
  const recentPriceChanges = demoState.ingredients
    .slice(0, 5)
    .map(ingredient => {
      const recentPrice = ingredient.current_price
      const previousPrice = ingredient.price_history?.[ingredient.price_history.length - 2]?.price || recentPrice
      const change = (recentPrice - previousPrice) / previousPrice
      return {
        id: ingredient.id,
        ingredient_name: ingredient.name,
        supplier_name: ingredient.suppliers[0] || '알 수 없음',
        price: recentPrice,
        change: change,
        trend: change > 0 ? 'up' : 'down',
        lastUpdated: ingredient.updated_at
      }
    })
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())

  // Mock monthly spending data
  const monthlySpending = 2850000
  const lastMonthSpending = 3100000
  const monthlyChange = (monthlySpending - lastMonthSpending) / lastMonthSpending
  const monthlySavings = lastMonthSpending - monthlySpending

  // Mock budget progress
  const monthlyBudget = 3000000
  const budgetUsed = (monthlySpending / monthlyBudget) * 100

  const stats = [
    {
      name: '등록된 식자재',
      value: totalIngredients,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/demo/trial/ingredients'
    },
    {
      name: '관리 중인 레시피',
      value: totalRecipes,
      icon: ChefHat,
      color: 'text-success',
      bgColor: 'bg-success/10',
      href: '/demo/trial/recipes'
    },
    {
      name: '협력 공급업체',
      value: totalSuppliers,
      icon: Users,
      color: 'text-success-dark',
      bgColor: 'bg-success-light/20',
      href: '/demo/trial/suppliers'
    },
    {
      name: '활성 알림',
      value: activeAlerts,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      href: '/demo/trial/settings'
    }
  ]

  const handleQuickAction = (action: string) => {
    const actionMap = {
      'ingredient': '새 식자재 추가',
      'recipe': '레시피 관리',
      'report': '리포트 생성',
      'view-all': '전체 보기'
    }
    
    const descriptions = {
      'ingredient': '데모 버전에서는 새 식자재 추가 기능이 제한됩니다.',
      'recipe': '데모 버전에서는 레시피 관리 기능이 제한됩니다.',
      'report': '데모 버전에서는 리포트 생성 기능이 제한됩니다.',
      'view-all': '데모 버전에서는 전체 보기 기능이 제한됩니다.'
    }
    
    setSignupPrompt({
      isOpen: true,
      feature: actionMap[action as keyof typeof actionMap] || action,
      description: descriptions[action as keyof typeof descriptions] || '데모 버전에서는 해당 기능이 제한똩니다. 회원가입 후 이용해주세요.'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">
            {demoState.user.business_name}의 식자재 원가 현황을 확인하세요
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>마지막 업데이트: 방금 전</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Link href={stat.href} className="block">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-success" />
              이달 식자재 지출
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(monthlySpending)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">지난달 대비</span>
                    <Badge 
                      variant={monthlyChange < 0 ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {monthlyChange < 0 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {formatPercent(Math.abs(monthlyChange))}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">예산 사용률</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {budgetUsed.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">월 예산</span>
                  <span className="text-gray-900">{formatCurrency(monthlyBudget)}</span>
                </div>
                <Progress value={budgetUsed} className="h-2" />
                {monthlySavings > 0 && (
                  <div className="text-sm text-green-600">
                    ✓ 이달 {formatCurrency(monthlySavings)} 절약했습니다
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Price Changes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                최근 가격 변동
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleQuickAction('view-all')}>
                전체 보기
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPriceChanges.slice(0, 5).map((record, index) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Package className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.ingredient_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.supplier_name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(record.price)}
                    </div>
                    <Badge
                      variant={record.trend === 'up' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {record.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {formatPercent(Math.abs(record.change))}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              활성 알림 ({activeAlerts}개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoState.priceAlerts
                .filter(alert => alert.is_active)
                .slice(0, 3)
                .map((alert) => {
                  const ingredient = demoState.ingredients.find(ing => ing.id === alert.ingredient_id)
                  return (
                    <div 
                      key={alert.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-warning/30 bg-warning/10"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ingredient?.name} 가격 {alert.alert_type === 'price_increase' ? '상승' : '하락'} 알림
                          </div>
                          <div className="text-xs text-gray-500">
                            {alert.alert_type === 'price_increase' ? '상한가' : '하한가'}: {formatCurrency(alert.threshold_price || 0)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-warning border-warning/50">
                        활성
                      </Badge>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">빠른 작업</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4" onClick={() => handleQuickAction('ingredient')}>
              <div className="flex flex-col items-center space-y-2">
                <Package className="h-6 w-6" />
                <span>새 식자재 추가</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4" onClick={() => handleQuickAction('recipe')}>
              <div className="flex flex-col items-center space-y-2">
                <ChefHat className="h-6 w-6" />
                <span>레시피 관리</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4" onClick={() => handleQuickAction('report')}>
              <div className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>리포트 생성</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <SignupPromptModal
        isOpen={signupPrompt.isOpen}
        onOpenChange={(open) => setSignupPrompt(prev => ({ ...prev, isOpen: open }))}
        feature={signupPrompt.feature}
        description={signupPrompt.description}
      />
    </div>
  )
}