/**
 * Derived analytics over orders fetched from the database.
 * Computed client-side for now; swaps to SQL aggregates if volume demands it.
 */

import type { Order, OrderStatus } from '@/lib/domain'
import type { Product } from '@/lib/data'

/** Statuses that count as realised revenue. */
const REVENUE_STATUSES: OrderStatus[] = ['paid', 'shipped', 'delivered']

/** The mock dataset's "today" (newest order date). */
export function anchorDate(orders: Order[]): Date {
  return new Date(
    orders.reduce((max, o) => (o.createdAt > max ? o.createdAt : max), orders[0]?.createdAt ?? new Date().toISOString())
  )
}

const DAY_MS = 24 * 60 * 60 * 1000

export interface DayPoint {
  date: string // yyyy-mm-dd
  label: string // "14 Jun"
  revenuePaise: number
  orders: number
}

export function revenueByDay(orders: Order[], days = 30): DayPoint[] {
  const anchor = anchorDate(orders)
  const end = new Date(anchor)
  end.setHours(23, 59, 59, 999)

  const points: DayPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(end.getTime() - i * DAY_MS)
    const key = day.toISOString().slice(0, 10)
    points.push({
      date: key,
      label: day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenuePaise: 0,
      orders: 0,
    })
  }
  const index = new Map(points.map((p) => [p.date, p]))

  for (const order of orders) {
    if (!REVENUE_STATUSES.includes(order.status)) continue
    const key = order.createdAt.slice(0, 10)
    const point = index.get(key)
    if (point) {
      point.revenuePaise += order.totalPaise
      point.orders += 1
    }
  }
  return points
}

export interface Kpis {
  revenuePaise: number
  orders: number
  aovPaise: number
  pending: number
  deltaRevenuePct: number | null
}

export function kpis(orders: Order[], days = 30): Kpis {
  const anchor = anchorDate(orders).getTime()
  const windowStart = anchor - days * DAY_MS
  const prevStart = anchor - 2 * days * DAY_MS

  let revenue = 0
  let count = 0
  let prevRevenue = 0
  let pending = 0

  for (const order of orders) {
    const t = new Date(order.createdAt).getTime()
    if (order.status === 'pending') pending += 1
    if (!REVENUE_STATUSES.includes(order.status)) continue
    if (t > windowStart) {
      revenue += order.totalPaise
      count += 1
    } else if (t > prevStart) {
      prevRevenue += order.totalPaise
    }
  }

  return {
    revenuePaise: revenue,
    orders: count,
    aovPaise: count > 0 ? Math.round(revenue / count) : 0,
    pending,
    deltaRevenuePct:
      prevRevenue > 0
        ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100)
        : null,
  }
}

export interface ProductStat {
  productId: string
  name: string
  qty: number
  revenuePaise: number
}

export function topProducts(orders: Order[]): ProductStat[] {
  const byId = new Map<string, ProductStat>()
  for (const order of orders) {
    if (!REVENUE_STATUSES.includes(order.status)) continue
    for (const item of order.items) {
      const key = item.productId ?? item.name
      const existing = byId.get(key)
      if (existing) {
        existing.qty += item.qty
        existing.revenuePaise += item.lineTotalPaise
      } else {
        byId.set(key, {
          productId: key,
          name: item.name,
          qty: item.qty,
          revenuePaise: item.lineTotalPaise,
        })
      }
    }
  }
  return [...byId.values()].sort((a, b) => b.revenuePaise - a.revenuePaise)
}

export interface Split {
  label: string
  value: number
}

export function regionSplit(orders: Order[]): Split[] {
  let telangana = 0
  let rest = 0
  for (const order of orders) {
    if (!REVENUE_STATUSES.includes(order.status)) continue
    if (order.address.state === 'Telangana') telangana += 1
    else rest += 1
  }
  return [
    { label: 'Telangana', value: telangana },
    { label: 'Rest of India', value: rest },
  ]
}

export function categorySplit(orders: Order[], products: Product[]): Split[] {
  const categoryById = new Map(products.map((p) => [p.id, p.category]))
  const byCategory = new Map<string, number>()
  for (const order of orders) {
    if (!REVENUE_STATUSES.includes(order.status)) continue
    for (const item of order.items) {
      const category = (item.productId && categoryById.get(item.productId)) ?? 'Other'
      byCategory.set(category, (byCategory.get(category) ?? 0) + item.lineTotalPaise)
    }
  }
  return [...byCategory.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}
