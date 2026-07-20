'use client'

/**
 * Admin data access. Runs in the browser with the authenticated admin's
 * session; every operation is enforced by RLS (is_admin()).
 */

import { getSupabaseBrowser } from '@/lib/supabase/client'
import type { Product } from '@/lib/data'
import type {
  Order,
  OrderStatus,
  Review,
  ReviewStatus,
  ReviewInvite,
  CustomerSummary,
  StoreSettings,
} from '@/lib/domain'
import {
  rowToProduct,
  rowToReview,
  rowToOrder,
  rowToSettings,
  rowToInvite,
  productPatchToRow,
  ORDER_SELECT,
  type ProductRow,
  type ReviewRow,
  type OrderRow,
  type SettingsRow,
  type InviteRow,
} from '@/lib/db/mappers'

function db() {
  return getSupabaseBrowser()
}

/* ── Orders ── */

export async function fetchAdminOrders(): Promise<Order[]> {
  const { data, error } = await db()
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as OrderRow[]).map(rowToOrder)
}

export async function fetchAdminOrderByNo(orderNo: string): Promise<Order | null> {
  const { data, error } = await db()
    .from('orders')
    .select(ORDER_SELECT)
    .eq('order_no', orderNo)
    .maybeSingle()
  if (error) throw error
  return data ? rowToOrder(data as unknown as OrderRow) : null
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await db().from('orders').update({ status }).eq('id', orderId)
  if (error) throw error
}

/* ── Products ── */

export async function fetchAdminProducts(): Promise<Product[]> {
  const { data, error } = await db().from('products').select('*').order('sort_order')
  if (error) throw error
  return (data as ProductRow[]).map(rowToProduct)
}

export async function updateAdminProduct(id: string, patch: Partial<Product>): Promise<void> {
  const { error } = await db().from('products').update(productPatchToRow(patch)).eq('id', id)
  if (error) throw error
}

export async function insertAdminProduct(product: Omit<Product, 'id'>): Promise<void> {
  const { error } = await db().from('products').insert(productPatchToRow(product))
  if (error) throw error
}

export async function adjustAdminStock(id: string, currentStock: number, delta: number): Promise<void> {
  const next = Math.max(0, currentStock + delta)
  const { error } = await db().from('products').update({ stock: next }).eq('id', id)
  if (error) throw error
}

/* ── Reviews ── */

export async function fetchAdminReviews(): Promise<{ reviews: Review[]; productNames: Record<string, string> }> {
  const [reviewsRes, productsRes] = await Promise.all([
    db().from('reviews').select('*').order('created_at', { ascending: false }),
    db().from('products').select('id, name'),
  ])
  if (reviewsRes.error) throw reviewsRes.error
  if (productsRes.error) throw productsRes.error
  const productNames: Record<string, string> = {}
  for (const p of productsRes.data as { id: string; name: string }[]) {
    productNames[p.id] = p.name
  }
  return {
    reviews: (reviewsRes.data as ReviewRow[]).map(rowToReview),
    productNames,
  }
}

export async function setAdminReviewStatus(reviewId: string, status: ReviewStatus): Promise<void> {
  const { error } = await db().from('reviews').update({ status }).eq('id', reviewId)
  if (error) throw error
}

/* ── Review invites ── */

export async function fetchInvitesForOrder(orderId: string): Promise<ReviewInvite[]> {
  const { data, error } = await db()
    .from('review_invites')
    .select('id, order_id, product_id, token, send_after, sent_at, used_at, products ( name )')
    .eq('order_id', orderId)
  if (error) throw error
  return (data as unknown as InviteRow[]).map(rowToInvite)
}

export async function markInviteSent(inviteId: string): Promise<void> {
  const { error } = await db()
    .from('review_invites')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', inviteId)
  if (error) throw error
}

const REVIEW_INVITE_DELAY_DAYS = 21

/**
 * Emails the review magic link to the customer now (server-side, via Resend).
 * Returns `{ ok: false, reason: 'email-not-configured' }` when Resend is not set up
 * yet — in which case the invite is NOT marked sent and the admin should Copy link.
 */
export async function sendInviteEmailNow(
  inviteId: string
): Promise<{ ok: boolean; reason?: string; sentAt?: string }> {
  const res = await fetch(`/api/admin/review-invites/${inviteId}/send`, { method: 'POST' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Could not send the review email.')
  return data
}

/**
 * Re-arms the 21-day auto-send for an invite: clears `sent_at` and pushes
 * `send_after` to 21 days from now (keeping the same magic-link token).
 * Returns the new `send_after` timestamp.
 */
export async function restartInviteTimer(inviteId: string): Promise<string> {
  const sendAfter = new Date(
    Date.now() + REVIEW_INVITE_DELAY_DAYS * 24 * 60 * 60 * 1000
  ).toISOString()
  const { error } = await db()
    .from('review_invites')
    .update({ sent_at: null, send_after: sendAfter })
    .eq('id', inviteId)
  if (error) throw error
  return sendAfter
}

/* ── Settings ── */

export async function fetchAdminSettings(): Promise<StoreSettings> {
  const { data, error } = await db().from('site_settings').select('*').single()
  if (error) throw error
  return rowToSettings(data as SettingsRow)
}

export async function updateAdminSettings(patch: Partial<StoreSettings>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (patch.shippingTelanganaPaise !== undefined) row.shipping_telangana_paise = patch.shippingTelanganaPaise
  if (patch.shippingRestPaise !== undefined) row.shipping_rest_paise = patch.shippingRestPaise
  if (patch.businessName !== undefined) row.business_name = patch.businessName
  if (patch.businessAddress !== undefined) row.business_address = patch.businessAddress
  if (patch.gstin !== undefined) row.gstin = patch.gstin
  if (patch.notifyEmail !== undefined) row.notify_email = patch.notifyEmail
  const { error } = await db().from('site_settings').update(row).eq('id', true)
  if (error) throw error
}

/* ── Customers (aggregated from orders) ── */

export function customersFromOrders(orders: Order[]): CustomerSummary[] {
  const byEmail = new Map<string, CustomerSummary>()
  for (const order of [...orders].reverse()) {
    if (order.status === 'cancelled') continue
    const existing = byEmail.get(order.customer.email)
    if (!existing) {
      byEmail.set(order.customer.email, {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        city: order.address.city,
        state: order.address.state,
        ordersCount: 1,
        totalSpendPaise: order.totalPaise,
        firstOrderAt: order.createdAt,
        lastOrderAt: order.createdAt,
      })
    } else {
      existing.ordersCount += 1
      existing.totalSpendPaise += order.totalPaise
      existing.lastOrderAt = order.createdAt
    }
  }
  return [...byEmail.values()].sort((a, b) => b.totalSpendPaise - a.totalSpendPaise)
}
