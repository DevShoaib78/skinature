import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase/server";
import { emailEnabled, sendOrderEmails } from "@/lib/email/send";
import { renderInvoiceBuffer } from "@/lib/pdf/render";
import { rowToOrder, rowToSettings, ORDER_SELECT } from "@/lib/db/mappers";
import type { OrderRow, SettingsRow } from "@/lib/db/mappers";

export const runtime = "nodejs";

/**
 * Confirms the mock payment for a pending order.
 * At launch this is replaced by Razorpay signature verification (HMAC) and a
 * webhook; the order/state flow stays identical.
 */

const REVIEW_INVITE_DELAY_DAYS = 21;

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

  const db = getSupabaseService();

  const { data: order, error: orderError } = await db
    .from("orders")
    .select(
      "id, order_no, status, subtotal_paise, shipping_paise, total_paise, ship_name, ship_line1, ship_line2, ship_city, ship_state, ship_pincode, created_at, customers ( email, full_name, phone ), order_items ( product_id, name_snapshot, qty, unit_price_paise )"
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (outcome === "failure") {
    // Payment did not complete; the order stays pending and can be retried.
    return NextResponse.json({ ok: true });
  }

  if (order.status !== "pending") {
    return NextResponse.json({ error: "Order is not awaiting payment." }, { status: 409 });
  }

  const invoiceNo = `INV-2026-${order.order_no.replace("SKN-", "")}`;
  const { error: updateError } = await db
    .from("orders")
    .update({
      status: "paid",
      payment_provider: "mock",
      payment_id: `pay_mock_${order.order_no.replace("SKN-", "")}${Date.now() % 10000}`,
      invoice_no: invoiceNo,
    })
    .eq("id", order.id)
    .eq("status", "pending");
  if (updateError) {
    return NextResponse.json({ error: "Could not update order." }, { status: 500 });
  }

  type ItemRow = {
    product_id: string | null;
    name_snapshot: string;
    qty: number;
    unit_price_paise: number;
  };
  const items = (order.order_items ?? []) as ItemRow[];

  // ── decrement stock ──
  const productIds = [...new Set(items.map((i) => i.product_id).filter(Boolean))] as string[];
  const { data: productRows } = await db
    .from("products")
    .select("id, stock, image")
    .in("id", productIds);
  const productInfo = new Map((productRows ?? []).map((p) => [p.id, p]));

  for (const item of items) {
    if (!item.product_id) continue;
    const info = productInfo.get(item.product_id);
    if (info) {
      await db
        .from("products")
        .update({ stock: Math.max(0, info.stock - item.qty) })
        .eq("id", item.product_id);
    }
  }

  // ── review invites (auto-sent by scheduler 21 days after order, per DECISIONS §6.7) ──
  const sendAfter = new Date(Date.now() + REVIEW_INVITE_DELAY_DAYS * 24 * 60 * 60 * 1000);
  if (productIds.length > 0) {
    await db.from("review_invites").insert(
      productIds.map((productId) => ({
        order_id: order.id,
        product_id: productId,
        send_after: sendAfter.toISOString(),
      }))
    );
  }

  // ── confirmation email + PDF invoice (no-op until Resend is configured) ──
  // Never let email/PDF failures fail a paid order.
  if (emailEnabled()) {
    try {
      const [{ data: fullOrder }, { data: settingsRow }] = await Promise.all([
        db.from("orders").select(ORDER_SELECT).eq("id", order.id).single(),
        db.from("site_settings").select("*").single(),
      ]);
      if (fullOrder && settingsRow) {
        const domainOrder = rowToOrder(fullOrder as unknown as OrderRow);
        const settings = rowToSettings(settingsRow as SettingsRow);
        const pdf = await renderInvoiceBuffer(domainOrder, settings);
        await sendOrderEmails(domainOrder, settings, pdf);
      }
    } catch (err) {
      console.error("[confirm] order email failed:", err);
    }
  }

  type CustomerJoin = { email: string; full_name: string; phone: string } | null;
  const customer = order.customers as unknown as CustomerJoin;

  // Snapshot for the confirmation page.
  return NextResponse.json({
    order: {
      id: order.order_no,
      createdAt: order.created_at,
      customer: {
        name: customer?.full_name ?? order.ship_name,
        email: customer?.email ?? "",
        phone: customer?.phone ?? "",
      },
      address: {
        line1: order.ship_line1,
        line2: order.ship_line2 ?? undefined,
        city: order.ship_city,
        state: order.ship_state,
        pincode: order.ship_pincode,
      },
      items: items.map((it) => ({
        productId: it.product_id ?? "",
        name: it.name_snapshot,
        image: (it.product_id && productInfo.get(it.product_id)?.image) || "",
        qty: it.qty,
        unitPricePaise: it.unit_price_paise,
      })),
      subtotalPaise: order.subtotal_paise,
      shippingPaise: order.shipping_paise,
      totalPaise: order.total_paise,
      invoiceNo,
    },
  });
}
