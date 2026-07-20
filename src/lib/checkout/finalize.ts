import { getSupabaseService } from '@/lib/supabase/server'
import { emailEnabled, sendOrderEmails } from '@/lib/email/send'
import { renderInvoiceBuffer } from '@/lib/pdf/render'
import { rowToOrder, rowToSettings, ORDER_SELECT } from '@/lib/db/mappers'
import type { OrderRow, SettingsRow } from '@/lib/db/mappers'

/**
 * Marks a pending order paid and runs every post-payment side effect exactly once:
 * the atomic status transition, stock decrement, 21-day review invites, and the
 * confirmation email + PDF invoice. Shared by the mock confirm route, the Razorpay
 * signature-verify route, and the Razorpay webhook so all three land identical state.
 *
 * Idempotent: the paid transition is guarded by `status = 'pending'`, so whichever
 * caller wins runs the side effects and any later caller (a webhook racing the
 * browser verify, a retry) returns the same snapshot with `alreadyPaid: true` and
 * touches nothing. The invoice number is derived from the order number, so every
 * caller computes the same value.
 */

const REVIEW_INVITE_DELAY_DAYS = 21

export interface OrderSnapshot {
  /** Business order number, e.g. "SKN-1101" (used by the success page + as `order.id`). */
  id: string
  createdAt: string
  customer: { name: string; email: string; phone: string }
  address: { line1: string; line2?: string; city: string; state: string; pincode: string }
  items: { productId: string; name: string; image: string; qty: number; unitPricePaise: number }[]
  subtotalPaise: number
  shippingPaise: number
  totalPaise: number
  invoiceNo: string
}

export type FinalizeResult =
  | { ok: true; alreadyPaid: boolean; order: OrderSnapshot }
  | { ok: false; status: number; error: string }

type ItemRow = {
  product_id: string | null
  name_snapshot: string
  qty: number
  unit_price_paise: number
}
type CustomerJoin = { email: string; full_name: string; phone: string } | null

export async function finalizePaidOrder(params: {
  orderId: string
  provider: 'mock' | 'razorpay'
  paymentId?: string | null
  signature?: string | null
}): Promise<FinalizeResult> {
  const { orderId, provider, paymentId, signature } = params
  const db = getSupabaseService()

  const { data: order, error: orderError } = await db
    .from('orders')
    .select(
      'id, order_no, status, subtotal_paise, shipping_paise, total_paise, ship_name, ship_line1, ship_line2, ship_city, ship_state, ship_pincode, created_at, customers ( email, full_name, phone ), order_items ( product_id, name_snapshot, qty, unit_price_paise )'
    )
    .eq('id', orderId)
    .maybeSingle()

  if (orderError || !order) return { ok: false, status: 404, error: 'Order not found.' }

  const invoiceNo = `INV-2026-${order.order_no.replace('SKN-', '')}`
  const items = (order.order_items ?? []) as ItemRow[]
  const customer = order.customers as unknown as CustomerJoin

  // Product images for the confirmation snapshot (also gives us stock for the decrement).
  const productIds = [...new Set(items.map((i) => i.product_id).filter(Boolean))] as string[]
  const { data: productRows } = await db
    .from('products')
    .select('id, stock, image')
    .in('id', productIds)
  const productInfo = new Map((productRows ?? []).map((p) => [p.id, p]))

  const snapshot: OrderSnapshot = {
    id: order.order_no,
    createdAt: order.created_at,
    customer: {
      name: customer?.full_name ?? order.ship_name,
      email: customer?.email ?? '',
      phone: customer?.phone ?? '',
    },
    address: {
      line1: order.ship_line1,
      line2: order.ship_line2 ?? undefined,
      city: order.ship_city,
      state: order.ship_state,
      pincode: order.ship_pincode,
    },
    items: items.map((it) => ({
      productId: it.product_id ?? '',
      name: it.name_snapshot,
      image: (it.product_id && productInfo.get(it.product_id)?.image) || '',
      qty: it.qty,
      unitPricePaise: it.unit_price_paise,
    })),
    subtotalPaise: order.subtotal_paise,
    shippingPaise: order.shipping_paise,
    totalPaise: order.total_paise,
    invoiceNo,
  }

  // Already finalized (a webhook after browser verify, a retry, etc.) → no side effects.
  if (order.status !== 'pending') {
    if (order.status === 'cancelled') {
      return { ok: false, status: 409, error: 'Order is not awaiting payment.' }
    }
    return { ok: true, alreadyPaid: true, order: snapshot }
  }

  // ── atomic paid transition (only one caller wins the pending → paid flip) ──
  const resolvedPaymentId =
    paymentId ?? (provider === 'mock' ? `pay_mock_${order.order_no.replace('SKN-', '')}` : null)

  const { data: transitioned, error: updateError } = await db
    .from('orders')
    .update({
      status: 'paid',
      payment_provider: provider,
      payment_id: resolvedPaymentId,
      razorpay_signature: signature ?? null,
      invoice_no: invoiceNo,
    })
    .eq('id', order.id)
    .eq('status', 'pending')
    .select('id')

  if (updateError) return { ok: false, status: 500, error: 'Could not update order.' }

  // Lost the race: another caller already finalized. Return the same snapshot, no side effects.
  if (!transitioned || transitioned.length === 0) {
    return { ok: true, alreadyPaid: true, order: snapshot }
  }

  // ── decrement stock ──
  for (const item of items) {
    if (!item.product_id) continue
    const info = productInfo.get(item.product_id)
    if (info) {
      await db
        .from('products')
        .update({ stock: Math.max(0, info.stock - item.qty) })
        .eq('id', item.product_id)
    }
  }

  // ── review invites (auto-sent by scheduler 21 days after order, per DECISIONS §6.7) ──
  if (productIds.length > 0) {
    const sendAfter = new Date(Date.now() + REVIEW_INVITE_DELAY_DAYS * 24 * 60 * 60 * 1000)
    await db.from('review_invites').insert(
      productIds.map((productId) => ({
        order_id: order.id,
        product_id: productId,
        send_after: sendAfter.toISOString(),
      }))
    )
  }

  // ── confirmation email + PDF invoice (graceful no-op until Resend is configured) ──
  // Never let email/PDF failures fail a paid order.
  if (emailEnabled()) {
    try {
      const [{ data: fullOrder }, { data: settingsRow }] = await Promise.all([
        db.from('orders').select(ORDER_SELECT).eq('id', order.id).single(),
        db.from('site_settings').select('*').single(),
      ])
      if (fullOrder && settingsRow) {
        const domainOrder = rowToOrder(fullOrder as unknown as OrderRow)
        const settings = rowToSettings(settingsRow as SettingsRow)
        const pdf = await renderInvoiceBuffer(domainOrder, settings)
        await sendOrderEmails(domainOrder, settings, pdf)
      }
    } catch (err) {
      console.error('[finalize] order email failed:', err)
    }
  }

  return { ok: true, alreadyPaid: false, order: snapshot }
}
