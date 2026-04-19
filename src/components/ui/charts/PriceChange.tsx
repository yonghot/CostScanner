'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface PriceChangeProps {
  /** 변동률 (-1 ~ +1, 예: 0.05 = +5%) */
  change: number
  /** 텍스트 크기 변형 */
  size?: 'sm' | 'md' | 'lg'
  /** 칩 스타일 여부 */
  chip?: boolean
  /** 아이콘 표시 여부 */
  showIcon?: boolean
  className?: string
}

/**
 * 한국형 금융 UX — 가격 변동 표시.
 * 상승 = 빨강(#E8412D), 하락 = 초록(#1F9D55).
 */
export function PriceChange({
  change,
  size = 'md',
  chip = false,
  showIcon = true,
  className,
}: PriceChangeProps) {
  const isUp = change > 0.001
  const isDown = change < -0.001
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
  const colorClass = isUp
    ? 'text-[#E8412D]'
    : isDown
    ? 'text-[#1F9D55]'
    : 'text-muted-foreground'
  const bgClass = isUp
    ? 'bg-[#FDE5E1] text-[#E8412D]'
    : isDown
    ? 'bg-[#DEF4E6] text-[#1F9D55]'
    : 'bg-muted text-muted-foreground'

  const sizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size]

  const iconSize = { sm: 10, md: 12, lg: 14 }[size]

  const content = (
    <>
      {showIcon && <Icon size={iconSize} strokeWidth={2.5} />}
      <span>
        {isUp ? '+' : ''}
        {(change * 100).toFixed(1)}%
      </span>
    </>
  )

  if (chip) {
    return (
      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold tabular-nums', sizeClass, bgClass, className)}>
        {content}
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold tabular-nums', sizeClass, colorClass, className)}>
      {content}
    </span>
  )
}
