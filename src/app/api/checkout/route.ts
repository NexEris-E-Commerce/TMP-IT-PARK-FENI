import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deliveryFee, getZone } from "@/lib/commerce";

interface CheckoutLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutPayload {
  lines: CheckoutLine[];
  fullName: string;
  phone: string;
  email?: string;
  zoneId: string;
  addressLine: string;
  city?: string;
  paymentMethod: "cod" | "sslcommerz";
  notes?: string;
}

export async function POST(request: Request) {
  let body: CheckoutPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ---- Validate ----
  if (!body.lines?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!body.fullName?.trim() || !body.phone?.trim() || !body.addressLine?.trim()) {
    return NextResponse.json({ error: "Missing required delivery details" }, { status: 400 });
  }
  const zone = getZone(body.zoneId);
  if (!zone) {
    return NextResponse.json({ error: "Invalid delivery zone" }, { status: 400 });
  }
  if (!["cod", "sslcommerz"].includes(body.paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const subtotal = body.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const fee = deliveryFee(zone, subtotal);
  const total = subtotal + fee;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ---- Reserve stock (atomic — see reserve_stock_for_order in schema.sql) ----
  // Must happen before the order is created: this is the only place that
  // actually checks/decrements stock server-side, so it's what stops two
  // customers both getting the last unit of something, or someone placing
  // an order for a sold-out item via a direct API call.
  const stockItems = body.lines.map((l) => ({ product_id: l.productId, quantity: l.quantity }));
  const { error: stockError } = await supabase.rpc("reserve_stock_for_order", { items: stockItems });
  if (stockError) {
    return NextResponse.json({ error: stockError.message }, { status: 409 });
  }

  // ---- Create order ----
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      guest_email: user ? null : body.email ?? null,
      guest_phone: user ? null : body.phone,
      full_name: body.fullName,
      phone: body.phone,
      zone_id: body.zoneId,
      address_line: body.addressLine,
      city: body.city ?? null,
      subtotal,
      delivery_fee: fee,
      total,
      payment_method: body.paymentMethod,
      payment_status: "unpaid",
      status: "pending",
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Order insert failed:", orderError);
    // Give back the stock we just reserved — the order was never created,
    // so it should never count against inventory.
    await supabase.rpc("restore_stock_for_order", { items: stockItems });
    return NextResponse.json({ error: "Could not create order. Please try again." }, { status: 500 });
  }

  // ---- Snapshot line items ----
  const itemRows = body.lines.map((l) => ({
    order_id: order.id,
    product_id: l.productId,
    product_name: l.name,
    product_slug: l.slug,
    unit_price: l.price,
    quantity: l.quantity,
    line_total: l.price * l.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) {
    console.error("Order items insert failed:", itemsError);
    // Order row already exists; surface the error but keep the order for manual review.
    return NextResponse.json(
      { error: "Order created but items failed to save. Our team will contact you.", orderNumber: order.order_number },
      { status: 207 },
    );
  }

  // ---- Cash on Delivery: done, order awaits a confirmation call ----
  if (body.paymentMethod === "cod") {
    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number, redirect: `/checkout/success?order=${order.order_number}` });
  }

  // ---- SSLCommerz: hand off to the init route to get a payment gateway URL ----
  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.order_number,
    redirect: `/api/payment/sslcommerz/init?order=${order.id}`,
  });
}

export const dynamic = "force-dynamic";
