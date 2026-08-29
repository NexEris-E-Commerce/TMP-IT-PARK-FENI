import { ContentPage } from "@/components/layout/ContentPage";
import { site } from "@/lib/site";

export const metadata = { title: "Privacy Policy" };

const sections = [
  {
    h: "1. Information We Collect",
    p: "When you create an account, place an order, or contact us, we collect information such as your name, phone number, email, delivery address, and order history. We do not store full payment card details — those are handled securely by our payment gateway partner (SSLCommerz).",
  },
  {
    h: "2. How We Use Your Information",
    p: "We use your information to process orders, arrange delivery, provide customer support, send order updates, and improve our products and services. We do not sell your personal information to third parties.",
  },
  {
    h: "3. Payment Security",
    p: "Online payments are processed through SSLCommerz, a licensed payment service provider. Your card and mobile banking details are handled directly by SSLCommerz and are never stored on our servers.",
  },
  {
    h: "4. Cookies",
    p: "We use browser storage (such as your cart and wishlist contents) to make shopping easier. This data stays on your device and is not used for cross-site tracking or advertising.",
  },
  {
    h: "5. Data Sharing",
    p: "We share order details with our delivery/courier partners only as needed to fulfil your order. We may disclose information if required by law.",
  },
  {
    h: "6. Your Rights",
    p: `You can request to view, update, or delete your account information at any time by contacting us at ${site.email}.`,
  },
  {
    h: "7. Data Security",
    p: "We use industry-standard security practices, including encrypted connections and access-controlled databases, to protect your information.",
  },
  {
    h: "8. Changes to This Policy",
    p: "We may update this Privacy Policy periodically. Significant changes will be reflected on this page with an updated date.",
  },
];

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" subtitle="Last updated: August 2026">
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="font-display text-base font-bold text-ink">{s.h}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.p}</p>
        </section>
      ))}
    </ContentPage>
  );
}
