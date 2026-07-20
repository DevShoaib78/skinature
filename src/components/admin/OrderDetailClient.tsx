'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Truck,
  PackageCheck,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Send,
  RotateCcw,
} from 'lucide-react'
import {
  fetchAdminOrderByNo,
  updateOrderStatus,
  fetchInvitesForOrder,
  sendInviteEmailNow,
  restartInviteTimer,
} from '@/lib/db/admin'
import type { OrderStatus, ReviewInvite } from '@/lib/domain'
import { buildOrderWhatsAppUrl } from '@/lib/whatsapp'
import { formatPaise, formatDate } from '@/lib/format'
import {
  Card,
  OrderStatusBadge,
  AdminField,
  AdminButton,
  adminInputClass,
} from '@/components/admin/ui'
import { useAsync, AdminLoading, AdminError } from '@/components/admin/useAsync'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

/** The natural next step in fulfilment, for the one-click action. */
const NEXT_STEP: Partial<
  Record<OrderStatus, { to: OrderStatus; label: string; icon: typeof Truck }>
> = {
  paid: { to: 'shipped', label: 'Mark as Shipped', icon: Truck },
  shipped: { to: 'delivered', label: 'Mark as Delivered', icon: PackageCheck },
}

function InviteRow({ invite }: { invite: ReviewInvite }) {
  const [sentAt, setSentAt] = useState(invite.sentAt)
  const [sendAfter, setSendAfter] = useState(invite.sendAfter)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState<'send' | 'restart' | null>(null)
  const [note, setNote] = useState('')

  const used = !!invite.usedAt

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/review/${invite.token}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable in this context; nothing else to do.
    }
  }

  const sendNow = async () => {
    setBusy('send')
    setNote('')
    try {
      const r = await sendInviteEmailNow(invite.id)
      if (r.ok) {
        setSentAt(r.sentAt ?? new Date().toISOString())
        setNote('Email sent. The 21-day auto-send is now off.')
      } else if (r.reason === 'email-not-configured') {
        setNote('Email is not set up yet. Use Copy link to share via WhatsApp.')
      } else {
        setNote('Could not send the email.')
      }
    } catch (e) {
      setNote((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const restart = async () => {
    setBusy('restart')
    setNote('')
    try {
      const next = await restartInviteTimer(invite.id)
      setSentAt(null)
      setSendAfter(next)
      setNote('21-day timer restarted.')
    } catch (e) {
      setNote((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const status = used
    ? `Review submitted ${formatDate(invite.usedAt as string)}`
    : sentAt
      ? `Emailed ${formatDate(sentAt)}, auto-send off`
      : `Auto-sends ${formatDate(sendAfter)}`

  return (
    <li className="py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-forest-900 text-sm font-medium truncate">{invite.productName}</p>
          <p className="text-forest-900/45 text-xs mt-0.5">{status}</p>
        </div>
        {used && (
          <span className="inline-flex items-center gap-1.5 text-forest-700 text-[0.65rem] uppercase tracking-[0.08em] font-semibold flex-shrink-0">
            <CheckCircle2 size={13} aria-hidden="true" />
            Used
          </span>
        )}
      </div>

      {!used && (
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <button
            onClick={sendNow}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-900 text-cream rounded-lg text-[0.65rem] font-semibold uppercase tracking-[0.08em] hover:bg-forest-800 transition-colors disabled:opacity-60"
          >
            <Send size={12} aria-hidden="true" />
            {busy === 'send' ? 'Sending...' : sentAt ? 'Resend email' : 'Send email now'}
          </button>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-forest-900/15 bg-white rounded-lg text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-forest-900/70 hover:border-forest-900 hover:text-forest-900 transition-colors"
          >
            {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
          {sentAt && (
            <button
              onClick={restart}
              disabled={busy !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-forest-900/15 bg-white rounded-lg text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-forest-900/70 hover:border-forest-900 hover:text-forest-900 transition-colors disabled:opacity-60"
            >
              <RotateCcw size={12} aria-hidden="true" />
              {busy === 'restart' ? 'Restarting...' : 'Restart timer'}
            </button>
          )}
        </div>
      )}

      {note && <p className="text-forest-900/55 text-xs mt-2">{note}</p>}
    </li>
  )
}

export default function OrderDetailClient({ orderId: orderNo }: { orderId: string }) {
  const fetchOrder = useCallback(() => fetchAdminOrderByNo(orderNo), [orderNo])
  const { data: order, error, loading, reload, setData } = useAsync(fetchOrder)
  const [savingStatus, setSavingStatus] = useState(false)

  const invitesFetch = useCallback(
    async () => (order ? fetchInvitesForOrder(order.id) : []),
    [order]
  )
  const { data: invites } = useAsync(invitesFetch)

  if (loading) return <AdminLoading />
  if (error) return <AdminError message={error} onRetry={reload} />

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-3xl text-forest-900 mb-3">Order not found</p>
        <p className="text-forest-900/55 text-sm mb-8">
          No order with ID {orderNo} exists.
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

  const setStatus = async (status: OrderStatus) => {
    setSavingStatus(true)
    const previous = order
    setData({ ...order, status })
    try {
      await updateOrderStatus(order.id, status)
    } catch {
      setData(previous)
    } finally {
      setSavingStatus(false)
    }
  }

  const paid = order.status !== 'pending' && order.status !== 'cancelled'
  const next = NEXT_STEP[order.status]

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
              {order.orderNo}
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
              href={`/admin/orders/${order.orderNo}/invoice`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-forest-900/20 bg-white text-forest-900 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] hover:border-forest-900 transition-colors"
            >
              <FileText size={15} aria-hidden="true" />
              View Invoice
            </Link>
            <a
              href={`/api/admin/invoice/${order.orderNo}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-forest-900/20 bg-white text-forest-900 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] hover:border-forest-900 transition-colors"
            >
              <Download size={15} aria-hidden="true" />
              Download PDF
            </a>
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
              {order.items.map((item, i) => (
                <li key={`${item.productId}-${i}`} className="py-3.5 flex items-center justify-between gap-4">
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
                  {paid ? 'Prepaid' : order.status === 'pending' ? 'Awaiting payment' : 'Not charged'}
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

          {/* Review links (magic-link flow) */}
          {paid && invites && invites.length > 0 && (
            <Card title="Review Links">
              <ul className="divide-y divide-forest-900/6">
                {invites.map((invite) => (
                  <InviteRow key={invite.id} invite={invite} />
                ))}
              </ul>
              <p className="text-forest-900/40 text-xs mt-4 leading-relaxed">
                Each link lets this customer review that product without logging in.
                It auto-emails 21 days after the order (once email is live). Send it now
                to email immediately (this turns off the auto-send), copy it to share via
                WhatsApp, or restart the 21-day timer.
              </p>
            </Card>
          )}
        </div>

        {/* Customer + status */}
        <div className="space-y-6">
          <Card title="Fulfilment">
            {next ? (
              <AdminButton
                onClick={() => setStatus(next.to)}
                disabled={savingStatus}
                className="w-full mb-4 py-3.5"
              >
                <next.icon size={16} aria-hidden="true" />
                {next.label}
              </AdminButton>
            ) : order.status === 'delivered' ? (
              <p className="flex items-center justify-center gap-2 w-full mb-4 py-3 rounded-xl bg-forest-50 border border-forest-100 text-forest-800 text-xs font-semibold uppercase tracking-[0.1em]">
                <CheckCircle2 size={15} aria-hidden="true" />
                Delivered
              </p>
            ) : null}

            <AdminField label="Or set status manually">
              <select
                value={order.status}
                disabled={savingStatus}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
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
              Changes save to the live database instantly.
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
