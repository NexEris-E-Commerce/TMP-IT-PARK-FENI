"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

type Role = "is_admin" | "is_super_admin";

/**
 * Grants or revokes admin / super admin access on another account.
 * Only a super admin may call this — regular admins can't manage anyone's
 * access, including their own.
 */
export async function setUserRole(userId: string, role: Role, value: boolean) {
  const currentUser = await requireSuperAdmin();

  if (userId === currentUser.id && !value) {
    // Prevent a super admin from locking themselves out by accident.
    return { error: "You can't remove your own access." };
  }

  const supabase = createAdminClient();

  // Keep the two flags consistent: granting super admin implies admin
  // access, and revoking admin access implies revoking super admin too
  // (a super admin who isn't an admin makes no sense).
  const update: Record<string, boolean> = { [role]: value };
  if (role === "is_super_admin" && value) update.is_admin = true;
  if (role === "is_admin" && !value) update.is_super_admin = false;

  // Upsert instead of update: if this customer somehow has no `profiles`
  // row yet (e.g. created before the auto-provision trigger existed), a
  // plain `.update()` matches zero rows and silently "succeeds" without
  // changing anything — the toggle then reverts on refresh. Upsert
  // guarantees the row exists and the flags are actually set.
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...update }, { onConflict: "id" })
    .select("id, is_admin, is_super_admin")
    .single();

  if (error) return { error: error.message };
  if (!data || data[role] !== value) {
    return { error: "Update didn't apply — please try again." };
  }

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${userId}`);
  return { ok: true };
}
