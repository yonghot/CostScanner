'use client'

import * as React from 'react'
import { PriceChange } from '@/components/ui/charts/PriceChange'
import { Sparkline } from '@/components/ui/charts/Sparkline'

/**
 * Auth 우측 다크 패널.
 * 실시간 가격 프리뷰(2.4초마다 순환) + 소셜프루프 카드 3종.
 * 모바일(lg 미만)에서는 숨김.
 */

interface PreviewItem {
  name: string
  unit: string
  basePrice: number
  changes: number[]
  spark: number[]
  color: string
}

const PREVIEW_ITEMS: PreviewItem[] = [
  {
    name: '양파',
    unit: 'kg',
    basePrice: 1850,
    changes: [0.022, -0.014, 0.031, -0.018],
    spark: [1620, 1680, 1710, 1745, 1790, 1820, 1840, 1850],
    color: '#FF7A00',
  },
  {
    name: '돼지 앞다리',
    unit: 'kg',
    basePrice: 18500,
    changes: [0.052, 0.071, 0.043, 0.058],
    spark: [17200, 17500, 17800, 18000, 18200, 18350, 18450, 18500],
    color: '#F2A900',
  },
  {
    name: '쌀',
    unit: '20kg',
    basePrice: 54200,
    changes: [-0.012, -0.008, -0.015, -0.011],
    spark: [55400, 55100, 54800, 54600, 54400, 54300, 54250, 54200],
    color: '#1F9D55',
  },
  {
    name: '우유',
    unit: '1L',
    basePrice: 2890,
    changes: [0.008, 0.012, 0.005, 0.009],
    spark: [2820, 2840, 2855, 2865, 2870, 2880, 2885, 2890],
    color: '#2B6CB0',
  },
]

const STATS = [
  { value: '1,247', label: '활성 매장' },
  { value: '₩8.2억', label: '월 절약 실적' },
  { value: '96%', label: '재계약율' },
]

function formatKRW(n: number): string {
  return '₩' + Math.round(n).toLocaleString('ko-KR')
}

export default function AuthVisualPanel() {
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-ink-900 p-12 xl:p-16 text-white">
      {/* 배경 그라데이션 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 500px at 100% 0%, rgba(255,122,0,0.18), transparent), radial-gradient(500px 400px at 0% 100%, rgba(255,184,0,0.10), transparent)',
        }}
      />

      {/* 상단: 헤드라인 */}
      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
          LIVE MARKET
        </div>
        <h2 className="mt-4 max-w-md text-3xl xl:text-4xl font-extrabold leading-tight">
          서울 외식업 시장이
          <br />
          지금 이 순간 움직입니다
        </h2>
        <p className="mt-3 max-w-md text-sm xl:text-base leading-relaxed text-white/65">
          시장 3곳 · 공급처 12곳 · 실시간 가격 수집.
          <br />
          가입 즉시 우리 매장 메뉴에 자동 연결됩니다.
        </p>
      </div>

      {/* 가운데: 실시간 가격 프리뷰 */}
      <div className="relative z-10 my-10">
        <div
          className="rounded-2xl border border-white/10 p-5 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
              LIVE · 서울 · 방금 전
            </span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {PREVIEW_ITEMS.map((item, idx) => {
              const change = item.changes[tick % item.changes.length]
              const adjustedPrice = Math.round(item.basePrice * (1 + change * 0.1))
              return (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 shrink-0 rounded-sm"
                    style={{ background: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-white/45">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                  <Sparkline
                    data={item.spark}
                    width={56}
                    height={20}
                    color={item.color}
                    fill={false}
                    strokeWidth={1.5}
                    className="opacity-80"
                  />
                  <span className="tabular-nums text-sm font-semibold text-white/85 min-w-[70px] text-right">
                    {formatKRW(adjustedPrice)}
                  </span>
                  <PriceChange change={change} chip size="sm" showIcon={false} />
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between text-[11px] text-white/45">
            <span>총 {PREVIEW_ITEMS.length}개 식자재</span>
            <span className="tabular-nums">2.4초마다 갱신</span>
          </div>
        </div>
      </div>

      {/* 하단: 소셜프루프 */}
      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-2xl xl:text-3xl font-extrabold tabular-nums text-white">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-white/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
