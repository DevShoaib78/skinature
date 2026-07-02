'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchAdminOrders } from '@/lib/db/admin'
import { revenueByDay, kpis, topProducts, regionSplit } from '@/lib/admin-metrics'
import { formatPaise, formatDate } from '@/lib/format'
import { PageHeader, Card, OrderStatusBadge } from '@/components/admin/ui'
import { RevenueLineChart, HBarList, SplitBar, StatTile } from '@/components/admin/charts'
import { useAsync, AdminLoading, AdminError } from '@/components/admin/useAsync'

export default function DashboardClient() {
  const { data: orders, error, loading, reload } = useAsync(fetchAdminOrders)

  const days = useMemo(() => (orders ? revenueByDay(orders, 30) : []), [orders])
  const stats = useMemo(() => (orders ? kpis(orders, 30) : null), [orders])
  const top = useMemo(() => (orders ? topProducts(orders).slice(0, 5) : []), [orders])
  const regions = useMemo(() => (orders ? regionSplit(orders) : []), [orders])
  const recent = orders?.slice(0, 6) ?? []

  if (loading) return <AdminLoading />
  if (error || !orders || !stats) return <AdminError message={error} onRetry={reload} />

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Store performance over the last 30 days. Live data."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatTile
          label="Revenue (30d)"
          value={formatPaise(stats.revenuePaise)}
          delta={stats.deltaRevenuePct}
          hint="vs previous 30 days"
        />
        <StatTile label="Orders (30d)" value={String(stats.orders)} />
        <StatTile label="Avg Order Value" value={formatPaise(stats.aovPaise)} />
        <StatTile
          label="Pending Orders"
          value={String(stats.pending)}
          hint={stats.pending > 0 ? 'awaiting payment' : 'all clear'}
        />
      </div>

      {/* Revenue chart */}
      <Card title="Revenue · Last 30 Days" className="mb-6">
        <RevenueLineChart data={days} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card title="Top Products by Revenue">
          <HBarList
            items={top.map((p) => ({
              label: p.name,
              value: p.revenuePaise,
              display: formatPaise(p.revenuePaise),
            }))}
          />
        </Card>

        <Card title="Orders by Region">
          <SplitBar data={regions} />
          <p className="text-forest-900/40 text-xs mt-5">
            Shipping: ₹60 within Telangana, ₹100 rest of India.
          </p>
        </Card>
      </div>

      {/* Recent orders */}
      <Card
        title="Recent Orders"
        actions={
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-forest-900/60 hover:text-forest-900 transition-colors"
          >
            View All
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        }
      >
        <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-forest-900/45 text-xs uppercase tracking-[0.1em] border-b border-forest-900/10">
                <th className="py-3 pr-4 font-semibold">Order</th>
                <th className="py-3 pr-4 font-semibold">Customer</th>
                <th className="py-3 pr-4 font-semibold">Date</th>
                <th className="py-3 pr-4 font-semibold">Total</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {recent.map((order) => (
                <tr key={order.id} className="hover:bg-forest-50/50 transition-colors">
                  <td className="py-3.5 pr-4">
                    <Link
                      href={`/admin/orders/${order.orderNo}`}
                      className="font-semibold text-forest-900 hover:text-gold-600 transition-colors"
                    >
                      {order.orderNo}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 text-forest-900/75">
                    {order.customer.name}
                  </td>
                  <td className="py-3.5 pr-4 text-forest-900/55 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-forest-900 tabular-nums">
                    {formatPaise(order.totalPaise)}
                  </td>
                  <td className="py-3.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
