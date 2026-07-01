'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Printer } from 'lucide-react'
import { useAdmin } from '@/store/admin'
import { getOrderById } from '@/lib/mock/orders'
import { formatPaise, formatDate } from '@/lib/format'
import { AdminButton } from '@/components/admin/ui'

/**
 * Printable invoice view. At launch this same layout renders to PDF
 * (react-pdf) and is emailed to the customer + stored in Supabase Storage.
 */
export default function InvoiceClient({ orderId }: { orderId: string }) {
  const orderStatus = useAdmin((s) => s.orderStatus)
  const settings = useAdmin((s) => s.settings)

  const order = useMemo(() => {
    const base = getOrderById(orderId)
    if (!base) return undefined
    return orderStatus[orderId] ? { ...base, status: orderStatus[orderId] } : base
  }, [orderId, orderStatus])

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-3xl text-forest-900 mb-6">Order not found</p>
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

  return (
    <>
      {/* Toolbar (hidden in print) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href={`/admin/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-forest-900/50 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Back to Order
        </Link>
        <AdminButton onClick={() => window.print()}>
          <Printer size={14} aria-hidden="true" />
          Print / Save as PDF
        </AdminButton>
      </div>

      {/* Invoice sheet */}
      <div className="bg-white rounded-2xl border border-forest-900/10 p-8 md:p-12 max-w-3xl print:border-0 print:rounded-none print:p-0 print:max-w-none">
        {/* Head */}
        <div className="flex items-start justify-between gap-6 pb-8 border-b border-forest-900/10">
          <div>
            <Image
              src="/logo-nobg.webp"
              alt="Skinature"
              width={150}
              height={50}
              className="h-auto mb-3"
            />
            <p className="text-forest-900/60 text-sm leading-relaxed">
              {settings.businessName}
              <br />
              {settings.businessAddress}
              {settings.gstin && (
                <>
                  <br />
                  GSTIN: {settings.gstin}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl text-forest-900 mb-2">Invoice</p>
            <p className="text-forest-900/60 text-sm">
              {order.invoiceNo ?? 'Draft (unpaid)'}
              <br />
              {formatDate(order.createdAt)}
              <br />
              Order {order.id}
            </p>
          </div>
        </div>

        {/* Bill to */}
        <div className="grid grid-cols-2 gap-6 py-8 border-b border-forest-900/10">
          <div>
            <p className="text-forest-900/45 text-xs uppercase tracking-[0.15em] font-semibold mb-2">
              Billed To
            </p>
            <p className="text-forest-900 text-sm leading-relaxed">
              {order.customer.name}
              <br />
              {order.customer.email}
              <br />
              +91 {order.customer.phone}
            </p>
          </div>
          <div>
            <p className="text-forest-900/45 text-xs uppercase tracking-[0.15em] font-semibold mb-2">
              Shipped To
            </p>
            <p className="text-forest-900 text-sm leading-relaxed">
              {order.address.line1}
              {order.address.line2 && (
                <>
                  <br />
                  {order.address.line2}
                </>
              )}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-sm my-8">
          <thead>
            <tr className="text-left text-forest-900/45 text-xs uppercase tracking-[0.1em] border-b border-forest-900/10">
              <th className="py-3 pr-4 font-semibold">Item</th>
              <th className="py-3 pr-4 font-semibold text-right">Unit Price</th>
              <th className="py-3 pr-4 font-semibold text-right">Qty</th>
              <th className="py-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/6">
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td className="py-3.5 pr-4 text-forest-900">{item.name}</td>
                <td className="py-3.5 pr-4 text-right text-forest-900/70 tabular-nums">
                  {formatPaise(item.unitPricePaise)}
                </td>
                <td className="py-3.5 pr-4 text-right text-forest-900/70 tabular-nums">
                  {item.qty}
                </td>
                <td className="py-3.5 text-right font-medium text-forest-900 tabular-nums">
                  {formatPaise(item.lineTotalPaise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end border-t border-forest-900/10 pt-6">
          <dl className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-forest-900/55">Subtotal</dt>
              <dd className="text-forest-900 font-medium tabular-nums">
                {formatPaise(order.subtotalPaise)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-forest-900/55">Shipping</dt>
              <dd className="text-forest-900 font-medium tabular-nums">
                {formatPaise(order.shippingPaise)}
              </dd>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-forest-900/10">
              <dt className="text-forest-900 font-semibold">Total</dt>
              <dd className="font-serif text-2xl text-forest-900 tabular-nums">
                {formatPaise(order.totalPaise)}
              </dd>
            </div>
            {order.paymentId && (
              <div className="flex justify-between pt-2">
                <dt className="text-forest-900/45 text-xs">Payment ID</dt>
                <dd className="text-forest-900/60 text-xs">{order.paymentId}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Foot */}
        <p className="text-center text-forest-900/45 text-xs mt-12 pt-6 border-t border-forest-900/10 leading-relaxed">
          Thank you for choosing Skinature. Nurtured by Nature.
          <br />
          This is a computer-generated invoice and does not require a signature.
        </p>
      </div>
    </>
  )
}
