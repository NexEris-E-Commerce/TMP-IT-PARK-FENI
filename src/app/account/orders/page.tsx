import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata = { title: "My Orders" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-brand-50 text-brand-700",
  processing: "bg-brand-50 text-brand-700",
  shipped: "bg-accent-50 text-accent-700",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger-soft text-danger",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/account" className="transition hover:text-brand-700">
          My Account
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">My Orders</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        My Orders
      </h1>

      {!orders?.length ? (
        <div className="mt-8 grid place-items-center rounded-3xl border border-line bg-surface px-6 py-20 text-center">
          <h2 className="font-display text-xl font-bold text-ink">No orders yet</h2>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            When you place an order, it&rsquo;ll show up here with live status.
          </p>
          <Button href="/shop" className="mt-6">
            Start Shopping
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">#{order.order_number}</p>
                  <p className="text-xs text-ink-dim">
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold capitalize",
                    STATUS_STYLES[order.status] ?? "bg-muted text-ink-soft",
                  )}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                {order.order_items?.map((item: { id: string; product_name: string; quantity: number; line_total: number }) => (
                  <li key={item.id} className="flex justify-between text-ink-soft">
                    <span>
                      {item.product_name} <span className="text-ink-dim">×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-ink">{formatBDT(item.line_total)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs font-medium text-ink-dim capitalize">
                  {order.payment_method === "cod" ? "Cash on Delivery" : "Paid Online"} ·{" "}
                  {order.payment_status}
                </span>
                <span className="text-base font-bold text-ink">{formatBDT(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
