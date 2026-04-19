'use client'

import { useMemo, useState } from 'react'
import {
  Package,
  Search,
  Plus,
  Bell,
  ShoppingCart,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useDemoContext } from '@/contexts/DemoContext'
import { formatPrice } from '@/lib/utils/formatting'
import { Sparkline } from '@/components/ui/charts/Sparkline'
import { PriceChange } from '@/components/ui/charts/PriceChange'
import { priceColors } from '@/lib/chart-colors'
import SignupPromptModal from '@/components/demo/SignupPromptModal'
import AddIngredientModal from '@/components/demo/AddIngredientModal'
import EditIngredientModal from '@/components/demo/EditIngredientModal'
import DeleteIngredientModal from '@/components/demo/DeleteIngredientModal'
import { cn } from '@/lib/utils'
import type { IngredientUI } from '@/types'

// ───────────────────────── 카테고리 / 이모지 ─────────────────────────
const CATEGORIES = [
  '전체',
  '육류',
  '채소',
  '향신료',
  '조미료',
  '곡류',
  '난류',
  '유제품',
  '해산물',
] as const

const CATEGORY_EMOJI: Record<string, string> = {
  채소: '🥬',
  육류: '🥩',
  유제품: '🥚',
  난류: '🥚',
  해산물: '🐟',
  조미료: '🧂',
  향신료: '🌶️',
  과일: '🍎',
  곡류: '🌾',
  기타: '🍴',
}

// ───────────────────────── 가격 변동률 ─────────────────────────
function calcPriceChange(ing: IngredientUI): number {
  if (!ing.price_history || ing.price_history.length < 2) return 0
  const cur = ing.price_history[ing.price_history.length - 1].price
  const prev = ing.price_history[ing.price_history.length - 2].price
  if (!prev) return 0
  return (cur - prev) / prev
}

// ───────────────────────── Sparkline 시드 데이터 ─────────────────────────
function getSparkData(ing: IngredientUI): number[] {
  if (ing.price_history && ing.price_history.length >= 2) {
    return ing.price_history.map((p) => p.price)
  }
  const base = ing.current_price || 1000
  let seed = 0
  for (let i = 0; i < ing.id.length; i++) seed = (seed * 31 + ing.id.charCodeAt(i)) >>> 0
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
  return Array.from({ length: 12 }, () => Math.round(base * (0.9 + rand() * 0.2)))
}

// ───────────────────────── 재고 상태 ─────────────────────────
function statusBadge(status?: string) {
  switch (status) {
    case 'available':
      return { label: '충분', cls: 'bg-[#DEF4E6] text-[#1F9D55]' }
    case 'low_stock':
      return { label: '부족', cls: 'bg-[#FEF3D4] text-[#B85200]' }
    case 'out_of_stock':
      return { label: '없음', cls: 'bg-[#FDE5E1] text-[#E8412D]' }
    default:
      return { label: '미정', cls: 'bg-ink-100 text-ink-600' }
  }
}

export default function DemoIngredientsPage() {
  const { demoState } = useDemoContext()

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<IngredientUI | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<IngredientUI | null>(null)
  const [signupPrompt, setSignupPrompt] = useState({
    isOpen: false,
    feature: '',
    description: '',
  })

  // 사용 가능한 카테고리만 표시
  const usedCategories = useMemo(() => {
    const used = new Set(demoState.ingredients.map((i) => i.category))
    return CATEGORIES.filter((c) => c === '전체' || used.has(c))
  }, [demoState.ingredients])

  // 필터링
  const filtered = useMemo(() => {
    return demoState.ingredients.filter((ing) => {
      if (activeCategory !== '전체' && ing.category !== activeCategory) return false
      if (
        query &&
        !ing.name.toLowerCase().includes(query.toLowerCase()) &&
        !ing.description?.toLowerCase().includes(query.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [demoState.ingredients, activeCategory, query])

  // 자동 첫번째 선택
  const selected: IngredientUI | null = useMemo(() => {
    if (filtered.length === 0) return null
    if (selectedId) {
      const found = filtered.find((i) => i.id === selectedId)
      if (found) return found
    }
    return filtered[0]
  }, [filtered, selectedId])

  // 재고 카운트
  const counts = useMemo(() => {
    return {
      available: filtered.filter((i) => i.status === 'available').length,
      low: filtered.filter((i) => i.status === 'low_stock').length,
      out: filtered.filter((i) => i.status === 'out_of_stock').length,
    }
  }, [filtered])

  // ───────── 핸들러 ─────────
  const handleEdit = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '식자재 수정',
      description:
        '데모 버전에서는 식자재 수정 기능이 제한됩니다. 회원가입 후 이용해주세요.',
    })
  }

  const handleDelete = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '식자재 삭제',
      description:
        '데모 버전에서는 식자재 삭제 기능이 제한됩니다. 회원가입 후 이용해주세요.',
    })
  }

  const handleAddIngredient = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '새 식자재 추가',
      description:
        '데모 버전에서는 새 식자재 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.',
    })
  }

  const handleAlertSetup = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '알림 설정',
      description:
        '데모 버전에서는 알림 설정 기능이 제한됩니다. 회원가입 후 이용해주세요.',
    })
  }

  const handleOrder = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '최저가 발주',
      description:
        '데모 버전에서는 발주 기능이 제한됩니다. 회원가입 후 이용해주세요.',
    })
  }

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* ───────────── 페이지 헤더 ───────────── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-headline text-ink-900">식자재 관리</h1>
          <p className="text-caption text-ink-500 mt-1">
            총{' '}
            <span className="tabular-nums font-semibold text-ink-700">
              {demoState.ingredients.length}
            </span>
            개의 식자재가 등록되어 있습니다
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddIngredient}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-600 focus-ring shadow-brand transition-colors"
        >
          <Plus className="h-4 w-4" />새 식자재 추가
        </button>
      </div>

      {/* ───────────── Split View ───────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: 검색 + 카테고리 + 테이블 */}
        <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-1 overflow-hidden">
          {/* 검색 인풋 */}
          <div className="px-5 py-4 border-b border-ink-100">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                size={16}
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="식자재명으로 검색..."
                className="w-full h-10 pl-10 pr-3 text-sm rounded-lg border border-ink-200 bg-cream/40 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                aria-label="식자재 검색"
              />
            </div>
          </div>

          {/* 카테고리 pill 필터 */}
          <div className="px-5 py-3 border-b border-ink-100 flex flex-wrap gap-2">
            {usedCategories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors focus-ring',
                    isActive
                      ? 'bg-ink-900 text-cream'
                      : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                  )}
                  aria-pressed={isActive}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-ink-50/50">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                    품목
                  </th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                    현재가
                  </th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                    변동
                  </th>
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                    추이
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                    재고
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map((ingredient) => {
                  const change = calcPriceChange(ingredient)
                  const sparkData = getSparkData(ingredient)
                  const isSelected = selected?.id === ingredient.id
                  const sparkColor = change >= 0 ? priceColors.up : priceColors.down
                  const status = statusBadge(ingredient.status)
                  return (
                    <tr
                      key={ingredient.id}
                      onClick={() => setSelectedId(ingredient.id)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isSelected ? 'bg-primary-50' : 'hover:bg-ink-50/40'
                      )}
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-50 text-base">
                            {CATEGORY_EMOJI[ingredient.category] || '🍴'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-ink-900 truncate">
                              {ingredient.name}
                            </div>
                            <div className="text-[11px] text-ink-500">
                              {ingredient.category} · {ingredient.unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-ink-900 tabular-nums">
                          {formatPrice(ingredient.current_price)}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap text-right">
                        <PriceChange change={change} chip size="sm" />
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap text-center">
                        <div className="inline-block">
                          <Sparkline
                            data={sparkData}
                            width={64}
                            height={20}
                            color={sparkColor}
                            strokeWidth={1.5}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full',
                            status.cls
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-10 w-10 text-ink-300 mx-auto mb-3" />
                <p className="text-sm text-ink-500">
                  {query || activeCategory !== '전체'
                    ? '검색 조건에 맞는 식자재가 없습니다.'
                    : '등록된 식자재가 없습니다.'}
                </p>
              </div>
            )}
          </div>

          {/* 푸터 요약 */}
          <div className="px-5 py-3 border-t border-ink-100 bg-ink-50/30 flex items-center justify-between text-xs">
            <span className="text-ink-600 font-medium">
              총{' '}
              <span className="tabular-nums text-ink-900 font-bold">
                {filtered.length}
              </span>
              개 표시
            </span>
            <div className="flex items-center gap-3 text-ink-500">
              <span>
                충분{' '}
                <span className="tabular-nums font-semibold text-[#1F9D55]">
                  {counts.available}
                </span>
              </span>
              <span>
                부족{' '}
                <span className="tabular-nums font-semibold text-[#B85200]">
                  {counts.low}
                </span>
              </span>
              <span>
                없음{' '}
                <span className="tabular-nums font-semibold text-[#E8412D]">
                  {counts.out}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: 상세 패널 */}
        <div className="lg:sticky lg:top-6 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
          {selected ? (
            <IngredientDetailPanel
              ingredient={selected}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAlertSetup={handleAlertSetup}
              onOrder={handleOrder}
            />
          ) : (
            <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-1 p-8 text-center">
              <Package className="h-10 w-10 text-ink-300 mx-auto mb-3" />
              <p className="text-sm text-ink-500">
                식자재를 선택하면 상세 정보가 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ───────────── Modals (시그니처 보존) ───────────── */}
      <AddIngredientModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {editingIngredient && (
        <EditIngredientModal
          ingredient={editingIngredient}
          open={!!editingIngredient}
          onOpenChange={(open) => !open && setEditingIngredient(null)}
        />
      )}

      {deletingIngredient && (
        <DeleteIngredientModal
          ingredient={deletingIngredient}
          open={!!deletingIngredient}
          onOpenChange={(open) => !open && setDeletingIngredient(null)}
        />
      )}

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

// ─────────────────────────────────────────────────────────────────────
// Detail Panel
// ─────────────────────────────────────────────────────────────────────
interface IngredientDetailPanelProps {
  ingredient: IngredientUI
  onEdit: () => void
  onDelete: () => void
  onAlertSetup: () => void
  onOrder: () => void
}

function IngredientDetailPanel({
  ingredient,
  onEdit,
  onDelete,
  onAlertSetup,
  onOrder,
}: IngredientDetailPanelProps) {
  const change = calcPriceChange(ingredient)
  const sparkData = getSparkData(ingredient)

  // 30일 추이 — 기존 데이터를 늘려서 볼륨감 부여
  const longSpark = useMemo(() => {
    return [
      ...sparkData.map((v) => Math.round(v * 0.98)),
      ...sparkData,
      ...sparkData.map((v) => Math.round(v * 1.01)),
      ...sparkData,
    ]
  }, [sparkData])

  const prevPrice =
    ingredient.price_history && ingredient.price_history.length >= 2
      ? ingredient.price_history[ingredient.price_history.length - 2].price
      : ingredient.current_price

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-2 p-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div
          className="rounded-xl bg-ink-50 flex items-center justify-center text-3xl shrink-0"
          style={{ width: 52, height: 52 }}
        >
          {CATEGORY_EMOJI[ingredient.category] || '🍴'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ink-100 text-ink-700">
              {ingredient.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-ink-900 mt-1 truncate">
            {ingredient.name}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 rounded-lg text-ink-500 hover:text-primary hover:bg-primary-50 transition-colors focus-ring"
            aria-label="수정"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-ink-500 hover:text-error hover:bg-error/10 transition-colors focus-ring"
            aria-label="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 현재 단가 카드 */}
      <div className="mt-5 rounded-2xl p-5 border border-ink-100 bg-gradient-to-br from-cream to-white">
        <div className="text-xs text-ink-500 font-medium">
          현재 단가 · {ingredient.unit}
        </div>
        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="text-3xl font-extrabold text-ink-900 tabular-nums">
            {formatPrice(ingredient.current_price)}
          </span>
          <PriceChange change={change} chip size="lg" />
        </div>
        <div className="mt-2 text-xs text-ink-500 tabular-nums">
          전일 {formatPrice(prevPrice)}
        </div>
      </div>

      {/* 30일 추이 */}
      <div className="mt-6">
        <div className="text-xs text-ink-500 font-medium mb-2.5">30일 추이</div>
        <div className="rounded-xl bg-ink-50 p-3">
          <Sparkline
            data={longSpark}
            width={380}
            height={80}
            color={priceColors.up && priceColors.down ? '#FF7A00' : priceColors.up}
            strokeWidth={2}
            className="w-full"
          />
        </div>
      </div>

      {/* 설명 */}
      {ingredient.description && (
        <div className="mt-5 rounded-xl bg-cream/60 border border-border/40 p-3">
          <p className="text-xs text-ink-600 leading-relaxed">
            {ingredient.description}
          </p>
        </div>
      )}

      {/* 재고 정보 */}
      {ingredient.stock_level !== undefined && (
        <div className="mt-5 px-4 py-3 rounded-xl bg-ink-50 flex items-center justify-between text-xs">
          <span className="text-ink-600 font-medium">현재 재고</span>
          <span className="tabular-nums font-bold text-ink-900">
            {ingredient.stock_level}
            {ingredient.unit}
            {ingredient.min_stock_level !== undefined && (
              <span className="text-ink-500 font-normal ml-1">
                / 최소 {ingredient.min_stock_level}
                {ingredient.unit}
              </span>
            )}
          </span>
        </div>
      )}

      {/* CTA 버튼 */}
      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={onAlertSetup}
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-ink-200 bg-white text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors focus-ring"
        >
          <Bell size={14} />
          알림 설정
        </button>
        <button
          type="button"
          onClick={onOrder}
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-brand focus-ring"
        >
          <ShoppingCart size={14} />
          최저가 발주
        </button>
      </div>
    </div>
  )
}
