import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Initiates an SSLCommerz payment session for an order and redirects the
 * shopper to the gateway's hosted checkout page.
 *
 * SETUP: once you have a merchant account, set these two env vars
 * (Vercel/hosting dashboard, or .env.local for development):
 *   SSLCOMMERZ_STORE_ID
 *   SSLCOMMERZ_STORE_PASSWORD
 * Use https://sandbox.sslcommerz.com for STORE_ID/PASSWORD while testing —
 * SSLCommerz gives you sandbox credentials immediately on signup, no need
 * to wait for the live merchant account to build/test this flow.
 * Toggle SSLCOMMERZ_SANDBOX=false when you go live.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const orderId = searchParams.get("order");

  if (!orderId) {
    return NextResponse.redirect(`${origin}/checkout?error=missing_order`);
  }

  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  // Not configured yet — send the shopper back with a clear message instead
  // of a broken payment page. Once merchant credentials are added, this
  // branch stops firing and the real gateway call below runs.
  if (!storeId || !storePassword) {
    return NextResponse.redirect(
      `${origin}/checkout?error=payment_not_configured&order=${orderId}`,
    );
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.redirect(`${origin}/checkout?error=order_not_found`);
  }

  const isSandbox = process.env.SSLCOMMERZ_SANDBOX !== "false";
  const apiUrl = isSandbox
    ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

  const form = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: String(order.total),
    currency: "BDT",
    tran_id: order.order_number,
    success_url: `${origin}/api/payment/sslcommerz/success`,
    fail_url: `${origin}/api/payment/sslcommerz/fail`,
    cancel_url: `${origin}/api/payment/sslcommerz/cancel`,
    cus_name: order.full_name,
    cus_email: order.guest_email || "guest@itparkfeni.com",
    cus_phone: order.phone,
    cus_add1: order.address_line,
    cus_city: order.city || "Feni",
    cus_country: "Bangladesh",
    shipping_method: "Courier",
    product_name: (order.order_items ?? []).map((i: { product_name: string }) => i.product_name).join(", ") || "IT PARK FENI order",
    product_category: "Electronics",
    product_profile: "physical-goods",
  });

  try {
    const res = await fetch(apiUrl, { method: "POST", body: form });
    const data = await res.json();

    if (data?.status === "SUCCESS" && data?.GatewayPageURL) {
      // Track the tran_id we sent, for reconciliation on the success callback.
      await supabase
        .from("orders")
        .update({ sslcommerz_tran_id: order.order_number })
        .eq("id", orderId);

      return NextResponse.redirect(data.GatewayPageURL);
    }

    console.error("SSLCommerz init failed:", data);
    return NextResponse.redirect(`${origin}/checkout?error=payment_init_failed`);
  } catch (err) {
    console.error("SSLCommerz init request error:", err);
    return NextResponse.redirect(`${origin}/checkout?error=payment_init_failed`);
  }
}
