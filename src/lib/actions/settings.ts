"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PaymentSettingsFormState {
  error?: string;
  success?: boolean;
}

export async function getPaymentSettings() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("payment_settings")
    .select("store_id, store_password, sandbox")
    .eq("id", "sslcommerz")
    .single();

  return {
    storeId: data?.store_id ?? "",
    hasPassword: Boolean(data?.store_password),
    sandbox: data?.sandbox ?? true,
  };
}

export async function updatePaymentSettings(
  _prev: PaymentSettingsFormState,
  formData: FormData,
): Promise<PaymentSettingsFormState> {
  await requireAdmin();

  const storeId = String(formData.get("storeId") ?? "").trim();
  const storePassword = String(formData.get("storePassword") ?? "").trim();
  const sandbox = formData.get("sandbox") === "on";

  const supabase = createAdminClient();

  // Only overwrite the stored password if a new one was actually typed —
  // this lets the admin change the Store ID or sandbox toggle without
  // having to re-enter the password every time (the field is shown blank
  // for security, not because there's nothing saved).
  const update: Record<string, unknown> = { store_id: storeId, sandbox, updated_at: new Date().toISOString() };
  if (storePassword) update.store_password = storePassword;

  const { error } = await supabase.from("payment_settings").update(update).eq("id", "sslcommerz");

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  return { success: true };
}
