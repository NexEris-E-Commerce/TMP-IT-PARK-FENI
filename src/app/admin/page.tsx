import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatBDT } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: orderCount },
    { count: pendingCount },
    { data: revenueRows },
    { count: productCount },
    { count: lowStockCount },
    { count: messageCount },
    { data: userList },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total").eq("payment_status", "paid"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", 3),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.auth.admin.listUsers({ perPage: 1 }),
  ]);

  const revenue = (revenueRows ?? []).reduce((sum, r) => sum + (r.total ?? 0), 0);

  const stats = [
    { label: "Total Orders", value: orderCount ?? 0, href: "/admin/orders" },
    { label: "Pending Orders", value: pendingCount ?? 0, href: "/admin/orders?status=pending" },
    { label: "Paid Revenue", value: formatBDT(revenue), href: "/admin/orders" },
    { label: "Products", value: productCount ?? 0, href: "/admin/products" },
    { label: "Low Stock", value: lowStockCount ?? 0, href: "/admin/products?filter=low-stock" },
    { label: "Customers", value: userList && "total" in userList ? userList.total : 0, href: "/admin/customers" },
    { label: "New Messages", value: messageCount ?? 0, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">A quick look at how the store is doing.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-line bg-surface p-5 transition hover:border-brand-200 hover:shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-dim">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-ink">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
