import { ContentPage } from "@/components/layout/ContentPage";
import { Check, Close } from "@/components/ui/icons";
import { site } from "@/lib/site";

export const metadata = { title: "Return Policy" };

const eligible = [
  "Item is unused, in original condition and packaging",
  "All accessories, manuals, and freebies are included",
  "Return requested within 7 days of delivery",
  "Product is defective, damaged in transit, or not as described",
];

const notEligible = [
  "Physical or liquid damage caused after delivery",
  "Missing original packaging, invoice, or accessories",
  "Software, activated licenses, or opened consumables",
  "Custom-built PCs after assembly (individual defective parts are still covered by warranty)",
];

export default function ReturnPolicyPage() {
  return (
    <ContentPage title="Return Policy" subtitle="Simple 7-day returns on eligible products.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-success/10 text-success">
              <Check size={14} />
            </span>
            Eligible for Return
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {eligible.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-success">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-danger-soft text-danger">
              <Close size={14} />
            </span>
            Not Eligible
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {notEligible.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-danger">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section>
        <h2 className="font-display text-base font-bold text-ink">How to Return an Item</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>
            Contact us at {site.phone} or {site.email} with your order number within 7 days of delivery.
          </li>
          <li>We&rsquo;ll confirm eligibility and arrange pickup or ask you to bring it to a showroom.</li>
          <li>Once inspected and approved, we process a refund or exchange within 3–5 business days.</li>
        </ol>
      </section>

      <section>
        <h2 className="font-display text-base font-bold text-ink">Refunds</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Refunds for online payments are returned to the original payment method via SSLCommerz.
          Cash on Delivery orders are refunded via bKash/Nagad transfer or store credit, whichever
          you prefer.
        </p>
      </section>
    </ContentPage>
  );
}
