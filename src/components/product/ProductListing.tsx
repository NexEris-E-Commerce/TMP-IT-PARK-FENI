import Link from "next/link";
import type { Product } from "@/lib/types";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ProductGrid } from "./ProductGrid";
import { ChevronRight } from "../ui/icons";

type Crumb = { label: string; href: string };

/**
 * Shared catalog listing (Shop, Deals, Brand, Search). Phase 2 layers on
 * filters, sort and pagination; the grid + header contract stays the same.
 */
export function ProductListing({
  title,
  subtitle,
  products,
  breadcrumbs = [],
  emptyMessage = "No products found. Try a different category or search term.",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  breadcrumbs?: Crumb[];
  emptyMessage?: string;
}) {
  return (
    <Container className="py-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-dim">
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

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        <span className="text-sm text-ink-soft">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="mt-6">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="grid place-items-center rounded-3xl border border-line bg-surface px-6 py-16 text-center">
            <h2 className="font-display text-xl font-bold text-ink">Nothing here yet</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">{emptyMessage}</p>
            <div className="mt-5">
              <Button href="/shop">Browse all products</Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
