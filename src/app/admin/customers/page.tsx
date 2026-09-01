import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatBDT } from "@/lib/format";
import { AdminToggleSwitch } from "@/components/admin/AdminToggleSwitch";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const supabase = createAdminClient();

  const [{ data: userList }, { data: profiles }, { data: orders }] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 200 }),
    supabase.from("profiles").select("id, full_name, phone, is_admin"),
    supabase.from("orders").select("user_id, total"),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const statsByUser = new Map<string, { count: number; total: number }>();
  for (const o of orders ?? []) {
    if (!o.user_id) continue;
    const prev = statsByUser.get(o.user_id) ?? { count: 0, total: 0 };
    statsByUser.set(o.user_id, { count: prev.count + 1, total: prev.total + (o.total ?? 0) });
  }

  const customers = (userList?.users ?? [])
    .map((u) => {
      const profile = profileById.get(u.id);
      const stats = statsByUser.get(u.id) ?? { count: 0, total: 0 };
      return {
        id: u.id,
        email: u.email ?? "—",
        name: profile?.full_name || (u.user_metadata?.full_name as string) || "—",
        phone: profile?.phone || "—",
        isAdmin: profile?.is_admin ?? false,
        joinedAt: u.created_at,
        orderCount: stats.count,
        totalSpent: stats.total,
      };
    })
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Customers</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {customers.length} registered customer{customers.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-dim">
              <th className="p-4">Customer</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Admin</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-ink-dim">
                  No registered customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="p-4">
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-ink-dim">{c.email}</p>
                    {c.phone !== "—" && <p className="text-xs text-ink-dim">{c.phone}</p>}
                  </td>
                  <td className="p-4 text-ink-soft">
                    {new Date(c.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-4 font-medium text-ink">{c.orderCount}</td>
                  <td className="p-4 font-medium text-ink">{formatBDT(c.totalSpent)}</td>
                  <td className="p-4">
                    <AdminToggleSwitch userId={c.id} isAdmin={c.isAdmin} />
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-muted"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
