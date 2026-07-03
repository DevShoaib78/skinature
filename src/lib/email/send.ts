import { Resend } from 'resend'
import type { Order, StoreSettings } from '@/lib/domain'
import { formatPaise } from '@/lib/format'
import {
  customerConfirmationHtml,
  adminNotificationHtml,
  reviewInviteHtml,
} from '@/lib/email/templates'

/**
 * Transactional email, gated behind RESEND_API_KEY + EMAIL_FROM.
 * When those are absent (dev / pre-launch) every call is a graceful no-op,
 * so the order flow never depends on email being configured.
 */

const apiKey = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM // e.g. "Skinature <orders@skinature.org>"
const ADMIN = process.env.EMAIL_ADMIN

const resend = apiKey ? new Resend(apiKey) : null

export function emailEnabled(): boolean {
  return Boolean(resend && FROM)
}

type SendResult = { skipped: true } | { skipped: false }

export async function sendOrderEmails(
  order: Order,
  settings: StoreSettings,
  pdf?: Buffer
): Promise<SendResult> {
  if (!resend || !FROM) return { skipped: true }

  await resend.emails.send({
    from: FROM,
    to: order.customer.email,
    subject: `Your Skinature order ${order.orderNo} is confirmed`,
    html: customerConfirmationHtml(order),
    attachments: pdf
      ? [
          {
            filename: `Skinature-${order.invoiceNo ?? order.orderNo}.pdf`,
            content: pdf,
          },
        ]
      : undefined,
  })

  const adminTo = ADMIN || settings.notifyEmail
  if (adminTo) {
    await resend.emails.send({
      from: FROM,
      to: adminTo,
      subject: `New order ${order.orderNo} · ${formatPaise(order.totalPaise)}`,
      html: adminNotificationHtml(order),
    })
  }

  return { skipped: false }
}

export async function sendReviewInviteEmail(
  to: string,
  productName: string,
  reviewUrl: string
): Promise<SendResult> {
  if (!resend || !FROM) return { skipped: true }
  await resend.emails.send({
    from: FROM,
    to,
    subject: `How is your ${productName}? Share a quick review`,
    html: reviewInviteHtml(productName, reviewUrl),
  })
  return { skipped: false }
}
