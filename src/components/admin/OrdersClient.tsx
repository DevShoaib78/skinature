'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Download, MessageCircle, FileText } from 'lucide-react'
import { buildOrderWhatsAppUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { fetchAdminOrders } from '@/lib/db/admin'
import type { OrderStatus } from '@/lib/domain'
import { formatPaise, formatDate } from '@/lib/format'
import { toCsv, downloadCsv } from '@/lib/csv'
import { PageHeader, Card, OrderStatusBadge, AdminButton, adminInputClass } from '@/components/admin/ui'
import { useAsync, AdminLoading, AdminError } from '@/components/admin/useAsync'

const STATUS_FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function OrdersClient() {
  const { data: orders, error, loading, reload } = useAsync(fetchAdminOrders)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')

  const visible = useMemo(() => {
    if (!orders) return []
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false
      if (!q) return true
      return [o.orderNo, o.customer.name, o.customer.email, o.customer.phone, o.address.city]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [orders, query, status])

  const exportCsv = () => {
    const csv = toCsv(
      [
        'Order ID', 'Date', 'Customer', 'Email', 'Phone', 'City', 'State',
        'PIN', 'Items', 'Subtotal (₹)', 'Shipping (₹)', 'Total (₹)', 'Status',
        'Payment ID', 'Invoice No',
      ],
      visible.map((o) => [
        o.orderNo,
        formatDate(o.createdAt),
        o.customer.name,
        o.customer.email,
        o.customer.phone,
        o.address.city,
        o.address.state,
        o.address.pincode,
        o.items.map((i) => `${i.name} x ${i.qty}`).join('; '),
        (o.subtotalPaise / 100).toFixed(2),
        (o.shippingPaise / 100).toFixed(2),
        (o.totalPaise / 100).toFixed(2),
        o.status,
        o.paymentId ?? '',
        o.invoiceNo ?? '',
      ])
    )
    const today = new Date().toISOString().slice(0, 10)
    downloadCsv(`skinature-orders-${today}.csv`, csv)
  }

  if (loading) return <AdminLoading />
  if (error || !orders) return <AdminError message={error} onRetry={reload} />

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} orders in total. Live data.`}
        actions={
          <AdminButton onClick={exportCsv} variant="outline">
            <Download size={14} aria-hidden="true" />
            Export Excel (CSV)
          </AdminButton>
        }
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              aria-pressed={status === f.key}
              className={cn(
                'px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors flex-shrink-0',
                status === f.key
                  ? 'bg-forest-900 text-cream border-forest-900'
                  : 'bg-white text-forest-900/60 border-forest-900/15 hover:border-forest-900/50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-900/35 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, customer, city..."
            aria-label="Search orders"
            className={cn(adminInputClass, 'pl-10')}
          />
        </div>
      </div>

      <Card>
        {visible.length === 0 ? (
          <p className="text-forest-900/50 text-sm py-10 text-center">
            No orders match this filter.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
            <table className="w-full text-sm min-w-[840px]">
              <thead>
                <tr className="text-left text-forest-900/45 text-xs uppercase tracking-[0.1em] border-b border-forest-900/10">
                  <th className="py-3 pr-4 font-semibold">Order</th>
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Location</th>
                  <th className="py-3 pr-4 font-semibold">Date</th>
                  <th className="py-3 pr-4 font-semibold">Items</th>
                  <th className="py-3 pr-4 font-semibold">Total</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/6">
                {visible.map((order) => (
                  <tr key={order.id} className="hover:bg-forest-50/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <Link
                        href={`/admin/orders/${order.orderNo}`}
                        className="font-semibold text-forest-900 hover:text-gold-600 transition-colors"
                      >
                        {order.orderNo}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-forest-900/85">{order.customer.name}</p>
                      <p className="text-forest-900/40 text-xs">{order.customer.phone}</p>
                    </td>
                    <td className="py-3.5 pr-4 text-forest-900/60 whitespace-nowrap">
                      {order.address.city}, {order.address.state === 'Telangana' ? 'TG' : order.address.state}
                    </td>
                    <td className="py-3.5 pr-4 text-forest-900/55 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 pr-4 text-forest-900/60 tabular-nums">
                      {order.items.reduce((n, i) => n + i.qty, 0)}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-forest-900 tabular-nums">
                      {formatPaise(order.totalPaise)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={buildOrderWhatsAppUrl(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Send WhatsApp update to ${order.customer.name}`}
                          title="Send WhatsApp update"
                          className="p-2 rounded-lg text-forest-900/40 hover:text-[#25D366] hover:bg-forest-50 transition-colors"
                        >
                          <MessageCircle size={16} strokeWidth={2} />
                        </a>
                        <Link
                          href={`/admin/orders/${order.orderNo}/invoice`}
                          aria-label={`Invoice for ${order.orderNo}`}
                          title="View / download invoice"
                          className="p-2 rounded-lg text-forest-900/40 hover:text-forest-900 hover:bg-forest-50 transition-colors"
                        >
                          <FileText size={16} strokeWidth={2} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
