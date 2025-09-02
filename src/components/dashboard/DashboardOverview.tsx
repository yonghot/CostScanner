'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Building2, 
  ChefHat, 
  Bell,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { formatCurrency, formatPercent, getPriceChangeColor } from '@/lib/utils/formatting'

interface DashboardSummary {
  total_recipes: number
  active_price_alerts: number
  avg_recipe_cost: number
  monthly_spending: number
  cost_savings_this_month: number
  top_expensive_ingredient: string
}

interface DashboardOverviewProps {
  summaryData?: DashboardSummary
  userId: string
}

export default function DashboardOverview({ summaryData, userId }: DashboardOverviewProps) {
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [priceChanges, setPriceChanges] = useState<any[]>([])

  // 가상의 최신 데이터 (실제로는 Supabase에서 가져옴)
  useEffect(() => {
    // 여기서 실제 API 호출로 데이터를 가져올 예정
    setRecentAlerts([
      { id: 1, ingredient: '양파', change: 15.2, type: 'increase' },
      { id: 2, ingredient: '대파', change: -8.5, type: 'decrease' },
      { id: 3, ingredient: '당근', change: 22.1, type: 'increase' }
    ])

    setPriceChanges([
      { ingredient: '양파', currentPrice: 1800, previousPrice: 1564, change: 0.151 },
      { ingredient: '대파', currentPrice: 2200, previousPrice: 2406, change: -0.085 },
      { ingredient: '감자', currentPrice: 1500, previousPrice: 1350, change: 0.111 }
    ])
  }, [userId])

  const stats = [
    {
      name: '등록된 레시피',
      value: summaryData?.total_recipes || 0,
      icon: ChefHat,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      name: '활성 알림',
      value: summaryData?.active_price_alerts || 0,
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: '평균 레시피 원가',
      value: formatCurrency(summaryData?.avg_recipe_cost || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: '이번 달 절약액',
      value: formatCurrency(summaryData?.cost_savings_this_month || 0),
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 가격 변동 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">최근 가격 변동</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {priceChanges.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{item.ingredient}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.previousPrice)} → {formatCurrency(item.currentPrice)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center ${getPriceChangeColor(item.change)}`}>
                    {item.change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-medium">
                      {formatPercent(Math.abs(item.change))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <button className="text-primary text-sm font-medium hover:text-primary-dark">
              모든 가격 변동 보기 →
            </button>
          </div>
        </div>

        {/* 알림 및 주의사항 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">알림 및 주의사항</h3>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  alert.type === 'increase' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {alert.type === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.ingredient} 가격 {alert.type === 'increase' ? '상승' : '하락'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.abs(alert.change)}% {alert.type === 'increase' ? '증가' : '감소'}
                  </p>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <button className="text-primary text-sm font-medium hover:text-primary-dark">
              모든 알림 보기 →
            </button>
          </div>
        </div>
      </div>

      {/* 간단한 차트 영역 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">월별 원가 추이</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded">
              3개월
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
              6개월
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
              1년
            </button>
          </div>
        </div>
        
        {/* 실제 차트 컴포넌트 자리 */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">차트 컴포넌트 영역</p>
            <p className="text-sm text-gray-400">Recharts 등을 사용하여 실제 차트 구현</p>
          </div>
        </div>
      </div>
    </div>
  )
}