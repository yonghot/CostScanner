'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fill?: boolean
  strokeWidth?: number
  className?: string
}

/**
 * Lightweight inline SVG sparkline — no deps.
 * Use for dense row indicators in tables.
 */
export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = 'hsl(var(--primary))',
  fill = true,
  strokeWidth = 1.5,
  className,
}: SparklineProps) {
  const pts = React.useMemo(() => {
    if (!data.length) return { line: '', area: '' }
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const step = width / Math.max(data.length - 1, 1)
    const points = data.map((v, i) => [i * step, height - ((v - min) / range) * height] as const)
    const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
    const area = `${line} L${width},${height} L0,${height} Z`
    return { line, area }
  }, [data, width, height])

  const gradId = React.useId()

  return (
    <svg width={width} height={height} className={cn('overflow-visible', className)} aria-hidden>
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={pts.area} fill={`url(#${gradId})`} />
        </>
      )}
      <path
        d={pts.line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
