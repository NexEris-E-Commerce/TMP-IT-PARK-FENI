import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const form = await request.formData();
  const tranId = form.get("tran_id")?.toString();

  if (tranId) {
    const supabase = createAdminClient();
    await supabase
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("order_number", tranId);
  }

  // 303 (not the 307 that NextResponse.redirect() defaults to) so the
  // browser switches to GET when following this redirect. SSLCommerz POSTs
  // to this route; without an explicit 303, a 307 preserves that POST onto
  // /checkout — which only handles GET/HEAD as a normal page — and the
  // browser lands on a 405 Method Not Allowed instead of the checkout page.
  return NextResponse.redirect(`${origin}/checkout?error=payment_failed`, 303);
}

export const GET = POST;
