import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateInvoicePdf } from "@/lib/invoice";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to download this invoice." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  const isAdmin = profile?.is_admin === true;

  // Admin client used for the actual order lookup so this works regardless
  // of RLS — the access check right below is what actually gates it.
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*, order_items(*)").eq("id", id).single();

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (!isAdmin && order.user_id !== user.id) {
    return NextResponse.json({ error: "You don't have access to this invoice." }, { status: 403 });
  }

  try {
    const pdfBuffer = await generateInvoicePdf(order);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.order_number}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Invoice generation failed:", error);
    return NextResponse.json({ error: "Couldn't generate the invoice. Please try again." }, { status: 500 });
  }
}
