import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatBDT } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { cn } from "@/lib/cn";

export const metadata = { title: "Orders" };

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">{orders?.length ?? 0} order{orders?.length === 1 ? "" : "s"}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            !status ? "bg-brand-600 text-white" : "bg-muted text-ink-soft hover:bg-line",
          )}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
              status === s ? "bg-brand-600 text-white" : "bg-muted text-ink-soft hover:bg-line",
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-dim">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {!orders?.length ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-ink-dim">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="p-4">
                    <p className="font-semibold text-ink">#{o.order_number}</p>
                    <p className="text-xs text-ink-dim">
                      {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-ink">{o.full_name}</p>
                    <p className="text-xs text-ink-dim">{o.phone}</p>
                  </td>
                  <td className="p-4 font-medium text-ink">{formatBDT(o.total)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold capitalize",
                        o.payment_status === "paid"
                          ? "bg-success/10 text-success"
                          : o.payment_status === "failed"
                            ? "bg-danger-soft text-danger"
                            : "bg-muted text-ink-soft",
                      )}
                    >
                      {o.payment_method === "cod" ? "COD" : "Online"} · {o.payment_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
