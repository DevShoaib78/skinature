import Razorpay from 'razorpay'

/**
 * Server-only Razorpay SDK access.
 *
 * The store degrades gracefully: when the keys are absent (`razorpayEnabled()`
 * is false) checkout falls back to the mock payment sheet, so the app still runs
 * end to end without a payment gateway configured. NEVER import this from a client
 * component — the secret must stay server-side.
 */

let instance: Razorpay | null = null

/** True when both Razorpay keys are present. */
export function razorpayEnabled(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

/** The public Key ID, safe to hand to the browser checkout. Empty when unconfigured. */
export function razorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID ?? ''
}

/** The server SDK instance. Guard with `razorpayEnabled()` first — throws if unconfigured. */
export function getRazorpay(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error('Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing).')
  }
  if (!instance) instance = new Razorpay({ key_id, key_secret })
  return instance
}
