'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CostSegment {
  label: string
  cost: number
  color: string
}

interface CostDNABarProps {
  /** 판매 가격 */
  sellPrice: number
  /** 원가 구성 세그먼트 */
  segments: CostSegment[]
  /** 이익 세그먼트 색상 */
  profitColor?: string
  /** 높이 */
  height?: number
  /** 세그먼트 라벨 표시 여부 */
  showLabels?: boolean
  className?: string
}

/**
 * 원가 DNA 바 — 판매가 대비 원가 구성을 수평 스택 바로 시각화.
 * 레시피 원가 계산 화면의 핵심 시그니처 컴포넌트.
 */
export function CostDNABar({
  sellPrice,
  segments,
  profitColor = 'hsl(var(--success))',
  height = 44,
  showLabels = true,
  className,
}: CostDNABarProps) {
  const totalCost = segments.reduce((s, x) => s + x.cost, 0)
  const profit = Math.max(sellPrice - totalCost, 0)
  const pct = (v: number) => (v / sellPrice) * 100

  return (
    <div className={cn('w-full', className)}>
      <div
        className="flex overflow-hidden rounded-xl shadow-sm"
        style={{ height }}
        role="img"
        aria-label={`원가 ${totalCost.toLocaleString()}원, 이익 ${profit.toLocaleString()}원`}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-[11px] font-bold text-white"
            style={{ width: `${pct(seg.cost)}%`, background: seg.color, minWidth: 1 }}
            title={`${seg.label}: ${seg.cost.toLocaleString()}원 (${pct(seg.cost).toFixed(1)}%)`}
          >
            {showLabels && pct(seg.cost) > 5 && <span className="truncate px-1">{seg.label}</span>}
          </div>
        ))}
        <div
          className="flex items-center justify-center text-xs font-bold text-white"
          style={{ width: `${pct(profit)}%`, background: profitColor }}
          title={`이익: ${profit.toLocaleString()}원 (${pct(profit).toFixed(1)}%)`}
        >
          {showLabels && pct(profit) > 8 && '이익'}
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>₩0</span>
        <span>원가율 {((totalCost / sellPrice) * 100).toFixed(1)}%</span>
        <span>₩{sellPrice.toLocaleString()}</span>
      </div>
    </div>
  )
}
