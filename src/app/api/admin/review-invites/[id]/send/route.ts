import { NextResponse } from 'next/server'
import { getSupabaseService } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/route'
import { sendReviewInviteEmail, emailEnabled } from '@/lib/email/send'
import { SITE_URL } from '@/lib/data'

export const runtime = 'nodejs'

/**
 * Admin-only: emails a review magic link to the customer right now and marks the
 * invite sent (which stops the 21-day auto-send, since the cron skips sent invites).
 * If Resend is not configured yet, it reports `email-not-configured` and does NOT
 * mark the invite sent, so the admin can fall back to Copy link + WhatsApp.
 */

type InviteJoin = {
  id: string
  token: string
  used_at: string | null
  products: { name: string } | null
  orders: { customers: { email: string } | null } | null
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminId = await requireAdmin()
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = getSupabaseService()

  const { data, error } = await db
    .from('review_invites')
    .select('id, token, used_at, products ( name ), orders ( customers ( email ) )')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) {
    return NextResponse.json({ error: 'Invite not found.' }, { status: 404 })
  }
  const invite = data as unknown as InviteJoin

  if (invite.used_at) {
    return NextResponse.json({ error: 'This customer has already submitted their review.' }, { status: 409 })
  }

  const email = invite.orders?.customers?.email
  const productName = invite.products?.name ?? 'your Skinature product'
  if (!email) {
    return NextResponse.json({ error: 'No customer email on this order.' }, { status: 422 })
  }

  // Not configured yet: report it (don't mark sent) so the admin uses Copy link instead.
  if (!emailEnabled()) {
    return NextResponse.json({ ok: false, reason: 'email-not-configured' })
  }

  try {
    await sendReviewInviteEmail(email, productName, `${SITE_URL}/review/${invite.token}`)
  } catch (err) {
    console.error('[admin] review invite send failed:', id, err)
    return NextResponse.json({ error: 'Could not send the email. Please try again.' }, { status: 502 })
  }

  const sentAt = new Date().toISOString()
  const { error: updateError } = await db
    .from('review_invites')
    .update({ sent_at: sentAt })
    .eq('id', id)
  if (updateError) {
    // The email went out; report success but note the state may lag.
    console.error('[admin] review invite mark-sent failed:', id, updateError)
  }

  return NextResponse.json({ ok: true, sentAt })
}
