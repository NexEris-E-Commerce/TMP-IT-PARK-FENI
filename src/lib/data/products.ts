import type { Product } from "../types";

/**
 * Intentionally empty. All real product data lives in Supabase (see
 * `src/lib/products-repo.ts`) — manage products from /admin or the
 * Supabase Table Editor. This file only exists so `shop.ts` and
 * `pc-builder.ts` have a safe empty default for their `source` parameter;
 * it is never shown to shoppers.
 */
export const products: Product[] = [];

// ───────────────────────── Query helpers ─────────────────────────
// Each accepts an optional `source` array (defaults to the static demo
// catalog). Pages fetch live products from Supabase via
// `src/lib/products-repo.ts` and pass them in here, so the exact same
// derivation logic works whether the source is the static seed data or
// the real database.

export function getProduct(slug: string, source: Product[] = products): Product | undefined {
  return source.find((p) => p.slug === slug);
}

export function productsByCategory(categorySlug: string, source: Product[] = products): Product[] {
  return source.filter((p) => p.category === categorySlug);
}

export function featuredProducts(limit?: number, source: Product[] = products): Product[] {
  const list = source.filter((p) => p.isFeatured);
  return limit ? list.slice(0, limit) : list;
}

export function bestSellers(limit?: number, source: Product[] = products): Product[] {
  const list = source.filter((p) => p.isBestSeller);
  return limit ? list.slice(0, limit) : list;
}

export function dealProducts(limit?: number, source: Product[] = products): Product[] {
  const list = source.filter((p) => p.isDeal);
  return limit ? list.slice(0, limit) : list;
}

export function relatedProducts(product: Product, limit = 4, source: Product[] = products): Product[] {
  return source
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
