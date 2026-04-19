'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ChefHat,
  Package,
  Users,
  TrendingDown,
  AlertTriangle,
  Wallet,
  Bell,
  BarChart3,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { useDemoContext } from '@/contexts/DemoContext'
import { formatCurrency } from '@/lib/utils/formatting'
import { Sparkline } from '@/components/ui/charts/Sparkline'
import { PriceChange } from '@/components/ui/charts/PriceChange'
import { chartSeriesColors, priceColors } from '@/lib/chart-colors'
import SignupPromptModal from '@/components/demo/SignupPromptModal'
import { cn } from '@/lib/utils'

/**
 * 결정적(deterministic) 노이즈 — id 기반 시드.
 * 리렌더마다 흔들리지 않도록.
 */
function seededTrend(seedKey: string, base: number, points = 7): number[] {
  let seed = 0
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0
  }
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
  return Array.from({ length: points }, () =>
    Math.round(base * (0.92 + rand() * 0.16))
  )
}

export default function DemoTrialPage() {
  const { demoState } = useDemoContext()
  const [signupPrompt, setSignupPrompt] = useState({
    isOpen: false,
    feature: '',
    description: '',
  })

  // ───────────────────────── 요약 통계 ─────────────────────────
  const totalIngredients = demoState.ingredients.length
  const totalRecipes = demoState.recipes.length
  const totalSuppliers = demoState.suppliers.length
  const activeAlerts = demoState.priceAlerts.filter((alert) => alert.is_active).length

  // 오늘의 총 원가 (mock)
  const totalToday = 248_000
  const todayDelta = -0.043

  // ───────────────────────── 가격 변동 데이터 ─────────────────────────
  const priceChanges = useMemo(() => {
    return demoState.ingredients.slice(0, 4).map((ing) => {
      const current = ing.current_price
      const history = ing.price_history ?? []
      const previous =
        history.length >= 2 ? history[history.length - 2].price : current
      const change = previous > 0 ? (current - previous) / previous : 0
      const trend =
        history.length >= 5
          ? history.slice(-7).map((h) => h.price)
          : seededTrend(ing.id, current, 7)
      return {
        id: ing.id,
        name: ing.name,
        current,
        previous,
        change,
        trend,
      }
    })
  }, [demoState.ingredients])

  // ───────────────────────── 알림 ─────────────────────────
  const recentAlerts = useMemo(() => {
    return demoState.priceAlerts
      .filter((a) => a.is_active)
      .slice(0, 4)
      .map((a, i) => {
        const ingredient = demoState.ingredients.find(
          (ing) => ing.id === a.ingredient_id
        )
        const isUp = a.alert_type === 'price_increase'
        // 알림별 결정적 변동률
        const change = (isUp ? 1 : -1) * (0.05 + ((i * 37) % 25) / 200)
        const minutes = (i + 1) * 23
        return {
          id: a.id,
          name: ingredient?.name ?? '알 수 없음',
          type: isUp ? ('increase' as const) : ('decrease' as const),
          change,
          timeAgo:
            minutes < 60
              ? `${minutes}분 전`
              : `${Math.floor(minutes / 60)}시간 전`,
        }
      })
  }, [demoState.priceAlerts, demoState.ingredients])

  // ───────────────────────── KPI 카드 ─────────────────────────
  const stats: Array<{
    name: string
    value: string | number
    icon: typeof ChefHat
    iconBg: string
    iconColor: string
    spark: number[]
    sparkColor: string
    href: string
  }> = [
    {
      name: '등록된 식자재',
      value: totalIngredients,
      icon: Package,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      spark: seededTrend('ingredients-card', totalIngredients * 100 || 800, 7),
      sparkColor: chartSeriesColors[0],
      href: '/demo/trial/ingredients',
    },
    {
      name: '관리 중인 레시피',
      value: totalRecipes,
      icon: ChefHat,
      iconBg: 'bg-[#DEF4E6]',
      iconColor: 'text-[#1F9D55]',
      spark: seededTrend('recipes-card', totalRecipes * 80 || 600, 7),
      sparkColor: chartSeriesColors[2],
      href: '/demo/trial/recipes',
    },
    {
      name: '협력 공급업체',
      value: totalSuppliers,
      icon: Users,
      iconBg: 'bg-[#E5EEF8]',
      iconColor: 'text-[#2B6CB0]',
      spark: seededTrend('suppliers-card', totalSuppliers * 50 || 400, 7),
      sparkColor: chartSeriesColors[3],
      href: '/demo/trial/suppliers',
    },
    {
      name: '활성 알림',
      value: activeAlerts,
      icon: Bell,
      iconBg: 'bg-[#FEF3D4]',
      iconColor: 'text-[#B85200]',
      spark: seededTrend('alerts-card', activeAlerts * 5 || 30, 7),
      sparkColor: chartSeriesColors[1],
      href: '/demo/trial/settings',
    },
  ]

  const handlePromptDemo = (feature: string, description: string) => {
    setSignupPrompt({ isOpen: true, feature, description })
  }

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* ───────────── 페이지 헤더 ───────────── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-headline text-ink-900">대시보드</h1>
          <p className="text-caption text-ink-500 mt-1">
            {demoState.user.business_name}의 식자재 원가 현황을 확인하세요
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-3 py-1.5 text-xs text-ink-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span>마지막 업데이트 · 방금 전</span>
        </div>
      </div>

      {/* ───────────── 히어로: 오늘의 총 원가 ───────────── */}
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
              어제 대비 절약 진행 중 · 가장 높은 비중은{' '}
              <span className="font-semibold text-ink-700">한우등심</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handlePromptDemo(
                  '알림 설정',
                  '데모 버전에서는 알림 설정 기능이 제한됩니다. 회원가입 후 이용해주세요.'
                )
              }
              className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 focus-ring transition-colors"
            >
              알림 설정
            </button>
            <button
              type="button"
              onClick={() =>
                handlePromptDemo(
                  '리포트 생성',
                  '데모 버전에서는 리포트 생성 기능이 제한됩니다. 회원가입 후 이용해주세요.'
                )
              }
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-600 focus-ring shadow-brand transition-colors"
            >
              <span className="inline-flex items-center gap-1.5">
                절약 리포트 보기 <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ───────────── 4-column KPI 카드 + Sparkline ───────────── */}
      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        aria-label="주요 지표"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="professional-card p-5 interactive-hover focus-ring block"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    stat.iconBg
                  )}
                >
                  <Icon className={cn('h-5 w-5', stat.iconColor)} strokeWidth={2.2} />
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
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString('ko-KR')
                  : stat.value}
              </p>
            </Link>
          )
        })}
      </section>

      {/* ───────────── 2-col: 가격 변동 + 알림 ───────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 최근 가격 변동 */}
        <section className="professional-card">
          <header className="professional-card-header flex items-center justify-between">
            <div>
              <h3 className="text-title text-ink-900">최근 가격 변동</h3>
              <p className="text-caption">
                실시간 추적 중인 식자재 {priceChanges.length}종
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-ink-400" />
          </header>

          <div className="divide-y divide-border/60">
            {priceChanges.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-50 text-ink-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">
                      {item.name}
                    </p>
                    <p className="text-xs tabular-nums text-ink-500">
                      {formatCurrency(item.previous)} →{' '}
                      <span className="font-semibold text-ink-700">
                        {formatCurrency(item.current)}
                      </span>
                    </p>
                  </div>
                </div>
                <Sparkline
                  data={item.trend}
                  color={item.change > 0 ? priceColors.up : priceColors.down}
                  width={64}
                  height={20}
                />
                <PriceChange change={item.change} chip size="sm" />
              </div>
            ))}
            {priceChanges.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-ink-500">
                추적 중인 식자재가 없습니다.
              </div>
            )}
          </div>

          <footer className="professional-card-footer">
            <Link
              href="/demo/trial/ingredients"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 focus-ring"
            >
              모든 가격 변동 보기 →
            </Link>
          </footer>
        </section>

        {/* 알림 */}
        <section className="professional-card">
          <header className="professional-card-header flex items-center justify-between">
            <div>
              <h3 className="text-title text-ink-900">알림 및 주의사항</h3>
              <p className="text-caption">임계가 도달 / 급등락 감지</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-[#F2A900]" />
          </header>

          <div className="space-y-3 p-4">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => {
                const isUp = alert.type === 'increase'
                return (
                  <div
                    key={alert.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-cream p-3 transition hover:bg-ink-50"
                  >
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full',
                        isUp ? 'bg-[#FDE5E1]' : 'bg-[#DEF4E6]'
                      )}
                    >
                      <TrendingDown
                        className={cn(
                          'h-4 w-4',
                          isUp ? 'rotate-180 text-[#E8412D]' : 'text-[#1F9D55]'
                        )}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {alert.name} 가격 {isUp ? '상승' : '하락'}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-ink-500">
                        <Clock className="h-3 w-3" />
                        {alert.timeAgo}
                      </p>
                    </div>
                    <PriceChange change={alert.change} size="sm" />
                  </div>
                )
              })
            ) : (
              <div className="rounded-lg border border-dashed border-ink-200 bg-cream/60 p-6 text-center">
                <Bell className="mx-auto mb-2 h-6 w-6 text-ink-300" />
                <p className="text-sm text-ink-500">활성 알림이 없습니다.</p>
              </div>
            )}
          </div>

          <footer className="professional-card-footer">
            <Link
              href="/demo/trial/settings"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 focus-ring"
            >
              모든 알림 보기 →
            </Link>
          </footer>
        </section>
      </div>

      {/* ───────────── 빠른 작업 ───────────── */}
      <section className="professional-card">
        <header className="professional-card-header">
          <h3 className="text-title text-ink-900">빠른 작업</h3>
          <p className="text-caption">자주 쓰는 작업으로 바로 이동</p>
        </header>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          {[
            {
              icon: Package,
              label: '새 식자재 추가',
              feature: '새 식자재 추가',
              description:
                '데모 버전에서는 새 식자재 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.',
              primary: true,
            },
            {
              icon: ChefHat,
              label: '레시피 관리',
              feature: '레시피 관리',
              description:
                '데모 버전에서는 레시피 관리 기능이 제한됩니다. 회원가입 후 이용해주세요.',
              primary: false,
            },
            {
              icon: Wallet,
              label: '리포트 생성',
              feature: '리포트 생성',
              description:
                '데모 버전에서는 리포트 생성 기능이 제한됩니다. 회원가입 후 이용해주세요.',
              primary: false,
            },
          ].map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handlePromptDemo(action.feature, action.description)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-semibold transition-all focus-ring',
                  action.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary-600 shadow-brand'
                    : 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <SignupPromptModal
        isOpen={signupPrompt.isOpen}
        onOpenChange={(open) =>
          setSignupPrompt((prev) => ({ ...prev, isOpen: open }))
        }
        feature={signupPrompt.feature}
        description={signupPrompt.description}
      />
    </div>
  )
}
