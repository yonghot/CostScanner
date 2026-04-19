'use client'

import { useMemo, useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { ChefHat, Filter, Plus, RefreshCw, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatting'
import { CostDNABar } from '@/components/ui/charts/CostDNABar'
import { PriceChange } from '@/components/ui/charts/PriceChange'
import { chartSeriesColors } from '@/lib/chart-colors'
import { cn } from '@/lib/utils'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

/**
 * 원가율(원가/판매가)에 따른 칩 색상.
 * <30% 건강(초록) / 30~40% 주의(주황) / >=40% 위험(빨강)
 */
function getCostRatioChipClass(ratio: number): string {
  if (ratio < 30) return 'bg-[#DEF4E6] text-[#1F9D55]'
  if (ratio >= 40) return 'bg-[#FDE5E1] text-[#E8412D]'
  return 'bg-[#FEF3D4] text-[#B85200]'
}

function getCostRatioLabel(ratio: number): string {
  if (ratio < 30) return '건강'
  if (ratio >= 40) return '위험'
  return '주의'
}

/** 결정적(매번 동일한) 가격 변동률 — 식자재 id 기반. -15% ~ +15% */
function getDeterministicChange(id: string): number {
  let seed = 0
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0
  const norm = (seed % 30000) / 100000
  return norm - 0.15
}

export default function DemoRecipesPage() {
  const { demoState } = useDemoContext()
  const [selectedId, setSelectedId] = useState<string | null>(
    demoState.recipes[0]?.id ?? null
  )
  const [signupPrompt, setSignupPrompt] = useState({
    isOpen: false,
    feature: '',
    description: '',
  })

  // 좌측 카드용 — 메뉴별 원가/원가율 미리 계산
  const recipeCards = useMemo(() => {
    return demoState.recipes.map((r) => {
      const totalCost = r.total_cost || 0
      const sellPrice = r.selling_price || 0
      const costRatio = sellPrice > 0 ? (totalCost / sellPrice) * 100 : 0
      return { recipe: r, totalCost, sellPrice, costRatio }
    })
  }, [demoState.recipes])

  // 우측 상세용 — 선택된 메뉴
  const selected = useMemo(() => {
    return (
      recipeCards.find((c) => c.recipe.id === selectedId) ?? recipeCards[0]
    )
  }, [recipeCards, selectedId])

  // CostDNABar 세그먼트 변환
  const dnaSegments = useMemo(() => {
    if (!selected) return []
    return selected.recipe.ingredients.map((ing, i) => ({
      label: ing.name,
      cost: ing.cost,
      color: chartSeriesColors[i % chartSeriesColors.length],
    }))
  }, [selected])

  // 가장 비싼 재료 — AI 제안 모의용
  const topIngredient = useMemo(() => {
    if (!selected || !selected.recipe.ingredients.length) return null
    return [...selected.recipe.ingredients].sort((a, b) => b.cost - a.cost)[0]
  }, [selected])

  const handleSignupPrompt = (feature: string, description: string) => {
    setSignupPrompt({ isOpen: true, feature, description })
  }

  if (!selected) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-ink-100 bg-white p-12 text-center shadow-soft-1">
          <ChefHat className="mx-auto mb-4 h-12 w-12 text-ink-300" />
          <h3 className="text-lg font-bold text-ink-900">등록된 레시피가 없습니다</h3>
          <p className="mt-1 text-sm text-ink-500">
            데모 환경을 초기화한 뒤 다시 시도해 주세요
          </p>
        </div>
      </div>
    )
  }

  const { recipe: r, totalCost, sellPrice, costRatio } = selected
  const margin = sellPrice - totalCost
  const marginPct = sellPrice > 0 ? (margin / sellPrice) * 100 : 0

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900">레시피 원가 DNA</h1>
          <p className="mt-1 text-sm text-ink-500">
            각 메뉴의 원가 구조를 유전자처럼 풀어봅니다 · 총 {demoState.recipes.length}개 메뉴
          </p>
        </div>
        <button
          onClick={() =>
            handleSignupPrompt(
              '새 레시피 추가',
              '데모 버전에서는 새 레시피 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.'
            )
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-brand transition-colors hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />새 레시피 추가
        </button>
      </header>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        {/* Recipe list */}
        <aside className="self-start rounded-2xl border border-ink-100 bg-white p-3 shadow-soft-1">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              메뉴 {recipeCards.length}개
            </span>
            <Filter className="h-3.5 w-3.5 text-ink-400" />
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {recipeCards.map((c) => {
              const isActive = c.recipe.id === selected.recipe.id
              const chipClass = getCostRatioChipClass(c.costRatio)
              return (
                <button
                  key={c.recipe.id}
                  type="button"
                  onClick={() => setSelectedId(c.recipe.id)}
                  className={cn(
                    'rounded-xl p-3 text-left transition-all',
                    isActive
                      ? 'bg-ink-900 text-white shadow-soft-2'
                      : 'text-ink-800 hover:bg-ink-50'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold">
                      {c.recipe.name}
                    </span>
                    {c.sellPrice > 0 && (
                      <span
                        className={cn(
                          'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                          isActive ? 'bg-white/95' : '',
                          isActive
                            ? c.costRatio < 30
                              ? 'text-[#1F9D55]'
                              : c.costRatio >= 40
                                ? 'text-[#E8412D]'
                                : 'text-[#B85200]'
                            : chipClass
                        )}
                      >
                        {c.costRatio.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'mt-1 flex justify-between text-[11px] tabular-nums',
                      isActive ? 'text-white/65' : 'text-ink-500'
                    )}
                  >
                    <span>판매 {formatPrice(c.sellPrice)}</span>
                    <span>원가 {formatPrice(c.totalCost)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Detail panel */}
        <div className="flex flex-col gap-5">
          {/* Summary card */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-ink-900">{r.name}</h2>
                <p className="mt-1 text-sm text-ink-500">
                  {r.category} · {r.servings}인분 기준
                </p>
              </div>
              <div className="flex flex-wrap gap-5">
                <div className="text-right">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
                    판매가
                  </div>
                  <div className="mt-0.5 text-2xl font-extrabold text-ink-900 tabular-nums">
                    {formatPrice(sellPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
                    원가
                  </div>
                  <div className="mt-0.5 text-2xl font-extrabold text-[#E8412D] tabular-nums">
                    −{formatPrice(totalCost)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
                    이익
                  </div>
                  <div
                    className={cn(
                      'mt-0.5 text-2xl font-extrabold tabular-nums',
                      margin >= 0 ? 'text-[#1F9D55]' : 'text-[#E8412D]'
                    )}
                  >
                    {formatPrice(margin)}
                  </div>
                </div>
              </div>
            </div>

            {/* DNA bar */}
            {sellPrice > 0 && dnaSegments.length > 0 && (
              <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                    원가 DNA
                  </span>
                  <span className="text-[11px] tabular-nums text-ink-500">
                    {costRatio.toFixed(1)}% 원가율 · {marginPct.toFixed(1)}% 마진
                  </span>
                </div>
                <CostDNABar
                  sellPrice={sellPrice}
                  segments={dnaSegments}
                  profitColor="#1F9D55"
                  height={44}
                />
              </div>
            )}

            {/* 4-card KPI */}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-ink-50 p-4">
                <div className="text-[11px] font-medium text-ink-500">원가율</div>
                <div className="mt-1 text-xl font-extrabold text-ink-900 tabular-nums">
                  {costRatio.toFixed(0)}%
                </div>
                <span
                  className={cn(
                    'mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    getCostRatioChipClass(costRatio)
                  )}
                >
                  {getCostRatioLabel(costRatio)}
                </span>
              </div>
              <div className="rounded-xl bg-ink-50 p-4">
                <div className="text-[11px] font-medium text-ink-500">마진율</div>
                <div className="mt-1 text-xl font-extrabold text-ink-900 tabular-nums">
                  {marginPct.toFixed(0)}%
                </div>
                <span className="mt-2 inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold text-ink-700">
                  목표 65%
                </span>
              </div>
              <div className="rounded-xl bg-ink-50 p-4">
                <div className="text-[11px] font-medium text-ink-500">30일 변동</div>
                <div className="mt-1 text-xl font-extrabold text-ink-900 tabular-nums">
                  +3.2%
                </div>
                <span className="mt-2 inline-flex rounded-full bg-[#FDE5E1] px-2 py-0.5 text-[10px] font-semibold text-[#E8412D]">
                  원가 상승
                </span>
              </div>
              <div className="rounded-xl bg-ink-50 p-4">
                <div className="text-[11px] font-medium text-ink-500">그릇당 이익</div>
                <div className="mt-1 text-xl font-extrabold text-ink-900 tabular-nums">
                  {formatPrice(Math.round(margin / Math.max(1, r.servings)))}
                </div>
                <span className="mt-2 inline-flex rounded-full bg-[#DEF4E6] px-2 py-0.5 text-[10px] font-semibold text-[#1F9D55] tabular-nums">
                  월 {formatPrice(Math.round((margin * 42 * 30) / r.servings))}
                </span>
              </div>
            </div>
          </section>

          {/* Ingredient breakdown */}
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft-1">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-ink-900">재료 구성</h3>
                <p className="mt-0.5 text-xs text-ink-500">
                  {r.ingredients.length}개 재료 · 가격 변동은 실시간 반영
                </p>
              </div>
              <button
                onClick={() =>
                  handleSignupPrompt(
                    '가격 재계산',
                    '데모 버전에서는 가격 재계산이 제한됩니다. 회원가입 후 이용해주세요.'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                가격 재계산
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-ink-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      재료
                    </th>
                    <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      사용량
                    </th>
                    <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      단가
                    </th>
                    <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      원가
                    </th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      비중
                    </th>
                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      30일 변동
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {r.ingredients.map((ing, idx) => {
                    const ingredient = demoState.ingredients.find(
                      (i) => i.id === ing.ingredient_id
                    )
                    const pct = totalCost > 0 ? (ing.cost / totalCost) * 100 : 0
                    const change = getDeterministicChange(ing.ingredient_id)
                    const segColor =
                      chartSeriesColors[idx % chartSeriesColors.length]
                    return (
                      <tr
                        key={ing.ingredient_id}
                        className="transition-colors hover:bg-ink-50/40"
                      >
                        <td className="whitespace-nowrap px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="h-7 w-1.5 rounded-full"
                              style={{ background: segColor }}
                            />
                            <span className="text-sm font-semibold text-ink-900">
                              {ing.name}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-center text-sm text-ink-600 tabular-nums">
                          {ing.quantity}
                          {ing.unit}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-right text-sm text-ink-600 tabular-nums">
                          {ingredient
                            ? `${formatPrice(ingredient.current_price)}/${ingredient.unit}`
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-right text-sm font-bold text-ink-900 tabular-nums">
                          {formatPrice(ing.cost)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: segColor,
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-ink-600 tabular-nums">
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3.5 text-right">
                          <PriceChange change={change} chip size="sm" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-ink-50/30">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-3 text-sm font-semibold text-ink-700"
                    >
                      총합
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-extrabold text-ink-900 tabular-nums">
                      {formatPrice(totalCost)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* AI 원가 개선 제안 */}
            {topIngredient && (
              <div className="flex items-center gap-4 border-l-4 border-l-primary border-t border-ink-100 bg-primary-50 px-6 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-brand">
                  <Sparkles className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-primary-700">
                    AI 원가 개선 제안
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-primary-700">
                    <span className="font-semibold">{topIngredient.name}</span>
                    을(를) 가락시장 직배송 공급처로 변경하면 그릇당{' '}
                    <strong className="tabular-nums">
                      {formatPrice(Math.round(topIngredient.cost * 0.12))}
                    </strong>{' '}
                    절약 가능 · 월 예상{' '}
                    <strong className="tabular-nums">
                      {formatPrice(Math.round(topIngredient.cost * 0.12 * 42 * 30))}
                    </strong>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleSignupPrompt(
                      'AI 제안 적용',
                      '데모 버전에서는 AI 제안 적용이 제한됩니다. 회원가입 후 이용해주세요.'
                    )
                  }
                  className="inline-flex shrink-0 items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-brand transition-colors hover:bg-primary-600"
                >
                  적용하기
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

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
