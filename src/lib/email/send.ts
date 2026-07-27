import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type { Order, StoreSettings } from '@/lib/domain'
import { formatPaise } from '@/lib/format'
import {
  customerConfirmationHtml,
  adminNotificationHtml,
  reviewInviteHtml,
} from '@/lib/email/templates'

/**
 * Transactional email over Gmail SMTP, sending as official.skinature@gmail.com
 * (client decision 2026-07-25 — the brand runs one inbox; Resend/`info@skinature.org`
 * was dropped so there is no second mailbox to manage).
 *
 * Auth uses a Google **App Password**, not the account password: the Google account
 * needs 2-Step Verification on, then Security -> App passwords -> generate.
 * Gmail's free tier allows ~500 recipients/day, far above current order volume.
 *
 * Gated behind GMAIL_USER + GMAIL_APP_PASSWORD: when either is missing every call is
 * a graceful no-op, so checkout never depends on email being configured.
 */

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') // Google shows it in 4-char groups
/** Display name + address customers see. Defaults to the sending account. */
const FROM = process.env.EMAIL_FROM || (GMAIL_USER ? `Skinature <${GMAIL_USER}>` : undefined)
/** Where the internal "new order" notification goes. Defaults to the sending account. */
const ADMIN = process.env.EMAIL_ADMIN || GMAIL_USER

let transporter: Transporter | null = null

function getTransport(): Transporter | null {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })
  }
  return transporter
}

export function emailEnabled(): boolean {
  return Boolean(GMAIL_USER && GMAIL_APP_PASSWORD && FROM)
}

/** Verifies the SMTP credentials without sending anything (used by the test script). */
export async function verifyEmailConnection(): Promise<{ ok: boolean; error?: string }> {
  const tx = getTransport()
  if (!tx) return { ok: false, error: 'GMAIL_USER / GMAIL_APP_PASSWORD not set' }
  try {
    await tx.verify()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

type SendResult = { skipped: true } | { skipped: false }

export async function sendOrderEmails(
  order: Order,
  settings: StoreSettings,
  pdf?: Buffer
): Promise<SendResult> {
  const tx = getTransport()
  if (!tx || !FROM) return { skipped: true }

  await tx.sendMail({
    from: FROM,
    to: order.customer.email,
    subject: `Your Skinature order ${order.orderNo} is confirmed`,
    html: customerConfirmationHtml(order),
    attachments: pdf
      ? [
          {
            filename: `Skinature-${order.invoiceNo ?? order.orderNo}.pdf`,
            content: pdf,
            contentType: 'application/pdf',
          },
        ]
      : undefined,
  })

  const adminTo = ADMIN || settings.notifyEmail
  if (adminTo) {
    await tx.sendMail({
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
  const tx = getTransport()
  if (!tx || !FROM) return { skipped: true }
  await tx.sendMail({
    from: FROM,
    to,
    subject: `How is your ${productName}? Share a quick review`,
    html: reviewInviteHtml(productName, reviewUrl),
  })
  return { skipped: false }
}
