'use client'

import { useEffect, useState } from 'react'
import {
  TrendingDown,
  Package,
  Building2,
  ChefHat,
  Bell,
  BarChart3,
  Wallet,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'
import { Sparkline } from '@/components/ui/charts/Sparkline'
import { PriceChange } from '@/components/ui/charts/PriceChange'
import { chartSeriesColors, priceColors } from '@/lib/chart-colors'

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

interface PriceItem {
  ingredient: string
  currentPrice: number
  previousPrice: number
  /** -1.0 ~ +1.0 */
  change: number
  trend: number[]
}

interface AlertItem {
  id: number
  ingredient: string
  change: number
  type: 'increase' | 'decrease'
  timeAgo: string
}

export default function DashboardOverview({
  summaryData,
  userId,
}: DashboardOverviewProps) {
  const [recentAlerts, setRecentAlerts] = useState<AlertItem[]>([])
  const [priceChanges, setPriceChanges] = useState<PriceItem[]>([])

  useEffect(() => {
    setRecentAlerts([
      { id: 1, ingredient: '양파',     change: 0.152,  type: 'increase', timeAgo: '12분 전' },
      { id: 2, ingredient: '대파',     change: -0.085, type: 'decrease', timeAgo: '1시간 전' },
      { id: 3, ingredient: '당근',     change: 0.221,  type: 'increase', timeAgo: '3시간 전' },
    ])

    setPriceChanges([
      { ingredient: '양파',           currentPrice: 1800, previousPrice: 1564, change:  0.151, trend: [1500, 1520, 1480, 1560, 1620, 1700, 1800] },
      { ingredient: '대파',           currentPrice: 2200, previousPrice: 2406, change: -0.085, trend: [2500, 2480, 2420, 2380, 2300, 2240, 2200] },
      { ingredient: '감자',           currentPrice: 1500, previousPrice: 1350, change:  0.111, trend: [1300, 1320, 1340, 1360, 1410, 1450, 1500] },
      { ingredient: '돼지고기 목살',   currentPrice: 17800, previousPrice: 18420, change: -0.034, trend: [18800, 18600, 18500, 18450, 18300, 18000, 17800] },
    ])
  }, [userId])

  const totalToday = summaryData?.monthly_spending
    ? Math.round(summaryData.monthly_spending / 30)
    : 248_000
  const todayDelta = -0.043 // 어제 대비

  const stats: Array<{
    name: string
    value: string | number
    icon: typeof ChefHat
    iconBg: string
    iconColor: string
    spark: number[]
    sparkColor: string
  }> = [
    {
      name: '등록된 레시피',
      value: summaryData?.total_recipes ?? 24,
      icon: ChefHat,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      spark: [18, 19, 19, 21, 22, 23, 24],
      sparkColor: chartSeriesColors[0],
    },
    {
      name: '활성 알림',
      value: summaryData?.active_price_alerts ?? 7,
      icon: Bell,
      iconBg: 'bg-[#FEF3D4]',
      iconColor: 'text-[#B85200]',
      spark: [4, 5, 5, 6, 6, 7, 7],
      sparkColor: chartSeriesColors[1],
    },
    {
      name: '평균 레시피 원가',
      value: formatCurrency(summaryData?.avg_recipe_cost ?? 8420),
      icon: Wallet,
      iconBg: 'bg-[#DEF4E6]',
      iconColor: 'text-[#1F9D55]',
      spark: [8800, 8650, 8600, 8520, 8480, 8460, 8420],
      sparkColor: chartSeriesColors[2],
    },
    {
      name: '이번 달 절약액',
      value: formatCurrency(summaryData?.cost_savings_this_month ?? 384_500),
      icon: TrendingDown,
      iconBg: 'bg-[#E5EEF8]',
      iconColor: 'text-[#2B6CB0]',
      spark: [50, 120, 180, 220, 280, 340, 384],
      sparkColor: chartSeriesColors[3],
    },
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* 히어로: 오늘의 총 원가 */}
      <section className="professional-card overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-caption uppercase tracking-wider text-ink-500">
              오늘의 총 원가
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-display tabular-nums text-ink-900">
                {formatCurrency(totalToday)}
              </h2>
              <PriceChange change={todayDelta} chip size="md" />
            </div>
            <p className="text-caption text-ink-500">
              어제 대비 절약 진행 중 · {summaryData?.top_expensive_ingredient ?? '돼지고기 목살'} 비중 가장 큼
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 focus-ring">
              알림 설정
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-600 focus-ring shadow-brand">
              <span className="inline-flex items-center gap-1.5">
                절약 리포트 보기 <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-column KPI 카드 + Sparkline */}
      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        aria-label="주요 지표"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article
              key={stat.name}
              className="professional-card p-5 interactive-hover"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={2.2} />
                </div>
                <Sparkline
                  data={stat.spark}
                  color={stat.sparkColor}
                  width={72}
                  height={24}
                />
              </div>
              <p className="mt-4 text-caption text-ink-500">{stat.name}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-ink-900">
                {stat.value}
              </p>
            </article>
          )
        })}
      </section>

      {/* 2-col: 가격 변동 + 알림 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 최근 가격 변동 */}
        <section className="professional-card">
          <header className="professional-card-header flex items-center justify-between">
            <div>
              <h3 className="text-title">최근 가격 변동</h3>
              <p className="text-caption">실시간 추적 중인 식자재 4종</p>
            </div>
            <BarChart3 className="h-5 w-5 text-ink-400" />
          </header>

          <div className="divide-y divide-border/60">
            {priceChanges.map((item) => (
              <div
                key={item.ingredient}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-50 text-ink-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">
                      {item.ingredient}
                    </p>
                    <p className="text-xs tabular-nums text-ink-500">
                      {formatCurrency(item.previousPrice)} →{' '}
                      <span className="font-semibold text-ink-700">
                        {formatCurrency(item.currentPrice)}
                      </span>
                    </p>
                  </div>
                </div>
                <Sparkline
                  data={item.trend}
                  color={
                    item.change > 0 ? priceColors.up : priceColors.down
                  }
                  width={64}
                  height={20}
                />
                <PriceChange change={item.change} chip size="sm" />
              </div>
            ))}
          </div>

          <footer className="professional-card-footer">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 focus-ring">
              모든 가격 변동 보기 →
            </button>
          </footer>
        </section>

        {/* 알림 */}
        <section className="professional-card">
          <header className="professional-card-header flex items-center justify-between">
            <div>
              <h3 className="text-title">알림 및 주의사항</h3>
              <p className="text-caption">임계가 도달 / 급등락 감지</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-[#F2A900]" />
          </header>

          <div className="space-y-3 p-4">
            {recentAlerts.map((alert) => {
              const isUp = alert.type === 'increase'
              return (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-cream p-3 transition hover:bg-ink-50"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isUp ? 'bg-[#FDE5E1]' : 'bg-[#DEF4E6]'
                    }`}
                  >
                    {isUp ? (
                      <TrendingDown
                        className="h-4 w-4 rotate-180 text-[#E8412D]"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <TrendingDown
                        className="h-4 w-4 text-[#1F9D55]"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-900">
                      {alert.ingredient} 가격 {isUp ? '상승' : '하락'}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-ink-500">
                      <Clock className="h-3 w-3" />
                      {alert.timeAgo}
                    </p>
                  </div>
                  <PriceChange change={alert.change} size="sm" />
                </div>
              )
            })}
          </div>

          <footer className="professional-card-footer">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 focus-ring">
              모든 알림 보기 →
            </button>
          </footer>
        </section>
      </div>

      {/* 월별 원가 추이 (placeholder, 후속 PR에서 Recharts) */}
      <section className="professional-card">
        <header className="professional-card-header flex items-center justify-between">
          <div>
            <h3 className="text-title">월별 원가 추이</h3>
            <p className="text-caption">지난 3개월 평균 원가 곡선</p>
          </div>
          <div className="flex gap-1.5">
            {(['3개월', '6개월', '1년'] as const).map((label, i) => (
              <button
                key={label}
                className={
                  i === 0
                    ? 'rounded-md bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700'
                    : 'rounded-md bg-ink-50 px-3 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100'
                }
              >
                {label}
              </button>
            ))}
          </div>
        </header>
        <div className="m-6 flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-cream to-ink-50">
          <div className="text-center">
            <Building2 className="mx-auto mb-2 h-10 w-10 text-ink-300" />
            <p className="text-sm text-ink-500">
              Recharts 차트 영역 — Phase 3 후속 PR
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
