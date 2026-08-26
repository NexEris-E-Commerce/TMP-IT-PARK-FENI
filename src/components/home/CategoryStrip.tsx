import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { CategoryIcon } from "../ui/CategoryIcon";
import { SectionHeading } from "./SectionHeading";

export function CategoryStrip() {
  return (
    <section>
      <SectionHeading
        eyebrow="Browse"
        title="Shop by Category"
        subtitle="Everything for your setup — from core components to complete machines."
        actionHref="/shop"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-center transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 transition group-hover:from-brand-600 group-hover:to-accent-600 group-hover:text-white">
              <CategoryIcon icon={cat.icon} size={26} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink">{cat.name}</span>
              <span className="mt-0.5 block text-[11px] text-ink-dim">
                {cat.productCount}+ items
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
