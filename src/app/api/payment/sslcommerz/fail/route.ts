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

  return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
}

export const GET = POST;
