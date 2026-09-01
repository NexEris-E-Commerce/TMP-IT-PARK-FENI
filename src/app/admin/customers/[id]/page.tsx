import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatBDT } from "@/lib/format";
import { ChevronRight } from "@/components/ui/icons";
import { AdminToggleSwitch } from "@/components/admin/AdminToggleSwitch";
import { cn } from "@/lib/cn";

export const metadata = { title: "Customer Detail" };

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: userData, error: userError }, { data: profile }, { data: orders }] = await Promise.all([
    supabase.auth.admin.getUserById(id),
    supabase.from("profiles").select("full_name, phone, is_admin").eq("id", id).single(),
    supabase.from("orders").select("*").eq("user_id", id).order("created_at", { ascending: false }),
  ]);

  if (userError || !userData?.user) notFound();
  const user = userData.user;

  const totalSpent = (orders ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/admin/customers" className="transition hover:text-brand-700">
          Customers
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">{profile?.full_name || user.email}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {profile?.full_name || "Unnamed Customer"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{user.email}</p>
          {profile?.phone && <p className="text-sm text-ink-soft">{profile.phone}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-soft">Admin access</span>
          <AdminToggleSwitch userId={id} isAdmin={profile?.is_admin ?? false} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-dim">Joined</p>
          <p className="mt-1 font-display text-lg font-bold text-ink">
            {new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-dim">Total Orders</p>
          <p className="mt-1 font-display text-lg font-bold text-ink">{orders?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-dim">Total Spent</p>
          <p className="mt-1 font-display text-lg font-bold text-ink">{formatBDT(totalSpent)}</p>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Order History</h2>
      {!orders?.length ? (
        <p className="mt-3 text-sm text-ink-dim">No orders yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-dim">
                <th className="p-4">Order</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="p-4">
                    <p className="font-semibold text-ink">#{o.order_number}</p>
                    <p className="text-xs text-ink-dim">
                      {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </td>
                  <td className="p-4 font-medium text-ink">{formatBDT(o.total)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold capitalize",
                        o.status === "delivered"
                          ? "bg-success/10 text-success"
                          : o.status === "cancelled"
                            ? "bg-danger-soft text-danger"
                            : "bg-muted text-ink-soft",
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-muted"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
