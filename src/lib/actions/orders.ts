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
  await supabase.from("orders").update({ status }).eq("id", orderId);
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
