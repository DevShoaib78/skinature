import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase/server";
import { sendReviewInviteEmail, emailEnabled } from "@/lib/email/send";
import { SITE_URL } from "@/lib/data";

export const runtime = "nodejs";

/**
 * Sends any review invites whose 21-day delay has elapsed and that have not
 * been sent yet. Intended to run daily (Vercel Cron or Supabase pg_cron →
 * this endpoint). Protected by CRON_SECRET so it can't be triggered publicly.
 */
async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured." }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  const provided = auth?.replace(/^Bearer\s+/i, "") ?? url.searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabaseService();
  const nowIso = new Date().toISOString();

  const { data: due, error } = await db
    .from("review_invites")
    .select("id, token, order_id, products ( name ), orders ( customers ( email ) )")
    .lte("send_after", nowIso)
    .is("sent_at", null)
    .is("used_at", null)
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const invites = (due ?? []) as unknown as {
    id: string;
    token: string;
    products: { name: string } | null;
    orders: { customers: { email: string } | null } | null;
  }[];

  if (!emailEnabled()) {
    // Nothing to send yet (Resend not configured); report what WOULD go out.
    return NextResponse.json({ due: invites.length, sent: 0, emailConfigured: false });
  }

  let sent = 0;
  for (const invite of invites) {
    const email = invite.orders?.customers?.email;
    const productName = invite.products?.name ?? "your Skinature product";
    if (!email) continue;
    try {
      await sendReviewInviteEmail(email, productName, `${SITE_URL}/review/${invite.token}`);
      await db.from("review_invites").update({ sent_at: new Date().toISOString() }).eq("id", invite.id);
      sent += 1;
    } catch (err) {
      console.error("[cron] review invite send failed:", invite.id, err);
    }
  }

  return NextResponse.json({ due: invites.length, sent, emailConfigured: true });
}

export async function GET(request: Request) {
  return handle(request);
}
export async function POST(request: Request) {
  return handle(request);
}
