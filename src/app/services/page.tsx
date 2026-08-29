import { ContentPage } from "@/components/layout/ContentPage";
import { services, site } from "@/lib/site";
import type { ServiceItem } from "@/lib/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ShieldCheck } from "@/components/ui/icons";

export const metadata = { title: "Our Services" };

const details: Record<string, string[]> = {
  "computer-assembly": [
    "Custom PC builds for gaming, editing, or everyday use — compatible parts hand-picked with you.",
    "Professional cable management and thermal setup for quiet, reliable performance.",
    "Free basic OS installation and driver setup on request.",
  ],
  "laptop-service": [
    "Diagnosis and repair for hardware faults: screen, battery, keyboard, motherboard and more.",
    "Software troubleshooting, OS reinstalls, and virus/malware cleanup.",
    "Genuine parts sourced directly from authorized distributors wherever possible.",
  ],
  "networking-solution": [
    "Home and office Wi-Fi setup, router configuration, and dead-zone fixes.",
    "Structured cabling and switch setup for small business networks.",
    "CCTV and access-point installation on request.",
  ],
  "amc-service": [
    "Scheduled maintenance visits to keep office systems running smoothly.",
    "Priority support and discounted repair rates for AMC customers.",
    "Custom AMC packages for businesses of any size — ask our team for a quote.",
  ],
};

function ServiceGlyph({ icon }: { icon: ServiceItem["icon"] }) {
  const cls = "text-brand-600";
  switch (icon) {
    case "assembly":
      return <CategoryIcon icon="desktop" size={26} className={cls} />;
    case "repair":
      return <CategoryIcon icon="laptop" size={26} className={cls} />;
    case "network":
      return <CategoryIcon icon="networking" size={26} className={cls} />;
    case "amc":
      return <ShieldCheck size={26} className={cls} />;
  }
}

export default function ServicesPage() {
  return (
    <ContentPage title="Our Services" subtitle="A complete IT partner — we build, fix, connect and maintain.">
      {services.map((s) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50">
              <ServiceGlyph icon={s.icon} />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">{s.title}</h2>
              <p className="text-sm text-ink-soft">{s.description}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 pl-1 text-sm text-ink-soft">
            {(details[s.slug] ?? []).map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-brand-600">•</span> {line}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-sm text-ink-soft">
        Ready to get started? Call {site.phone} or visit either showroom — no appointment needed for most services.
      </p>
    </ContentPage>
  );
}
