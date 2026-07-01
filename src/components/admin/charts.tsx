'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { formatPaise } from '@/lib/format'
import type { DayPoint, Split } from '@/lib/admin-metrics'

/**
 * Chart palette, validated with the dataviz six-checks validator (light surface):
 * lightness band, chroma floor, CVD separation ΔE 43, contrast >= 3:1. All PASS.
 */
export const CHART_GREEN = '#2E8B64'
export const CHART_GOLD = '#B8860B'
const GRID = 'rgba(26,60,52,0.08)'
const INK_MUTED = 'rgba(26,60,52,0.45)'

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, width }
}

function compactRupees(paise: number): string {
  const r = paise / 100
  if (r >= 100000) return `₹${(r / 100000).toFixed(1)}L`
  if (r >= 1000) return `₹${(r / 1000).toFixed(r >= 10000 ? 0 : 1)}k`
  return `₹${Math.round(r)}`
}

/* ── Revenue line chart: change-over-time, single series (no legend) ── */

export function RevenueLineChart({ data }: { data: DayPoint[] }) {
  const { ref, width } = useContainerWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const H = 240
  const PAD = { top: 16, right: 12, bottom: 28, left: 46 }

  const { path, area, points, maxY } = useMemo(() => {
    const w = Math.max(width, 280)
    const innerW = w - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const max = Math.max(...data.map((d) => d.revenuePaise), 100)
    const maxRounded = Math.ceil(max / 100000) * 100000 || 100000

    const pts = data.map((d, i) => ({
      x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
      y: PAD.top + innerH - (d.revenuePaise / maxRounded) * innerH,
      d,
    }))
    const linePath = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ')
    const areaPath = `${linePath} L${pts[pts.length - 1]?.x.toFixed(1)},${
      H - PAD.bottom
    } L${PAD.left},${H - PAD.bottom} Z`
    return { path: linePath, area: areaPath, points: pts, maxY: maxRounded }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width])

  const w = Math.max(width, 280)
  const gridYs = [0.25, 0.5, 0.75, 1]
  const xTickEvery = Math.ceil(data.length / 5)
  const hovered = hover !== null ? points[hover] : null

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    let nearest = 0
    let best = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - x)
      if (dist < best) {
        best = dist
        nearest = i
      }
    })
    setHover(nearest)
  }

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg
          width={w}
          height={H}
          role="img"
          aria-label="Revenue per day, last 30 days"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          className="block touch-none"
        >
          {/* Grid */}
          {gridYs.map((g) => {
            const y = PAD.top + (H - PAD.top - PAD.bottom) * (1 - g)
            return (
              <g key={g}>
                <line x1={PAD.left} x2={w - PAD.right} y1={y} y2={y} stroke={GRID} strokeWidth={1} />
                <text x={PAD.left - 8} y={y + 3.5} textAnchor="end" fontSize={10} fill={INK_MUTED}>
                  {compactRupees(maxY * g)}
                </text>
              </g>
            )
          })}
          <line
            x1={PAD.left}
            x2={w - PAD.right}
            y1={H - PAD.bottom}
            y2={H - PAD.bottom}
            stroke="rgba(26,60,52,0.18)"
            strokeWidth={1}
          />

          {/* X labels */}
          {points.map((p, i) =>
            i % xTickEvery === 0 ? (
              <text key={p.d.date} x={p.x} y={H - 8} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
                {p.d.label}
              </text>
            ) : null
          )}

          {/* Area + line */}
          <path d={area} fill={CHART_GREEN} opacity={0.07} />
          <path d={path} fill="none" stroke={CHART_GREEN} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* Crosshair + hovered point */}
          {hovered && (
            <g>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="rgba(26,60,52,0.25)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle cx={hovered.x} cy={hovered.y} r={4.5} fill={CHART_GREEN} stroke="#fff" strokeWidth={2} />
            </g>
          )}
        </svg>
      )}

      {/* Tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 bg-forest-950 text-cream rounded-lg px-3 py-2 text-xs shadow-lg -translate-x-1/2"
          style={{
            left: Math.min(Math.max(hovered.x, 70), w - 70),
            top: Math.max(hovered.y - 58, 0),
          }}
        >
          <p className="text-cream/60">{hovered.d.label}</p>
          <p className="font-semibold tabular-nums">{formatPaise(hovered.d.revenuePaise)}</p>
          <p className="text-cream/60">
            {hovered.d.orders} {hovered.d.orders === 1 ? 'order' : 'orders'}
          </p>
        </div>
      )}

      {/* Screen-reader table */}
      <table className="sr-only">
        <caption>Revenue per day</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{d.label}</td>
              <td>{formatPaise(d.revenuePaise)}</td>
              <td>{d.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Horizontal bar list: magnitude, one hue, direct labels ── */

export function HBarList({
  items,
}: {
  items: { label: string; value: number; display: string }[]
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label} title={`${item.label}: ${item.display}`}>
          <div className="flex items-baseline justify-between gap-4 mb-1.5">
            <span className="text-sm text-forest-900 truncate">{item.label}</span>
            <span className="text-sm font-semibold text-forest-900 tabular-nums flex-shrink-0">
              {item.display}
            </span>
          </div>
          <div className="h-2.5 bg-forest-900/6 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: CHART_GREEN,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ── 100% split bar: 2-3 categories, fixed hue order, 2px gaps, legend ── */

const SPLIT_COLORS = [CHART_GREEN, CHART_GOLD, '#6B7A76']

export function SplitBar({ data }: { data: Split[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  return (
    <div>
      <div className="flex h-4 rounded-full overflow-hidden gap-[2px] bg-white">
        {data.map((d, i) => (
          <div
            key={d.label}
            title={`${d.label}: ${d.value} (${Math.round((d.value / total) * 100)}%)`}
            style={{
              width: `${(d.value / total) * 100}%`,
              backgroundColor: SPLIT_COLORS[i % SPLIT_COLORS.length],
            }}
            className="first:rounded-l-full last:rounded-r-full min-w-[6px]"
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2.5 text-forest-900">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: SPLIT_COLORS[i % SPLIT_COLORS.length] }}
                aria-hidden="true"
              />
              {d.label}
            </span>
            <span className="font-semibold text-forest-900 tabular-nums">
              {d.value}{' '}
              <span className="text-forest-900/45 font-normal">
                ({Math.round((d.value / total) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── KPI stat tile: a headline number, not a chart ── */

export function StatTile({
  label,
  value,
  hint,
  delta,
}: {
  label: string
  value: string
  hint?: string
  delta?: number | null
}) {
  return (
    <div className="bg-white rounded-2xl border border-forest-900/10 p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-forest-900/50 mb-2">
        {label}
      </p>
      <p className="font-serif text-3xl text-forest-900 tabular-nums leading-none">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 min-h-[1.1rem]">
        {typeof delta === 'number' && (
          <span
            className={
              delta >= 0
                ? 'text-emerald-700 text-xs font-semibold'
                : 'text-red-600 text-xs font-semibold'
            }
          >
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-forest-900/40 text-xs">{hint}</span>}
      </div>
    </div>
  )
}
