import Link from "next/link";
import { Container } from "../ui/Container";
import { ChevronRight } from "../ui/icons";
import { ProductGrid } from "../product/ProductGrid";
import type { ShopQuery, ShopResult } from "@/lib/shop";
import { FilterPanel } from "./FilterPanel";
import { SortSelect } from "./SortSelect";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

type Crumb = { label: string; href: string };

/**
 * Catalog page shell: breadcrumb + header, desktop filter sidebar, sort +
 * active-filter toolbar, and the result grid. Server Component — it reads the
 * already-computed `result` and renders client "islands" (filters, sort, chips)
 * that only ever mutate the URL.
 */
export function CatalogView({
  title,
  subtitle,
  breadcrumbs = [],
  query,
  result,
  showCategories = true,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  query: ShopQuery;
  result: ShopResult;
  showCategories?: boolean;
}) {
  const { items, facets, total } = result;

  return (
    <Container className="py-8 lg:py-10">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm text-ink-dim"
      >
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        {breadcrumbs.map((c) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <ChevronRight size={14} />
            <Link href={c.href} className="transition hover:text-brand-700">
              {c.label}
            </Link>
          </span>
        ))}
        <ChevronRight size={14} />
        <span className="font-medium text-ink">{title}</span>
      </nav>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{subtitle}</p>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_1fr] xl:grid-cols-[16rem_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border border-line bg-surface p-5">
            <FilterPanel facets={facets} query={query} showCategories={showCategories} />
          </div>
        </aside>

        {/* Results column */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileFilterDrawer
                facets={facets}
                query={query}
                total={total}
                showCategories={showCategories}
              />
              <span className="text-sm text-ink-soft">
                <span className="font-semibold text-ink">{total}</span>{" "}
                {total === 1 ? "product" : "products"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-ink-dim sm:inline">Sort by</span>
              <SortSelect value={query.sort} />
            </div>
          </div>

          <div className="mt-4">
            <ActiveFilterChips query={query} />
          </div>

          <div className="mt-6">
            {items.length > 0 ? (
              <ProductGrid products={items} />
            ) : (
              <div className="grid place-items-center rounded-3xl border border-line bg-surface px-6 py-16 text-center">
                <h2 className="font-display text-xl font-bold text-ink">
                  No matching products
                </h2>
                <p className="mt-2 max-w-sm text-sm text-ink-soft">
                  Try widening your price range or clearing some filters.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Reset filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
