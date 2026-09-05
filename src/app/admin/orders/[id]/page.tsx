import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatBDT } from "@/lib/format";
import { ChevronRight, Download } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { PaymentStatusSelect } from "@/components/admin/PaymentStatusSelect";

export const metadata = { title: "Order Detail" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: order } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).single();

  if (!order) notFound();

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/admin/orders" className="transition hover:text-brand-700">
          Orders
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">#{order.order_number}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Order #{order.order_number}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button href={`/api/orders/${order.id}/invoice`} variant="outline" size="sm">
            <Download size={15} />
            Download Invoice
          </Button>
          <OrderStatusSelect orderId={order.id} status={order.status} />
          <PaymentStatusSelect orderId={order.id} status={order.payment_status} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-ink">Items</h2>
            <ul className="mt-3 divide-y divide-line">
              {order.order_items?.map((item: { id: string; product_name: string; product_slug: string; quantity: number; unit_price: number; line_total: number }) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/product/${item.product_slug}`} className="text-sm font-semibold text-ink hover:text-brand-700">
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-ink-dim">
                      {formatBDT(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-ink">{formatBDT(item.line_total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span>{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span>{formatBDT(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink">
                <span>Total</span>
                <span>{formatBDT(order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
              <h2 className="font-display text-base font-bold text-ink">Notes</h2>
              <p className="mt-2 text-sm text-ink-soft">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-base font-bold text-ink">Delivery Details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Name" value={order.full_name} />
              <Row label="Phone" value={order.phone} />
              {order.guest_email && <Row label="Email" value={order.guest_email} />}
              <Row label="Address" value={order.address_line} />
              {order.city && <Row label="City" value={order.city} />}
              <Row label="Zone" value={order.zone_id} />
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-base font-bold text-ink">Payment</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Method" value={order.payment_method === "cod" ? "Cash on Delivery" : "Online (SSLCommerz)"} />
              <Row label="Status" value={order.payment_status} />
              {order.sslcommerz_val_id && <Row label="Validation ID" value={order.sslcommerz_val_id} />}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-dim">{label}</dt>
      <dd className="text-right font-medium capitalize text-ink">{value}</dd>
    </div>
  );
}
