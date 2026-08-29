import { ContentPage } from "@/components/layout/ContentPage";
import { site } from "@/lib/site";
import { ShieldCheck } from "@/components/ui/icons";

export const metadata = { title: "Warranty Information" };

const tiers = [
  { title: "Laptops & Desktops", period: "2–3 Years Official Warranty", note: "Covers manufacturing defects and hardware failure under normal use." },
  { title: "Processors, Motherboards, RAM", period: "3 Years – Lifetime", note: "Varies by brand; RAM from Corsair/Kingston often carries lifetime warranty." },
  { title: "Storage (SSD/HDD)", period: "3–5 Years", note: "Covers drive failure; does not cover data loss — always keep backups." },
  { title: "Monitors & Printers", period: "1–2 Years", note: "Covers panel defects, dead pixels beyond brand threshold, and hardware faults." },
  { title: "Accessories", period: "6 Months – 1 Year", note: "Keyboards, mice, headsets and similar peripherals." },
];

export default function WarrantyPage() {
  return (
    <ContentPage title="Warranty Information" subtitle="Every product we sell is genuine and backed by official warranty.">
      <section>
        <h2 className="font-display text-base font-bold text-ink">Typical Warranty Periods</h2>
        <div className="mt-3 grid gap-3">
          {tiers.map((t) => (
            <div key={t.title} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">
                  {t.title} — <span className="text-brand-700">{t.period}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-dim">
          Exact warranty duration is always shown on the individual product page — the above are typical ranges.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-bold text-ink">Claiming Warranty</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>Bring the product, original box/accessories, and your invoice or order number to either showroom.</li>
          <li>Our team inspects the issue and confirms whether it&rsquo;s covered under warranty.</li>
          <li>Covered products are repaired or replaced via the brand&rsquo;s official service center — we coordinate this for you.</li>
          <li>Turnaround time depends on the brand&rsquo;s service center, typically 3–14 days.</li>
        </ol>
      </section>

      <section>
        <h2 className="font-display text-base font-bold text-ink">What&rsquo;s Not Covered</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Physical damage, liquid damage, unauthorized repairs, software issues, and normal wear and tear are typically
          not covered by manufacturer warranty. Our team can still advise on paid repair options in these cases.
        </p>
      </section>

      <p className="text-sm text-ink-soft">
        Questions about a specific product&rsquo;s warranty? Call us at{" "}
        <a href={`tel:${site.phone}`} className="font-semibold text-brand-700 hover:underline">
          {site.phone}
        </a>
        .
      </p>
    </ContentPage>
  );
}
