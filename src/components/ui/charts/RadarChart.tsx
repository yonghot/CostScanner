'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadarChartProps {
  axes: string[]
  values: number[]
  compareValues?: number[]
  size?: number
  color?: string
  compareColor?: string
  className?: string
}

/**
 * Pentagonal/hexagonal radar chart for multi-dimension scores
 * (가격, 신뢰도, 배송속도, 품질, 다양성 등).
 */
export function RadarChart({
  axes,
  values,
  compareValues,
  size = 240,
  color = 'hsl(var(--primary))',
  compareColor = 'hsl(var(--muted-foreground))',
  className,
}: RadarChartProps) {
  const n = axes.length
  const c = size / 2
  const r = c - 28

  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return [c + Math.cos(angle) * r * v, c + Math.sin(angle) * r * v] as const
  }

  const toPath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${point(i, v)[0]},${point(i, v)[1]}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} className={className} aria-hidden>
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <polygon
          key={t}
          points={Array.from({ length: n }, (_, i) => point(i, t).join(',')).join(' ')}
          fill="none"
          stroke="hsl(var(--border))"
          strokeDasharray={t === 1 ? '' : '2 3'}
        />
      ))}
      {/* Axis lines */}
      {axes.map((_, i) => {
        const [x, y] = point(i, 1)
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="hsl(var(--border))" />
      })}
      {/* Compare layer */}
      {compareValues && (
        <path d={toPath(compareValues)} fill={compareColor} fillOpacity="0.08" stroke={compareColor} strokeWidth="1.5" strokeDasharray="4 3" />
      )}
      {/* Values */}
      <path d={toPath(values)} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2" />
      {values.map((v, i) => {
        const [x, y] = point(i, v)
        return <circle key={i} cx={x} cy={y} r="3.5" fill={color} stroke="#fff" strokeWidth="1.5" />
      })}
      {/* Labels */}
      {axes.map((label, i) => {
        const [x, y] = point(i, 1.15)
        return (
          <text
            key={label}
            x={x}
            y={y}
            fontSize="11"
            fontWeight="600"
            fill="hsl(var(--foreground))"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
