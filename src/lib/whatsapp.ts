import type { Order } from '@/lib/domain'
import { formatPaise } from '@/lib/format'

/**
 * Builds the pre-filled WhatsApp click-to-chat message for an order
 * (docs/DECISIONS.md §6: click-to-chat carries text only; the PDF invoice
 * travels by email).
 */
export function buildOrderWhatsAppUrl(order: Order): string {
  const firstName = order.customer.name.split(' ')[0]
  const itemLines = order.items
    .map((i) => `• ${i.name} × ${i.qty}`)
    .join('\n')

  const text =
    `Hello ${firstName}! 🌿\n\n` +
    `Thank you for shopping with Skinature. Here is a summary of your order ${order.orderNo}:\n\n` +
    `${itemLines}\n\n` +
    `Subtotal: ${formatPaise(order.subtotalPaise)}\n` +
    `Shipping: ${formatPaise(order.shippingPaise)}\n` +
    `Total: ${formatPaise(order.totalPaise)}\n\n` +
    `Your invoice has been sent to ${order.customer.email}.\n\n` +
    `Nurtured by Nature,\nTeam Skinature`

  return `https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(text)}`
}
