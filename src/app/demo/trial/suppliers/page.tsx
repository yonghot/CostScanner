'use client'

import { useMemo, useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { LayoutGrid, List, Phone, Plus, Sparkles, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatting'
import { ScatterQuadrant } from '@/components/ui/charts/ScatterQuadrant'
import { RadarChart } from '@/components/ui/charts/RadarChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { chartSeriesColors } from '@/lib/chart-colors'
import { cn } from '@/lib/utils'
import type { SupplierUI } from '@/types'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

type SupplierScore = {
  priceScore: number
  reliabilityScore: number
  speedScore: number
  qualityScore: number
  varietyScore: number
  totalScore: number
  color: string
}

/**
 * Mock 가중치 기반 공급업체 종합 점수.
 * 실제 백엔드 점수가 들어오면 이 함수만 교체하면 됩니다.
 */
function scoreSupplier(s: SupplierUI, idx: number): SupplierScore {
  const r = Math.max(0, Math.min(5, s.rating)) / 5
  const dt = s.delivery_time || ''
  const speedScore = dt.includes('당일')
    ? 0.95
    : dt.includes('1-2')
      ? 0.78
      : dt.includes('2-3')
        ? 0.55
        : 0.5
  const priceScore = Math.max(
    0.1,
    1 - Math.min(1, (s.min_order || 0) / 250000)
  )
  const varietyScore = Math.min(1, (s.specialties?.length || 1) / 5)
  const reliabilityScore = Math.min(1, r + (s.is_active ? 0.05 : -0.1))
  const qualityScore = r
  const totalScore =
    priceScore * 0.4 + reliabilityScore * 0.3 + qualityScore * 0.3
  return {
    priceScore,
    reliabilityScore,
    speedScore,
    qualityScore,
    varietyScore,
    totalScore,
    color: chartSeriesColors[idx % chartSeriesColors.length],
  }
}

/** 대표 품목 가격 mock — 공급업체 상세 카드용 */
const REPRESENTATIVE_ITEMS: Array<{ name: string; price: number; ratio: number }> = [
  { name: '양파', price: 1850, ratio: 0.72 },
  { name: '대파', price: 2380, ratio: 0.85 },
  { name: '한우등심', price: 12800, ratio: 0.6 },
  { name: '계란', price: 7200, ratio: 0.78 },
  { name: '감자', price: 1640, ratio: 0.68 },
]

/** 12개월 배송 기록 mock (정적 SVG 막대) */
const DELIVERY_HISTORY = [12, 15, 14, 13, 16, 17, 15, 14, 16, 15, 17, 16]

export default function DemoSuppliersPage() {
  const { demoState } = useDemoContext()
  const [selectedId, setSelectedId] = useState<string | null>(
    demoState.suppliers[0]?.id ?? null
  )
  const [tab, setTab] = useState<'matrix' | 'list'>('matrix')
  const [signupPrompt, setSignupPrompt] = useState({
    isOpen: false,
    feature: '',
    description: '',
  })

  // 공급업체별 점수 계산 (메모이제이션)
  const scoreMap = useMemo(() => {
    const map = new Map<string, SupplierScore>()
    demoState.suppliers.forEach((s, i) => map.set(s.id, scoreSupplier(s, i)))
    return map
  }, [demoState.suppliers])

  // 매트릭스용 좌표
  const quadrantPoints = useMemo(() => {
    return demoState.suppliers.map((s) => {
      const sc = scoreMap.get(s.id)!
      return {
        id: s.id,
        x: sc.priceScore,
        y: sc.qualityScore,
        r: 10 + sc.speedScore * 18,
        label: s.name.slice(0, 2),
        color: sc.color,
      }
    })
  }, [demoState.suppliers, scoreMap])

  // 종합 랭킹 (정렬된 사본)
  const rankedSuppliers = useMemo(() => {
    return [...demoState.suppliers].sort(
      (a, b) =>
        (scoreMap.get(b.id)?.totalScore ?? 0) -
        (scoreMap.get(a.id)?.totalScore ?? 0)
    )
  }, [demoState.suppliers, scoreMap])

  const selected =
    demoState.suppliers.find((s) => s.id === selectedId) ??
    demoState.suppliers[0]
  const selectedScore = selected ? scoreMap.get(selected.id) : undefined

  const handleSignupPrompt = (feature: string, description: string) => {
    setSignupPrompt({ isOpen: true, feature, description })
  }

  if (!selected || !selectedScore) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-ink-100 bg-white p-12 text-center shadow-soft-1">
          <h3 className="text-lg font-bold text-ink-900">
            등록된 공급업체가 없습니다
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            데모 환경을 초기화한 뒤 다시 시도해 주세요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900">공급업체 매트릭스</h1>
          <p className="mt-1 text-sm text-ink-500">
            {demoState.suppliers.length}곳 · 가격과 신뢰도 사이 이상적 위치를 찾아보세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleSignupPrompt(
                '새 공급업체 추가',
                '데모 버전에서는 새 공급업체 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-4 py-2 text-sm font-bold text-ink-700 transition-colors hover:bg-ink-50"
          >
            <Plus className="h-4 w-4" />
            공급처 추가
          </button>
          <button
            onClick={() =>
              handleSignupPrompt(
                'AI 추천',
                '데모 버전에서는 AI 추천 기능이 제한됩니다. 회원가입 후 이용해주세요.'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-brand transition-colors hover:bg-primary-600"
          >
            <Sparkles className="h-4 w-4" />
            AI 추천
          </button>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'matrix' | 'list')}>
        <TabsList>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <LayoutGrid className="h-3.5 w-3.5" />
            매트릭스
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-3.5 w-3.5" />
            리스트
          </TabsTrigger>
        </TabsList>

        {/* ── 매트릭스 뷰 ─────────────────────────── */}
        <TabsContent value="matrix">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
            {/* Quadrant card */}
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">
                    가격 vs 품질 매트릭스
                  </h3>
                  <p className="mt-0.5 text-sm text-ink-500">
                    원 크기 = 배송 신뢰도
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                  <Sparkles className="h-3 w-3" />
                  AI 추천
                </span>
              </div>
              <ScatterQuadrant
                points={quadrantPoints}
                xLabel="← 저가     가격     고가 →"
                yLabel="← 낮음     품질     높음 →"
                idealQuadrant="tl"
                onPointClick={(p) => p.id && setSelectedId(p.id)}
              />
            </div>

            {/* Ranking */}
            <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-1">
              <div className="border-b border-ink-100 p-5">
                <h3 className="text-lg font-bold text-ink-900">종합 랭킹</h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  가격 40% · 신뢰도 30% · 품질 30%
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {rankedSuppliers.map((s, i) => {
                  const sc = scoreMap.get(s.id)!
                  const isActive = s.id === selected.id
                  const isTop = i < 3
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                        isActive
                          ? 'border-primary bg-primary-50/70'
                          : 'border-ink-100 bg-white hover:border-ink-200'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tabular-nums',
                          isTop
                            ? 'bg-ink-900 text-white'
                            : 'bg-ink-100 text-ink-600'
                        )}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-bold text-ink-900">
                            {s.name}
                          </span>
                          {/* Mini Radar 60×60 */}
                          <RadarChart
                            axes={['가격', '신뢰', '속도', '품질', '다양성']}
                            values={[
                              sc.priceScore,
                              sc.reliabilityScore,
                              sc.speedScore,
                              sc.qualityScore,
                              sc.varietyScore,
                            ]}
                            size={60}
                            color={sc.color}
                          />
                        </div>
                        <div className="mt-1 flex items-center gap-2.5 text-xs text-ink-500">
                          <span>
                            가격{' '}
                            <b className="text-ink-800 tabular-nums">
                              {Math.round(sc.priceScore * 100)}
                            </b>
                          </span>
                          <span>
                            신뢰{' '}
                            <b className="text-ink-800 tabular-nums">
                              {Math.round(sc.reliabilityScore * 100)}
                            </b>
                          </span>
                          <span>
                            품질{' '}
                            <b className="text-ink-800 tabular-nums">
                              {Math.round(sc.qualityScore * 100)}
                            </b>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-ink-900 tabular-nums">
                          {Math.round(sc.totalScore * 100)}
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                          종합
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 선택된 공급업체 상세 — 3 카드 */}
          <SupplierDetailCards
            supplier={selected}
            score={selectedScore}
            onContact={() =>
              handleSignupPrompt(
                '연락하기',
                '데모 버전에서는 공급업체 연락 기능이 제한됩니다. 회원가입 후 이용해주세요.'
              )
            }
            onDelete={() =>
              handleSignupPrompt(
                '공급업체 삭제',
                '데모 버전에서는 공급업체 삭제 기능이 제한됩니다. 회원가입 후 이용해주세요.'
              )
            }
          />
        </TabsContent>

        {/* ── 리스트 뷰 ─────────────────────────── */}
        <TabsContent value="list">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rankedSuppliers.map((s, i) => {
              const sc = scoreMap.get(s.id)!
              const isActive = s.id === selected.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    'rounded-2xl border bg-white p-5 text-left shadow-soft-1 transition-all',
                    isActive
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-ink-100 hover:border-ink-200 hover:shadow-soft-2'
                  )}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-extrabold text-white tabular-nums"
                      title={`종합 ${i + 1}위`}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-bold text-ink-900">
                        {s.name}
                      </div>
                      <div className="text-xs text-ink-500">
                        {s.specialties.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                    <RadarChart
                      axes={['가격', '신뢰', '속도', '품질', '다양성']}
                      values={[
                        sc.priceScore,
                        sc.reliabilityScore,
                        sc.speedScore,
                        sc.qualityScore,
                        sc.varietyScore,
                      ]}
                      size={60}
                      color={sc.color}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-ink-100 pt-3">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">
                        가격
                      </div>
                      <div className="text-base font-extrabold text-ink-900 tabular-nums">
                        {Math.round(sc.priceScore * 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">
                        신뢰
                      </div>
                      <div className="text-base font-extrabold text-ink-900 tabular-nums">
                        {Math.round(sc.reliabilityScore * 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">
                        품질
                      </div>
                      <div className="text-base font-extrabold text-ink-900 tabular-nums">
                        {Math.round(sc.qualityScore * 100)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                    <span className="text-[11px] font-medium text-ink-500">
                      종합 점수
                    </span>
                    <span
                      className="text-2xl font-extrabold tabular-nums"
                      style={{ color: sc.color }}
                    >
                      {Math.round(sc.totalScore * 100)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 리스트 뷰에서도 선택 상세 카드 동일하게 */}
          <SupplierDetailCards
            supplier={selected}
            score={selectedScore}
            onContact={() =>
              handleSignupPrompt(
                '연락하기',
                '데모 버전에서는 공급업체 연락 기능이 제한됩니다. 회원가입 후 이용해주세요.'
              )
            }
            onDelete={() =>
              handleSignupPrompt(
                '공급업체 삭제',
                '데모 버전에서는 공급업체 삭제 기능이 제한됩니다. 회원가입 후 이용해주세요.'
              )
            }
          />
        </TabsContent>
      </Tabs>

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

/* ──────────────────────────────────────────────────────── */
/* 선택된 공급업체 상세 카드 (3개)                          */
/* ──────────────────────────────────────────────────────── */
function SupplierDetailCards({
  supplier,
  score,
  onContact,
  onDelete,
}: {
  supplier: SupplierUI
  score: SupplierScore
  onContact: () => void
  onDelete: () => void
}) {
  const maxDelivery = Math.max(...DELIVERY_HISTORY)

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* 1. 다차원 점수 — Radar */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-extrabold text-white"
            style={{ background: score.color }}
          >
            {supplier.name[0]}
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-ink-900">
              {supplier.name}
            </div>
            <div className="text-xs text-ink-500">
              {supplier.address?.split(' ')[0] || '서울'} ·{' '}
              {supplier.delivery_time || '미지정'} ·{' '}
              {supplier.total_orders ?? 0}회 거래
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <RadarChart
            axes={['가격', '신뢰', '속도', '품질', '다양성']}
            values={[
              score.priceScore,
              score.reliabilityScore,
              score.speedScore,
              score.qualityScore,
              score.varietyScore,
            ]}
            compareValues={[0.5, 0.6, 0.6, 0.6, 0.5]}
            size={200}
            color={score.color}
          />
        </div>
        <div className="mt-2 text-center text-[11px] text-ink-500">
          점선 = 시장 평균 비교
        </div>
      </div>

      {/* 2. 대표 품목 가격 */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
        <h4 className="text-base font-bold text-ink-900">
          가격 비교 · 대표 품목
        </h4>
        <p className="mb-3 mt-0.5 text-xs text-ink-500">
          시장 평균 대비 이 공급처의 가격 비율
        </p>
        <div className="flex flex-col gap-2.5">
          {REPRESENTATIVE_ITEMS.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-sm font-semibold text-ink-800">
                {item.name}
              </span>
              <div className="flex flex-1 items-center gap-2">
                <div className="relative h-2 flex-1 rounded-full bg-ink-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${Math.round(item.ratio * 100)}%`,
                      background: score.color,
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-sm font-bold text-ink-900 tabular-nums">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-[#DEF4E6] px-3 py-2.5 text-sm font-semibold text-[#1F9D55] tabular-nums">
          이 공급처 전환 시 월 ₩124,000 절약 예상
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onContact}
            className="flex-1 rounded-lg bg-success px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            <Phone className="mr-1 inline h-3.5 w-3.5" />
            연락하기
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-error/30 px-2.5 py-2 text-error transition-colors hover:bg-error/10"
            aria-label="삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3. 배송 기록 — 정적 SVG 막대 차트 */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
        <h4 className="text-base font-bold text-ink-900">배송 기록</h4>
        <p className="mb-3 mt-0.5 text-xs text-ink-500">
          최근 12개월 월별 건수
        </p>
        <div className="h-44 w-full">
          <svg
            viewBox="0 0 240 160"
            className="h-full w-full"
            aria-label="월별 배송 건수 막대 차트"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <line
                key={t}
                x1={0}
                x2={240}
                y1={140 - t * 120}
                y2={140 - t * 120}
                stroke="hsl(42 30% 91%)"
                strokeDasharray={t === 0 ? '' : '3 3'}
              />
            ))}
            {/* Bars */}
            {DELIVERY_HISTORY.map((v, i) => {
              const barWidth = 12
              const gap = (240 - barWidth * 12) / 13
              const x = gap + i * (barWidth + gap)
              const h = (v / maxDelivery) * 120
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={140 - h}
                    width={barWidth}
                    height={h}
                    rx={3}
                    fill={chartSeriesColors[0]}
                    opacity={0.85}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={155}
                    fontSize="9"
                    fill="hsl(30 12% 53%)"
                    textAnchor="middle"
                  >
                    {i + 1}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              정시율
            </div>
            <div className="mt-0.5 flex items-baseline gap-1 text-2xl font-extrabold text-ink-900 tabular-nums">
              96<span className="text-sm font-bold text-ink-500">%</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              평균 지연
            </div>
            <div className="mt-0.5 flex items-baseline gap-1 text-2xl font-extrabold text-ink-900 tabular-nums">
              12<span className="text-sm font-bold text-ink-500">분</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              클레임
            </div>
            <div className="mt-0.5 flex items-baseline gap-1 text-2xl font-extrabold text-ink-900 tabular-nums">
              2<span className="text-sm font-bold text-ink-500">건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
