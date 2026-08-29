import { ContentPage } from "@/components/layout/ContentPage";
import { Accordion } from "@/components/layout/Accordion";
import { site } from "@/lib/site";

export const metadata = { title: "Frequently Asked Questions" };

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse the shop, add products to your cart, then go to checkout. Fill in your delivery details, choose Cash on Delivery or online payment (bKash/Nagad/Rocket/card), and place your order. You'll get an order number to track it.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery is available everywhere we deliver. We also accept bKash, Nagad, Rocket and cards through our secure payment gateway. You can pay in person too if you collect from either showroom.",
  },
  {
    q: "How long does delivery take?",
    a: "Inside Feni Sadar, orders typically arrive within the same or next day. Feni district takes 1–2 days, and nationwide delivery via courier takes 2–4 days depending on your location.",
  },
  {
    q: "Is delivery free?",
    a: `Yes — orders above ৳5,000 get free delivery. Below that, a small delivery fee applies based on your zone, shown at checkout before you pay.`,
  },
  {
    q: "Can I return or exchange a product?",
    a: "Yes, most products can be returned within 7 days of delivery if unused, in original packaging, with all accessories. See our Return Policy page for full details and exceptions.",
  },
  {
    q: "Do products come with warranty?",
    a: "Yes — nearly every product we sell carries an official manufacturer or brand warranty, shown on each product page. We also help facilitate warranty claims through our showroom.",
  },
  {
    q: "Can I track my order?",
    a: "Yes, once logged in, go to My Account → My Orders to see live status. We'll also call you to confirm delivery details after you place an order.",
  },
  {
    q: "Do you offer PC building services?",
    a: "Absolutely — use our PC Builder tool to pick compatible parts, or visit either showroom and our technicians will help you build a custom PC for gaming, work or general use.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage title="Frequently Asked Questions" subtitle="Quick answers to what customers ask us most.">
      <Accordion items={faqs} />
      <p className="text-sm text-ink-soft">
        Didn&rsquo;t find what you needed? Call us at{" "}
        <a href={`tel:${site.phone}`} className="font-semibold text-brand-700 hover:underline">
          {site.phone}
        </a>{" "}
        or visit our Contact page.
      </p>
    </ContentPage>
  );
}
