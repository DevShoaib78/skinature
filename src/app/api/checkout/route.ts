import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase/server";
import { INDIAN_STATES } from "@/lib/shipping";
import { razorpayEnabled, razorpayKeyId, getRazorpay } from "@/lib/razorpay";

export const runtime = "nodejs";

/**
 * Creates a pending order with server-computed totals.
 * The client's cart is advisory; prices, stock, and shipping come from the DB.
 * When Razorpay is configured, this route also creates the matching Razorpay
 * order and returns the fields the browser checkout needs; otherwise it returns
 * the plain order and the client falls back to the mock payment sheet.
 */

interface CheckoutItem {
  productId: string;
  qty: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customer: { email: string; phone: string; fullName: string };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request body.");
  }

  const { items, customer, address } = body ?? {};

  // ── validation (mirrors the client, enforced server-side) ──
  if (!Array.isArray(items) || items.length === 0) return bad("Cart is empty.");
  if (items.length > 50) return bad("Too many items.");
  for (const item of items) {
    if (!item?.productId || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) {
      return bad("Invalid cart item.");
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer?.email ?? "")) return bad("Invalid email.");
  if (!/^[6-9]\d{9}$/.test(customer?.phone ?? "")) return bad("Invalid mobile number.");
  if ((customer?.fullName ?? "").trim().length < 3) return bad("Invalid name.");
  if ((address?.line1 ?? "").trim().length < 5) return bad("Invalid address.");
  if ((address?.city ?? "").trim().length < 2) return bad("Invalid city.");
  if (!(INDIAN_STATES as readonly string[]).includes(address?.state ?? "")) return bad("Invalid state.");
  if (!/^[1-9]\d{5}$/.test(address?.pincode ?? "")) return bad("Invalid PIN code.");

  const db = getSupabaseService();

  // ── price + stock from the database ──
  const ids = [...new Set(items.map((i) => i.productId))];
  const { data: productRows, error: productsError } = await db
    .from("products")
    .select("id, name, price_paise, sale_price_paise, stock, is_active")
    .in("id", ids);
  if (productsError) return bad("Could not load products.", 500);

  const products = new Map((productRows ?? []).map((p) => [p.id, p]));
  let subtotalPaise = 0;
  const orderItems: {
    product_id: string;
    name_snapshot: string;
    qty: number;
    unit_price_paise: number;
    line_total_paise: number;
  }[] = [];

  for (const item of items) {
    const product = products.get(item.productId);
    if (!product || !product.is_active) {
      return bad("One of the products is no longer available.", 409);
    }
    if (product.stock < item.qty) {
      return bad(`Only ${product.stock} left of ${product.name}.`, 409);
    }
    const unit = product.sale_price_paise ?? product.price_paise;
    subtotalPaise += unit * item.qty;
    orderItems.push({
      product_id: product.id,
      name_snapshot: product.name,
      qty: item.qty,
      unit_price_paise: unit,
      line_total_paise: unit * item.qty,
    });
  }

  // ── shipping from settings ──
  const { data: settings } = await db
    .from("site_settings")
    .select("shipping_telangana_paise, shipping_rest_paise")
    .single();
  const shippingPaise =
    address.state.trim().toLowerCase() === "telangana"
      ? settings?.shipping_telangana_paise ?? 6000
      : settings?.shipping_rest_paise ?? 10000;

  // ── customer upsert ──
  const email = customer.email.trim().toLowerCase();
  const { data: customerRow, error: customerError } = await db
    .from("customers")
    .upsert(
      { email, full_name: customer.fullName.trim(), phone: customer.phone.trim() },
      { onConflict: "email" }
    )
    .select("id")
    .single();
  if (customerError || !customerRow) return bad("Could not save customer.", 500);

  // ── order + items ──
  const { data: orderRow, error: orderError } = await db
    .from("orders")
    .insert({
      customer_id: customerRow.id,
      status: "pending",
      subtotal_paise: subtotalPaise,
      shipping_paise: shippingPaise,
      total_paise: subtotalPaise + shippingPaise,
      ship_name: customer.fullName.trim(),
      ship_line1: address.line1.trim(),
      ship_line2: address.line2?.trim() || null,
      ship_city: address.city.trim(),
      ship_state: address.state,
      ship_pincode: address.pincode.trim(),
    })
    .select("id, order_no")
    .single();
  if (orderError || !orderRow) return bad("Could not create order.", 500);

  const { error: itemsError } = await db
    .from("order_items")
    .insert(orderItems.map((it) => ({ ...it, order_id: orderRow.id })));
  if (itemsError) {
    await db.from("orders").delete().eq("id", orderRow.id);
    return bad("Could not create order items.", 500);
  }

  const totalPaise = subtotalPaise + shippingPaise;

  // ── Razorpay order (when configured); otherwise the client uses the mock sheet ──
  if (razorpayEnabled()) {
    try {
      const rzpOrder = await getRazorpay().orders.create({
        amount: totalPaise, // smallest currency unit = paise for INR
        currency: "INR",
        receipt: orderRow.order_no,
        notes: { order_no: orderRow.order_no },
      });

      const { error: linkError } = await db
        .from("orders")
        .update({ razorpay_order_id: rzpOrder.id })
        .eq("id", orderRow.id);
      if (linkError) {
        await db.from("orders").delete().eq("id", orderRow.id);
        return bad("Could not link payment order.", 500);
      }

      return NextResponse.json({
        orderId: orderRow.id,
        orderNo: orderRow.order_no,
        subtotalPaise,
        shippingPaise,
        totalPaise,
        razorpay: {
          keyId: razorpayKeyId(),
          orderId: rzpOrder.id,
          amount: totalPaise,
        },
      });
    } catch (err) {
      console.error("[checkout] Razorpay order creation failed:", err);
      await db.from("orders").delete().eq("id", orderRow.id);
      return bad("Could not start payment. Please try again.", 502);
    }
  }

  return NextResponse.json({
    orderId: orderRow.id,
    orderNo: orderRow.order_no,
    subtotalPaise,
    shippingPaise,
    totalPaise,
  });
}
