import { ContentPage } from "@/components/layout/ContentPage";
import { CreditCard } from "@/components/ui/icons";

export const metadata = { title: "Payment Methods" };

const methods = [
  { title: "Cash on Delivery", note: "Pay in cash when your order arrives at your doorstep. Available on all orders, all zones." },
  { title: "bKash", note: "Pay securely via bKash at checkout, powered by our SSLCommerz payment gateway." },
  { title: "Nagad", note: "Pay via Nagad Personal or Nagad account at checkout." },
  { title: "Rocket", note: "Pay via Rocket (DBBL Mobile Banking) at checkout." },
  { title: "Visa / Mastercard", note: "Pay by debit or credit card through our secure payment gateway." },
  { title: "In-Store", note: "Pay by cash or card when you collect from either showroom." },
];

export default function PaymentMethodsPage() {
  return (
    <ContentPage title="Payment Methods" subtitle="Choose whichever payment method is easiest for you.">
      <div className="grid gap-3 sm:grid-cols-2">
        {methods.map((m) => (
          <div key={m.title} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <CreditCard size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{m.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{m.note}</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-display text-base font-bold text-ink">Is Online Payment Secure?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Yes. All online payments are processed through SSLCommerz, a PCI-DSS compliant payment
          gateway licensed by Bangladesh Bank. Your card and mobile banking details are never
          stored on our servers — they&rsquo;re handled entirely by the payment gateway.
        </p>
      </section>
    </ContentPage>
  );
}
