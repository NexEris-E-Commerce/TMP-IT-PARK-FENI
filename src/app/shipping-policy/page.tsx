import { ContentPage } from "@/components/layout/ContentPage";
import { DELIVERY_ZONES, FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";
import { formatBDT } from "@/lib/format";
import { Truck } from "@/components/ui/icons";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <ContentPage title="Shipping Policy" subtitle="Where we deliver, how long it takes, and what it costs.">
      <section>
        <h2 className="font-display text-base font-bold text-ink">Delivery Zones & Fees</h2>
        <div className="mt-3 grid gap-3">
          {DELIVERY_ZONES.map((z) => (
            <div key={z.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Truck size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">
                    {z.label} <span className="text-ink-dim">· {z.labelBn}</span>
                  </p>
                  <p className="text-xs text-ink-dim">Estimated delivery: {z.eta}</p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-bold text-ink">{formatBDT(z.fee)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
          Free delivery on all orders above {formatBDT(FREE_DELIVERY_THRESHOLD)}, regardless of zone.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-bold text-ink">How Delivery Works</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>Place your order and choose Cash on Delivery or online payment at checkout.</li>
          <li>We call to confirm your order and delivery address, usually within a few hours.</li>
          <li>Your order ships via our delivery team (Feni) or courier partner (nationwide).</li>
          <li>Track order status anytime from My Account → My Orders.</li>
        </ol>
      </section>

      <section>
        <h2 className="font-display text-base font-bold text-ink">Delays & Issues</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Estimated delivery times can occasionally shift due to weather, courier disruptions, or high
          order volume during sales. If your order is significantly delayed, contact us and we&rsquo;ll
          look into it right away.
        </p>
      </section>
    </ContentPage>
  );
}
