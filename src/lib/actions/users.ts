"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setUserAdmin(userId: string, isAdmin: boolean) {
  const currentUser = await requireAdmin();

  if (userId === currentUser.id && !isAdmin) {
    // Prevent an admin from locking themselves out by accident.
    return { error: "You can't remove your own admin access." };
  }

  const supabase = createAdminClient();

  // Upsert instead of update: if this customer somehow has no `profiles`
  // row yet (e.g. created before the auto-provision trigger existed), a
  // plain `.update()` matches zero rows and silently "succeeds" without
  // changing anything — the toggle then reverts on refresh. Upsert
  // guarantees the row exists and is_admin is actually set.
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, is_admin: isAdmin }, { onConflict: "id" })
    .select("id, is_admin")
    .single();

  if (error) return { error: error.message };
  if (!data || data.is_admin !== isAdmin) {
    return { error: "Update didn't apply — please try again." };
  }

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${userId}`);
  return { ok: true };
}
