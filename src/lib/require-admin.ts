import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email?: string;
  isAdmin: true;
  isSuperAdmin: boolean;
}

/**
 * Call at the top of any /admin Server Component or Server Action. Redirects
 * to /login if signed out, or to / if signed in but not an admin. Returns
 * the current admin (including whether they're a super admin) on success.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, is_super_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  return {
    id: user.id,
    email: user.email ?? undefined,
    isAdmin: true,
    isSuperAdmin: profile.is_super_admin ?? false,
  };
}

/**
 * Stricter than requireAdmin: only super admins pass. Use this for
 * super-admin-only actions/pages — managing other admins' access and the
 * payment settings (SSLCommerz credentials). Regular admins are bounced
 * back to /admin instead of the storefront, since they *are* legitimately
 * signed in as admins — just not authorized for this particular action.
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (!admin.isSuperAdmin) redirect("/admin");
  return admin;
}
