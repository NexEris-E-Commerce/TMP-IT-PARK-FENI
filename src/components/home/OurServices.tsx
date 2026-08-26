import Link from "next/link";
import { services } from "@/lib/site";
import type { ServiceItem } from "@/lib/types";
import { CategoryIcon } from "../ui/CategoryIcon";
import { ShieldCheck, ArrowRight } from "../ui/icons";
import { SectionHeading } from "./SectionHeading";

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

export function OurServices() {
  return (
    <section>
      <SectionHeading
        eyebrow="Beyond the Sale"
        title="Our Services"
        subtitle="A complete IT partner — we build, fix, connect and maintain."
        actionHref="/services"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services#${s.slug}`}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 transition group-hover:bg-brand-100">
              <ServiceGlyph icon={s.icon} />
            </span>
            <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
            <p className="mt-1 flex-1 text-sm text-ink-soft">{s.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
              Learn more
              <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
