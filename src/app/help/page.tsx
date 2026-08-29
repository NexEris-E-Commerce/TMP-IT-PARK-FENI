import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { site } from "@/lib/site";
import { formatPhone } from "@/lib/format";
import { ReturnBox, Truck, ShieldCheck, CreditCard, Headset, ArrowRight } from "@/components/ui/icons";

export const metadata = { title: "Help Center" };

const topics = [
  { href: "/account/orders", title: "Track My Order", desc: "Check the live status of your order.", icon: ReturnBox },
  { href: "/shipping-policy", title: "Shipping Info", desc: "Delivery zones, fees and timelines.", icon: Truck },
  { href: "/return-policy", title: "Returns & Refunds", desc: "How to return or exchange a product.", icon: ReturnBox },
  { href: "/warranty", title: "Warranty Claims", desc: "How manufacturer warranty works.", icon: ShieldCheck },
  { href: "/payment-methods", title: "Payment Methods", desc: "COD, bKash, Nagad, Rocket & cards.", icon: CreditCard },
  { href: "/faq", title: "FAQ", desc: "Answers to common questions.", icon: Headset },
];

export default function HelpPage() {
  return (
    <ContentPage title="Help Center" subtitle="Find answers fast, or reach our team directly.">
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <t.icon size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{t.title}</p>
                <p className="text-xs text-ink-dim">{t.desc}</p>
              </div>
            </div>
            <ArrowRight size={16} className="shrink-0 text-ink-dim" />
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-brand-50/60 p-5">
        <h2 className="font-display text-base font-bold text-ink">Still need help?</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Call us at{" "}
          <a href={`tel:${site.phone}`} className="font-semibold text-brand-700 hover:underline">
            {formatPhone(site.phone)}
          </a>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
            send us a message
          </Link>{" "}
          — we usually reply within a few hours.
        </p>
      </section>
    </ContentPage>
  );
}
