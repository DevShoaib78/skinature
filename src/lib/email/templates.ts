import type { Order } from '@/lib/domain'
import { formatPaise, formatDate } from '@/lib/format'

/**
 * Transactional email HTML. Plain inline styles only (email clients strip
 * <style> and modern CSS). ₹ renders fine in HTML email, unlike the PDF.
 */

const FOREST = '#1A3C34'
const GOLD = '#B8860B'
const CREAM = '#FDFCF8'
const INK = '#2A2A2A'
const MUTED = '#6B7A76'

function shell(title: string, inner: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${CREAM};font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:${FOREST};letter-spacing:1px;">Skinature</div>
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};margin-top:4px;">Nurtured by Nature</div>
    </div>
    <div style="background:#ffffff;border:1px solid #EDEBE3;border-radius:16px;padding:28px;">
      ${inner}
    </div>
    <p style="text-align:center;color:${MUTED};font-size:11px;margin-top:20px;line-height:1.6;">
      ${title}<br/>
      Skinature | Nurtured by Nature Products, Hyderabad, Telangana
    </p>
  </div>
</body></html>`
}

function itemRows(order: Order): string {
  return order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #F2F0E9;font-size:14px;">${escapeHtml(it.name)} <span style="color:${MUTED};">× ${it.qty}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #F2F0E9;font-size:14px;text-align:right;white-space:nowrap;">${formatPaise(it.lineTotalPaise)}</td>
      </tr>`
    )
    .join('')
}

function totalsBlock(order: Order): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      <tr><td style="padding:4px 0;color:${MUTED};font-size:13px;">Subtotal</td><td style="padding:4px 0;text-align:right;font-size:13px;">${formatPaise(order.subtotalPaise)}</td></tr>
      <tr><td style="padding:4px 0;color:${MUTED};font-size:13px;">Shipping</td><td style="padding:4px 0;text-align:right;font-size:13px;">${formatPaise(order.shippingPaise)}</td></tr>
      <tr><td style="padding:10px 0 0;border-top:1px solid #EDEBE3;font-weight:bold;color:${FOREST};">Total</td><td style="padding:10px 0 0;border-top:1px solid #EDEBE3;text-align:right;font-weight:bold;font-size:18px;color:${FOREST};">${formatPaise(order.totalPaise)}</td></tr>
    </table>`
}

export function customerConfirmationHtml(order: Order): string {
  const first = order.customer.name.split(' ')[0]
  const inner = `
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${FOREST};margin:0 0 4px;">Order confirmed</h1>
    <p style="color:${MUTED};font-size:14px;margin:0 0 20px;">Thank you, ${escapeHtml(first)}. Nature is on its way.</p>
    <div style="background:${CREAM};border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;">
      <strong>Order ${order.orderNo}</strong> · ${formatDate(order.createdAt)}${order.invoiceNo ? ` · Invoice ${order.invoiceNo}` : ''}
    </div>
    <table style="width:100%;border-collapse:collapse;">${itemRows(order)}</table>
    ${totalsBlock(order)}
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #EDEBE3;font-size:13px;color:${MUTED};line-height:1.6;">
      <strong style="color:${INK};">Delivering to</strong><br/>
      ${escapeHtml(order.customer.name)}<br/>
      ${escapeHtml(order.address.line1)}${order.address.line2 ? `, ${escapeHtml(order.address.line2)}` : ''}<br/>
      ${escapeHtml(order.address.city)}, ${escapeHtml(order.address.state)} ${order.address.pincode}
    </div>
    <p style="font-size:12px;color:${MUTED};margin-top:20px;">Your invoice is attached as a PDF. Questions? Just reply to this email.</p>`
  return shell('This is your order confirmation.', inner)
}

export function adminNotificationHtml(order: Order): string {
  const inner = `
    <h1 style="font-family:Georgia,serif;font-size:22px;color:${FOREST};margin:0 0 12px;">New order · ${order.orderNo}</h1>
    <p style="font-size:14px;margin:0 0 16px;"><strong style="color:${GOLD};font-size:18px;">${formatPaise(order.totalPaise)}</strong> from ${escapeHtml(order.customer.name)}</p>
    <table style="width:100%;border-collapse:collapse;">${itemRows(order)}</table>
    ${totalsBlock(order)}
    <div style="margin-top:16px;font-size:13px;color:${MUTED};line-height:1.6;">
      ${escapeHtml(order.customer.email)} · ${escapeHtml(order.customer.phone)}<br/>
      ${escapeHtml(order.address.city)}, ${escapeHtml(order.address.state)} ${order.address.pincode}
    </div>`
  return shell('New order notification.', inner)
}

export function reviewInviteHtml(productName: string, reviewUrl: string): string {
  const inner = `
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${FOREST};margin:0 0 8px;">How's your ${escapeHtml(productName)}?</h1>
    <p style="color:${MUTED};font-size:14px;line-height:1.7;margin:0 0 24px;">
      It's been a few weeks, so you've had time to see the results. Your honest words help
      others find their ritual. It takes less than a minute.
    </p>
    <div style="text-align:center;">
      <a href="${reviewUrl}" style="display:inline-block;background:${FOREST};color:${CREAM};text-decoration:none;padding:14px 32px;border-radius:999px;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Write a review</a>
    </div>
    <p style="font-size:12px;color:${MUTED};margin-top:24px;text-align:center;">This link is just for you and can be used once.</p>`
  return shell('We would love your review.', inner)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
