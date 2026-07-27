import type { Order } from '@/lib/domain'
import { formatPaise } from '@/lib/format'

/* ────────────────────────────────────────────────────────────────────────────
 * 1. MANUAL click-to-chat (admin panel button) — no API, admin taps send.
 * ──────────────────────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────────────────────────
 * 2. AUTOMATIC order notification — Meta WhatsApp Cloud API, used DIRECTLY with
 *    no BSP middleman (client explicitly rejected AiSensy/Interakt/WATI).
 *    Meta charges no monthly fee; utility messages cost ~Rs 0.115 + GST each.
 *
 *    Gated behind WHATSAPP_PHONE_NUMBER_ID + WHATSAPP_ACCESS_TOKEN: when either
 *    is missing every call is a graceful no-op, so a paid order NEVER fails
 *    because WhatsApp is unconfigured (same contract as the email pipeline).
 *
 *    Meta-side setup (once): Meta Business account + a dedicated number NOT
 *    active on the WhatsApp app -> create the WhatsApp app -> Phone Number ID +
 *    permanent access token -> submit the template below for approval (~1-2 days).
 * ──────────────────────────────────────────────────────────────────────────── */

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
/** Approved template name in Meta Business Manager. */
const TEMPLATE = process.env.WHATSAPP_TEMPLATE_NAME || 'order_confirmation'
const TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG || 'en'
const GRAPH_VERSION = 'v21.0'

export function whatsappEnabled(): boolean {
  return Boolean(PHONE_NUMBER_ID && ACCESS_TOKEN)
}

/**
 * Indian mobiles are stored as 10 digits; WhatsApp needs full international
 * format with no '+' or separators (e.g. 919885421522).
 */
export function toWhatsAppNumber(phone: string): string | null {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  return null
}

export type WhatsAppResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: string }

async function callGraph(payload: unknown): Promise<WhatsAppResult> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { sent: false, reason: data?.error?.message ?? `HTTP ${res.status}` }
    }
    return { sent: true, messageId: data?.messages?.[0]?.id ?? 'unknown' }
  } catch (err) {
    return { sent: false, reason: (err as Error).message }
  }
}

/**
 * Sends the order-confirmation template to the customer's WhatsApp.
 *
 * The template must be registered in Meta with these 4 body placeholders, in order:
 *   {{1}} customer name   {{2}} order number
 *   {{3}} order total     {{4}} invoice URL
 *
 * Suggested copy to submit for approval (category: UTILITY):
 *   "Hi {{1}}, thank you for your Skinature order {{2}}. Your order total is {{3}}
 *    and it is now being processed. View your invoice: {{4}}
 *    We will notify you when it ships. Nurtured by Nature."
 */
export async function sendOrderWhatsApp(
  order: Order,
  invoiceUrl: string
): Promise<WhatsAppResult> {
  if (!whatsappEnabled()) return { sent: false, reason: 'not-configured' }

  const to = toWhatsAppNumber(order.customer.phone)
  if (!to) return { sent: false, reason: `invalid phone: ${order.customer.phone}` }

  return callGraph({
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: TEMPLATE,
      language: { code: TEMPLATE_LANG },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: order.customer.name },
            { type: 'text', text: order.orderNo },
            { type: 'text', text: formatPaise(order.totalPaise) },
            { type: 'text', text: invoiceUrl },
          ],
        },
      ],
    },
  })
}
