import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSslcommerzConfig } from "@/lib/payment-settings";

/**
 * SSLCommerz redirects the shopper's browser here (POST) after payment.
 * We must NOT trust this redirect alone — always re-validate the
 * transaction server-to-server via SSLCommerz's Order Validation API before
 * marking an order paid, otherwise a forged redirect could fake a payment.
 */
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const form = await request.formData();
  const valId = form.get("val_id")?.toString();
  const tranId = form.get("tran_id")?.toString();

  if (!valId || !tranId) {
    return NextResponse.redirect(`${origin}/checkout?error=invalid_payment_response`);
  }

  const config = await getSslcommerzConfig();
  if (!config) {
    return NextResponse.redirect(`${origin}/checkout?error=payment_not_configured`);
  }
  const { storeId, storePassword, sandbox: isSandbox } = config;
  const validationUrl = isSandbox
    ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

  const params = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  try {
    const res = await fetch(`${validationUrl}?${params.toString()}`);
    const data = await res.json();

    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, total")
      .eq("order_number", tranId)
      .single();

    if (!order) {
      return NextResponse.redirect(`${origin}/checkout?error=order_not_found`);
    }

    const isValid =
      (data.status === "VALID" || data.status === "VALIDATED") &&
      Number(data.amount) === order.total &&
      data.currency === "BDT";

    if (!isValid) {
      console.error("SSLCommerz validation mismatch:", data);
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
      return NextResponse.redirect(`${origin}/checkout?error=payment_verification_failed`);
    }

    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        sslcommerz_val_id: valId,
      })
      .eq("id", order.id);

    return NextResponse.redirect(`${origin}/checkout/success?order=${tranId}`);
  } catch (err) {
    console.error("SSLCommerz validation request error:", err);
    return NextResponse.redirect(`${origin}/checkout?error=payment_verification_failed`);
  }
}

// SSLCommerz may also hit this with GET depending on gateway config.
export const GET = POST;
