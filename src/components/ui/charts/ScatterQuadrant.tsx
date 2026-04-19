'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface QuadrantPoint {
  x: number // 0..1
  y: number // 0..1
  r?: number // radius 6..24
  label?: string
  color?: string
  id?: string
}

interface ScatterQuadrantProps {
  points: QuadrantPoint[]
  size?: number
  xLabel?: string
  yLabel?: string
  idealQuadrant?: 'tl' | 'tr' | 'bl' | 'br'
  onPointClick?: (p: QuadrantPoint) => void
  className?: string
}

/**
 * 2×2 quadrant scatter plot. For supplier price-vs-quality matrix.
 * Axes are 0..1 normalized. Origin (0,0) = bottom-left.
 */
export function ScatterQuadrant({
  points,
  size = 440,
  xLabel = 'X →',
  yLabel = 'Y →',
  idealQuadrant = 'tl',
  onPointClick,
  className,
}: ScatterQuadrantProps) {
  const pad = 48
  const inner = size - pad * 2
  const cx = (x: number) => pad + x * inner
  const cy = (y: number) => pad + (1 - y) * inner

  const ideal = {
    tl: { x: 0.15, y: 0.85, label: '이상적' },
    tr: { x: 0.85, y: 0.85, label: '프리미엄' },
    bl: { x: 0.15, y: 0.15, label: '저가' },
    br: { x: 0.85, y: 0.15, label: '주의' },
  }[idealQuadrant]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn('w-full', className)} aria-hidden>
      {/* Background quadrants */}
      <rect x={pad} y={pad} width={inner / 2} height={inner / 2} fill="hsl(var(--success) / 0.06)" />
      {/* Grid */}
      <line x1={pad + inner / 2} y1={pad} x2={pad + inner / 2} y2={pad + inner} stroke="hsl(var(--border))" strokeDasharray="3 4" />
      <line x1={pad} y1={pad + inner / 2} x2={pad + inner} y2={pad + inner / 2} stroke="hsl(var(--border))" strokeDasharray="3 4" />
      {/* Frame */}
      <rect x={pad} y={pad} width={inner} height={inner} fill="none" stroke="hsl(var(--border))" />
      {/* Ideal marker */}
      <g transform={`translate(${cx(ideal.x)}, ${cy(ideal.y)})`}>
        <text fontSize="11" fontWeight="700" fill="hsl(var(--success))" textAnchor="middle">★ {ideal.label}</text>
      </g>
      {/* Points */}
      {points.map((p, i) => (
        <g
          key={p.id ?? i}
          transform={`translate(${cx(p.x)}, ${cy(p.y)})`}
          onClick={() => onPointClick?.(p)}
          style={{ cursor: onPointClick ? 'pointer' : 'default' }}
        >
          <circle r={p.r ?? 14} fill={p.color ?? 'hsl(var(--primary))'} fillOpacity="0.8" stroke="#fff" strokeWidth="2" />
          {p.label && (
            <text fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle" dominantBaseline="central">
              {p.label}
            </text>
          )}
        </g>
      ))}
      {/* Axis labels */}
      <text x={pad + inner / 2} y={size - 14} fontSize="11" fontWeight="600" fill="hsl(var(--muted-foreground))" textAnchor="middle">{xLabel}</text>
      <text x={14} y={pad + inner / 2} fontSize="11" fontWeight="600" fill="hsl(var(--muted-foreground))" textAnchor="middle" transform={`rotate(-90, 14, ${pad + inner / 2})`}>{yLabel}</text>
    </svg>
  )
}
