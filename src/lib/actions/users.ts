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
  const { error } = await supabase.from("profiles").update({ is_admin: isAdmin }).eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/customers");
  return { ok: true };
}
