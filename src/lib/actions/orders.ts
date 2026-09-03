"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const VALID_PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status)) return;

  const supabase = createAdminClient();

  const { data: currentOrder } = await supabase.from("orders").select("status").eq("id", orderId).single();

  await supabase.from("orders").update({ status }).eq("id", orderId);

  // Cancelling an order releases the stock it reserved at checkout, back
  // into inventory. Guarded so re-saving an already-cancelled order (or any
  // other status change) never double-restocks.
  if (status === "cancelled" && currentOrder?.status !== "cancelled") {
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    const restockItems = (items ?? [])
      .filter((i) => i.product_id)
      .map((i) => ({ product_id: i.product_id, quantity: i.quantity }));

    if (restockItems.length) {
      await supabase.rpc("restore_stock_for_order", { items: restockItems });
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  await requireAdmin();
  if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) return;

  const supabase = createAdminClient();
  await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
