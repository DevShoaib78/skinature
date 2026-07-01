'use client'

import { useMemo } from 'react'
import { useAdmin } from '@/store/admin'
import {
  effectiveOrders,
  revenueByDay,
  kpis,
  topProducts,
  categorySplit,
  regionSplit,
} from '@/lib/admin-metrics'
import { getMockCustomers } from '@/lib/mock/orders'
import { formatPaise } from '@/lib/format'
import { PageHeader, Card } from '@/components/admin/ui'
import { RevenueLineChart, HBarList, SplitBar, StatTile } from '@/components/admin/charts'

export default function AnalyticsClient() {
  const orderStatus = useAdmin((s) => s.orderStatus)

  const orders = useMemo(() => effectiveOrders(orderStatus), [orderStatus])
  const days = useMemo(() => revenueByDay(orders, 56), [orders])
  const stats = useMemo(() => kpis(orders, 30), [orders])
  const top = useMemo(() => topProducts(orders), [orders])
  const categories = useMemo(() => categorySplit(orders), [orders])
  const regions = useMemo(() => regionSplit(orders), [orders])

  const customers = useMemo(() => getMockCustomers(), [])
  const repeatRate = Math.round(
    (customers.filter((c) => c.ordersCount > 1).length / Math.max(customers.length, 1)) * 100
  )
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1)
    return ['delivered', 'shipped', 'paid', 'pending', 'cancelled']
      .filter((s) => counts.has(s))
      .map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: counts.get(s) ?? 0,
        display: String(counts.get(s) ?? 0),
      }))
  }, [orders])

  return (
    <>
      <PageHeader
        title="Analytics"
        description="A deeper look at how the store is performing."
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatTile
          label="Revenue (30d)"
          value={formatPaise(stats.revenuePaise)}
          delta={stats.deltaRevenuePct}
          hint="vs previous 30 days"
        />
        <StatTile label="Avg Order Value" value={formatPaise(stats.aovPaise)} />
        <StatTile label="Customers" value={String(customers.length)} />
        <StatTile
          label="Repeat Rate"
          value={`${repeatRate}%`}
          hint="ordered more than once"
        />
      </div>

      <Card title="Revenue · Last 8 Weeks" className="mb-6">
        <RevenueLineChart data={days} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Revenue by Product">
          <HBarList
            items={top.map((p) => ({
              label: p.name,
              value: p.revenuePaise,
              display: formatPaise(p.revenuePaise),
            }))}
          />
        </Card>

        <div className="space-y-6">
          <Card title="Revenue by Category">
            <HBarList
              items={categories.map((c) => ({
                label: c.label,
                value: c.value,
                display: formatPaise(c.value),
              }))}
            />
          </Card>

          <Card title="Orders by Region">
            <SplitBar data={regions} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <Card title="Orders by Status">
          <HBarList items={statusCounts} />
        </Card>

        <Card title="Top Customers">
          <ul className="divide-y divide-forest-900/6">
            {customers.slice(0, 5).map((c) => (
              <li key={c.email} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-forest-900 font-medium text-sm">{c.name}</p>
                  <p className="text-forest-900/45 text-xs">
                    {c.city} · {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                  </p>
                </div>
                <p className="font-semibold text-forest-900 tabular-nums text-sm">
                  {formatPaise(c.totalSpendPaise)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
