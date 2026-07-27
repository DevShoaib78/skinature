import { NextResponse } from "next/server";
import { finalizePaidOrder } from "@/lib/checkout/finalize";
import { razorpayEnabled } from "@/lib/razorpay";

export const runtime = "nodejs";

/**
 * Confirms the MOCK payment for a pending order — the local-development fallback
 * used ONLY when Razorpay keys are absent. The real gateway path is
 * `/api/checkout/verify` (HMAC signature) + `/api/webhooks/razorpay`; all three
 * share `finalizePaidOrder`, so the order/state flow is identical either way.
 *
 * ⚠️ SECURITY: this route marks an order paid WITHOUT verifying any payment, so it
 * must never be reachable once a real gateway is configured — otherwise anyone
 * could POST a pending orderId and receive goods for free. It is therefore hard
 * disabled (404) whenever Razorpay keys are present, i.e. always in production.
 */

export async function POST(request: Request) {
  if (razorpayEnabled()) {
    // 404 rather than 403: don't advertise that this endpoint exists.
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { orderId?: string; outcome?: "success" | "failure" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { orderId, outcome } = body ?? {};
  if (!orderId || (outcome !== "success" && outcome !== "failure")) {
    return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
  }

  if (outcome === "failure") {
    // Payment did not complete; the order stays pending and can be retried.
    return NextResponse.json({ ok: true });
  }

  const result = await finalizePaidOrder({ orderId, provider: "mock" });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ order: result.order });
}
