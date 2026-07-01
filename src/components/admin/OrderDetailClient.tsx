'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, FileText, Mail, Phone, MapPin } from 'lucide-react'
import { useAdmin } from '@/store/admin'
import { getOrderById, type OrderStatus } from '@/lib/mock/orders'
import { buildOrderWhatsAppUrl } from '@/lib/whatsapp'
import { formatPaise, formatDate } from '@/lib/format'
import { Card, OrderStatusBadge, AdminField, adminInputClass } from '@/components/admin/ui'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const orderStatus = useAdmin((s) => s.orderStatus)
  const setOrderStatus = useAdmin((s) => s.setOrderStatus)

  const order = useMemo(() => {
    const base = getOrderById(orderId)
    if (!base) return undefined
    return orderStatus[orderId] ? { ...base, status: orderStatus[orderId] } : base
  }, [orderId, orderStatus])

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-3xl text-forest-900 mb-3">Order not found</p>
        <p className="text-forest-900/55 text-sm mb-8">
          No order with ID {orderId} exists.
        </p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900 hover:text-gold-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Orders
        </Link>
      </div>
    )
  }

  const paid = order.status !== 'pending' && order.status !== 'cancelled'

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-forest-900/50 hover:text-forest-900 transition-colors mb-4"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-3xl md:text-4xl text-forest-900">
              {order.id}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={buildOrderWhatsAppUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-semibold uppercase tracking-[0.1em] hover:brightness-95 transition-all"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Send WhatsApp
            </a>
            <Link
              href={`/admin/orders/${order.id}/invoice`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-forest-900/20 bg-white text-forest-900 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] hover:border-forest-900 transition-colors"
            >
              <FileText size={15} aria-hidden="true" />
              View Invoice
            </Link>
          </div>
        </div>
        <p className="text-forest-900/45 text-sm mt-2">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Items + totals */}
        <div className="xl:col-span-2 space-y-6">
          <Card title="Items">
            <ul className="divide-y divide-forest-900/6">
              {order.items.map((item) => (
                <li key={item.productId} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-forest-900 font-medium text-sm">{item.name}</p>
                    <p className="text-forest-900/45 text-xs mt-0.5">
                      {formatPaise(item.unitPricePaise)} × {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-forest-900 tabular-nums text-sm">
                    {formatPaise(item.lineTotalPaise)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="border-t border-forest-900/10 mt-2 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-forest-900/55">Subtotal</dt>
                <dd className="text-forest-900 font-medium tabular-nums">
                  {formatPaise(order.subtotalPaise)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-forest-900/55">
                  Shipping ({order.address.state === 'Telangana' ? 'Telangana' : 'Rest of India'})
                </dt>
                <dd className="text-forest-900 font-medium tabular-nums">
                  {formatPaise(order.shippingPaise)}
                </dd>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-forest-900/10">
                <dt className="text-forest-900 font-semibold">Total</dt>
                <dd className="font-serif text-2xl text-forest-900">
                  {formatPaise(order.totalPaise)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Payment">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-forest-900/45 text-xs uppercase tracking-[0.1em] mb-1">
                  Method
                </dt>
                <dd className="text-forest-900 font-medium">
                  {paid ? 'Prepaid (Razorpay)' : order.status === 'pending' ? 'Awaiting payment' : 'Not charged'}
                </dd>
              </div>
              <div>
                <dt className="text-forest-900/45 text-xs uppercase tracking-[0.1em] mb-1">
                  Payment ID
                </dt>
                <dd className="text-forest-900 font-medium break-all">
                  {order.paymentId ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-forest-900/45 text-xs uppercase tracking-[0.1em] mb-1">
                  Invoice No
                </dt>
                <dd className="text-forest-900 font-medium">{order.invoiceNo ?? '—'}</dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Customer + status */}
        <div className="space-y-6">
          <Card title="Update Status">
            <AdminField label="Order status">
              <select
                value={order.status}
                onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}
                className={adminInputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </AdminField>
            <p className="text-forest-900/40 text-xs mt-3 leading-relaxed">
              Status changes are saved instantly. At launch this also triggers
              customer notifications.
            </p>
          </Card>

          <Card title="Customer">
            <p className="font-serif text-xl text-forest-900 mb-4">
              {order.customer.name}
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-forest-900/70">
                <Mail size={14} className="text-gold-600 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${order.customer.email}`}
                  className="hover:text-forest-900 transition-colors break-all"
                >
                  {order.customer.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-forest-900/70">
                <Phone size={14} className="text-gold-600 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:+91${order.customer.phone}`}
                  className="hover:text-forest-900 transition-colors"
                >
                  +91 {order.customer.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-forest-900/70">
                <MapPin size={14} className="text-gold-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">
                  {order.address.line1}
                  {order.address.line2 && (
                    <>
                      <br />
                      {order.address.line2}
                    </>
                  )}
                  <br />
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
