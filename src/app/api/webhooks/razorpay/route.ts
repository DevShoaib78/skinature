import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabaseService } from "@/lib/supabase/server";
import { finalizePaidOrder } from "@/lib/checkout/finalize";

export const runtime = "nodejs";

/**
 * Razorpay server-to-server webhook — the reliable backstop for the browser verify
 * (which can be lost if the customer closes the tab after paying).
 *
 * Verifies the raw request body against `RAZORPAY_WEBHOOK_SECRET`
 * (HMAC-SHA256 == X-Razorpay-Signature), then finalizes on `payment.captured`.
 * Idempotent: `finalizePaidOrder` is a no-op if the order is already paid, so a
 * webhook that races or retries the browser verify is safe.
 *
 * Gated on the secret: unset (dev / pre-launch) → a 200 no-op. The secret is set
 * and the webhook registered in the Razorpay dashboard at deploy.
 */

function timingSafeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    // Webhook not configured yet — acknowledge without acting.
    return NextResponse.json({ received: false, reason: "webhook not configured" });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!signature || !timingSafeEqualHex(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;

  if (event.event === "payment.captured" && payment?.order_id && payment.id) {
    const db = getSupabaseService();
    const { data: order } = await db
      .from("orders")
      .select("id")
      .eq("razorpay_order_id", payment.order_id)
      .maybeSingle();

    if (order) {
      // Idempotent: already-paid orders are a no-op.
      await finalizePaidOrder({
        orderId: order.id,
        provider: "razorpay",
        paymentId: payment.id,
      });
    }
  }

  // payment.failed and unhandled events: acknowledge; the order stays pending and retryable.
  return NextResponse.json({ received: true });
}
