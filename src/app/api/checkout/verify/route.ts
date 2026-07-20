import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabaseService } from "@/lib/supabase/server";
import { razorpayEnabled } from "@/lib/razorpay";
import { finalizePaidOrder } from "@/lib/checkout/finalize";

export const runtime = "nodejs";

/**
 * Verifies a Razorpay checkout payment and finalizes the order.
 *
 * The browser's Razorpay handler posts { orderId, razorpayPaymentId, razorpaySignature }.
 * We recompute HMAC-SHA256(`${razorpay_order_id}|${razorpay_payment_id}`) with the key
 * secret and compare against the signature. Critically, `razorpay_order_id` is read from
 * OUR order row (not the client), so a valid signature for someone else's order cannot
 * finalize this one. On a match we hand off to the shared, idempotent `finalizePaidOrder`.
 */

function timingSafeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  if (!razorpayEnabled()) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  let body: {
    orderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { orderId, razorpayPaymentId, razorpaySignature } = body ?? {};
  if (!orderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  const db = getSupabaseService();
  const { data: order, error: orderError } = await db
    .from("orders")
    .select("id, razorpay_order_id")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (!order.razorpay_order_id) {
    return NextResponse.json({ error: "No payment is pending for this order." }, { status: 409 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${order.razorpay_order_id}|${razorpayPaymentId}`)
    .digest("hex");

  if (!timingSafeEqualHex(expected, razorpaySignature)) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const result = await finalizePaidOrder({
    orderId,
    provider: "razorpay",
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ order: result.order });
}
