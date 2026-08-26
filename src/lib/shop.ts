/**
 * Shop query model + filtering/sorting engine.
 *
 * The URL search params are the single source of truth for the catalog view:
 * the shop page (a Server Component) parses them with `parseShopQuery`, runs
 * `runShopQuery` server-side, and passes the result down. Client controls only
 * ever mutate the URL. In Phase 4 `runShopQuery` becomes a DB query with the
 * same signature.
 */
import type { Product } from "./types";
import { discountPercent, stockState } from "./types";
import { products as allProducts } from "./data/products";
import { brandName } from "./data/brands";

export type SortKey =
  | "featured"
  | "popular"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

export const DEFAULT_SORT: SortKey = "featured";

export interface ShopQuery {
  category?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  minRating?: number;
  sort: SortKey;
  q?: string;
}

export interface FacetValue {
  slug: string;
  label: string;
  count: number;
}

export interface Facets {
  brands: FacetValue[];
  priceMin: number;
  priceMax: number;
}

export interface ShopResult {
  items: Product[];
  facets: Facets;
  /** Count after all refinements are applied. */
  total: number;
  /** Count within the category/search scope, before refinements. */
  scopeTotal: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function firstStr(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function numParam(v: string | string[] | undefined): number | undefined {
  const s = firstStr(v);
  if (s == null || s.trim() === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

/** Normalize raw Next.js search params into a typed, validated query. */
export function parseShopQuery(sp: RawParams): ShopQuery {
  const rawBrand = sp.brand;
  let brands: string[] = [];
  if (Array.isArray(rawBrand)) brands = rawBrand.flatMap((s) => s.split(","));
  else if (typeof rawBrand === "string") brands = rawBrand.split(",");
  brands = [...new Set(brands.map((s) => s.trim()).filter(Boolean))];

  const sortRaw = firstStr(sp.sort);
  const sort: SortKey = SORT_OPTIONS.some((o) => o.value === sortRaw)
    ? (sortRaw as SortKey)
    : DEFAULT_SORT;

  const ratingRaw = numParam(sp.rating);
  const minRating = ratingRaw && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : undefined;

  return {
    category: firstStr(sp.category)?.trim() || undefined,
    brands,
    minPrice: numParam(sp.min),
    maxPrice: numParam(sp.max),
    inStock: firstStr(sp.stock) === "in",
    minRating,
    sort,
    q: firstStr(sp.q)?.trim() || undefined,
  };
}

/** True when any *refinement* (not category/search/sort) is active. */
export function hasActiveFilters(q: ShopQuery): boolean {
  return (
    q.brands.length > 0 ||
    q.minPrice != null ||
    q.maxPrice != null ||
    q.inStock ||
    q.minRating != null
  );
}

/** Number of active refinements — shown as a badge on the mobile filter button. */
export function activeFilterCount(q: ShopQuery): number {
  return (
    q.brands.length +
    (q.minPrice != null || q.maxPrice != null ? 1 : 0) +
    (q.inStock ? 1 : 0) +
    (q.minRating != null ? 1 : 0)
  );
}

function matchesSearch(p: Product, q: string): boolean {
  const hay = `${p.name} ${p.keySpec ?? ""} ${brandName(p.brand)} ${p.category}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

function computeFacets(scope: Product[]): Facets {
  const counts = new Map<string, number>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of scope) {
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    if (p.price < priceMin) priceMin = p.price;
    if (p.price > priceMax) priceMax = p.price;
  }
  const brands = [...counts.entries()]
    .map(([slug, count]) => ({ slug, label: brandName(slug), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  if (!scope.length) {
    priceMin = 0;
    priceMax = 0;
  }
  return { brands, priceMin: Math.floor(priceMin), priceMax: Math.ceil(priceMax) };
}

function sortProducts(items: Product[], sort: SortKey): Product[] {
  const arr = [...items];
  const byRating = (a: Product, b: Product) =>
    (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort(byRating);
    case "discount":
      return arr.sort((a, b) => discountPercent(b) - discountPercent(a) || byRating(a, b));
    case "popular":
      return arr.sort(
        (a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller) || byRating(a, b),
      );
    case "featured":
    default:
      return arr.sort(
        (a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || byRating(a, b),
      );
  }
}

/**
 * Filter + sort the catalog for a query. Facets (brand counts, price bounds)
 * are computed from the category/search *scope* so they reflect the current
 * context but don't collapse as the user ticks brand boxes.
 */
export function runShopQuery(
  query: ShopQuery,
  source: Product[] = allProducts,
): ShopResult {
  let scope = source;
  if (query.category) scope = scope.filter((p) => p.category === query.category);
  if (query.q) scope = scope.filter((p) => matchesSearch(p, query.q as string));

  const facets = computeFacets(scope);

  let items = scope;
  if (query.brands.length) items = items.filter((p) => query.brands.includes(p.brand));
  if (query.minPrice != null) items = items.filter((p) => p.price >= (query.minPrice as number));
  if (query.maxPrice != null) items = items.filter((p) => p.price <= (query.maxPrice as number));
  if (query.inStock) items = items.filter((p) => stockState(p) !== "out");
  if (query.minRating != null)
    items = items.filter((p) => (p.rating ?? 0) >= (query.minRating as number));

  items = sortProducts(items, query.sort);

  return { items, facets, total: items.length, scopeTotal: scope.length };
}
