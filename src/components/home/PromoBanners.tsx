import Link from "next/link";
import { CategoryIcon } from "../ui/CategoryIcon";
import { Wrench, ArrowRight } from "../ui/icons";

export function PromoBanners() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {/* PC Builder */}
      <Link
        href="/pc-builder"
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white transition hover:shadow-lift"
      >
        <CategoryIcon
          icon="components"
          size={120}
          strokeWidth={1}
          className="pointer-events-none absolute -right-4 -top-4 text-white/15"
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">Free Tool</p>
          <h3 className="mt-1 font-display text-xl font-extrabold">Custom PC Builder</h3>
          <p className="mt-1 max-w-[16rem] text-sm text-white/80">
            Pick parts, check compatibility, see the total instantly.
          </p>
        </div>
        <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold">
          Start Building
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </span>
      </Link>

      {/* Deals */}
      <Link
        href="/deals"
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-accent-600 to-accent-800 p-6 text-white transition hover:shadow-lift"
      >
        <span className="pointer-events-none absolute -right-3 -top-8 font-display text-[140px] font-extrabold leading-none text-white/10">
          %
        </span>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">Save Big</p>
          <h3 className="mt-1 font-display text-xl font-extrabold">Deals up to 20% Off</h3>
          <p className="mt-1 max-w-[16rem] text-sm text-white/80">
            Fresh offers on laptops, components & accessories every day.
          </p>
        </div>
        <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold">
          Shop Deals
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </span>
      </Link>

      {/* Services */}
      <Link
        href="/services"
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-brand-900 p-6 text-white transition hover:shadow-lift"
      >
        <Wrench
          size={120}
          className="pointer-events-none absolute -right-4 -bottom-6 text-white/10"
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">Expert Team</p>
          <h3 className="mt-1 font-display text-xl font-extrabold">IT Services & Repair</h3>
          <p className="mt-1 max-w-[16rem] text-sm text-white/80">
            Assembly, laptop service, networking & annual maintenance.
          </p>
        </div>
        <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold">
          Explore Services
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  );
}
