import { ContentPage } from "@/components/layout/ContentPage";
import { site } from "@/lib/site";

export const metadata = { title: "Terms & Conditions" };

const sections = [
  {
    h: "1. Acceptance of Terms",
    p: `By accessing or using the ${site.fullName} website and placing an order with us, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.`,
  },
  {
    h: "2. Products & Pricing",
    p: "We strive to display accurate pricing, images and specifications for every product. Prices are shown in Bangladeshi Taka (BDT) and may change without prior notice. In the rare event of a pricing or listing error, we reserve the right to cancel and refund affected orders.",
  },
  {
    h: "3. Orders & Payment",
    p: "Orders are confirmed once payment is completed (for online payment) or once we call to confirm (for Cash on Delivery). We reserve the right to refuse or cancel any order due to stock unavailability, pricing errors, or suspected fraud.",
  },
  {
    h: "4. Delivery",
    p: "Delivery timelines shown at checkout are estimates, not guarantees. Delays due to courier issues, weather, or circumstances outside our control may occasionally occur — see our Shipping Policy for details.",
  },
  {
    h: "5. Warranty",
    p: "Warranty terms vary by product and manufacturer, as stated on each product page. Warranty claims are subject to the manufacturer's or brand's terms and require proof of purchase.",
  },
  {
    h: "6. Returns",
    p: "Returns and exchanges are handled per our Return Policy. Products damaged through misuse, physical damage, or missing accessories/packaging may not be eligible for return.",
  },
  {
    h: "7. Account Responsibility",
    p: "If you create an account, you're responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
  },
  {
    h: "8. Limitation of Liability",
    p: `${site.fullName} is not liable for indirect, incidental, or consequential damages arising from the use of our products or website, to the maximum extent permitted by law.`,
  },
  {
    h: "9. Changes to Terms",
    p: "We may update these Terms from time to time. Continued use of our website after changes constitutes acceptance of the revised Terms.",
  },
  {
    h: "10. Contact",
    p: `Questions about these Terms? Reach us at ${site.email} or ${site.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <ContentPage title="Terms & Conditions" subtitle="Last updated: August 2026">
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="font-display text-base font-bold text-ink">{s.h}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.p}</p>
        </section>
      ))}
    </ContentPage>
  );
}
