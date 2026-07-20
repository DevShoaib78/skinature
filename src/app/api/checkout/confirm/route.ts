import { NextResponse } from "next/server";
import { finalizePaidOrder } from "@/lib/checkout/finalize";

export const runtime = "nodejs";

/**
 * Confirms the MOCK payment for a pending order (the fallback used when Razorpay
 * keys are absent). The real gateway path is `/api/checkout/verify` (signature
 * verification) + `/api/webhooks/razorpay`; both share `finalizePaidOrder`, so the
 * order/state flow is identical whichever path runs.
 */

export async function POST(request: Request) {
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
