import Link from "next/link";
import { dealProducts } from "@/lib/data/products";
import { getAllProducts } from "@/lib/products-repo";
import { ProductGrid } from "../product/ProductGrid";
import { Countdown } from "./Countdown";
import { ArrowRight } from "../ui/icons";

export async function DealsOfDay() {
  const allProducts = await getAllProducts();
  const items = dealProducts(8, allProducts);
  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl border border-line bg-gradient-to-br from-brand-50/70 via-surface to-accent-50/60 p-5 sm:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-danger">
            🔥 Hot Deals
          </p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Deals of the Day
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Limited-time prices — grab them before they’re gone.</p>
        </div>
        <div className="flex items-center gap-5">
          <Countdown />
          <Link
            href="/deals"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800 md:inline-flex"
          >
            View All
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      <ProductGrid products={items} />
    </section>
  );
}
