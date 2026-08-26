/**
 * Core domain types for the IT PARK FENI storefront.
 *
 * NOTE: These types describe the *shape* the UI consumes. In Phase 4 they will
 * be produced by the Prisma/PostgreSQL layer instead of the seed modules in
 * `src/lib/data`, but the UI contract stays the same.
 */

export type IconKey =
  | "laptop"
  | "desktop"
  | "gaming"
  | "components"
  | "monitor"
  | "printer"
  | "networking"
  | "accessories"
  | "grid";

export interface Category {
  slug: string;
  name: string;
  /** Optional Bangla label for bilingual display. */
  nameBn?: string;
  icon: IconKey;
  /** Short blurb used on category landing pages. */
  tagline?: string;
  productCount?: number;
}

export interface Brand {
  slug: string;
  name: string;
  /** Short label used inside the monogram logo tile. */
  mark?: string;
  /** Accent color used for the brand tile. */
  color?: string;
  enabled?: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string; // brand slug
  category: string; // category slug
  /** Optional real image path under /public. Falls back to a generated tile. */
  image?: string;
  /** Current selling price in BDT. */
  price: number;
  /** Original price in BDT (present when discounted). */
  regularPrice?: number;
  rating?: number; // 0–5, from real reviews only
  reviewCount?: number;
  stock: number;
  lowStockThreshold?: number;
  /** One-line headline spec shown on the card. */
  keySpec?: string;
  specs?: ProductSpec[];
  warranty?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isDeal?: boolean;
  /** ISO timestamp; drives the Deals-of-the-Day countdown when set. */
  dealEndsAt?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Highlighted call-to-action styling (e.g. Today's Offers). */
  highlight?: boolean;
}

export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: "assembly" | "repair" | "network" | "amc";
}

export interface Usp {
  title: string;
  description: string;
  icon: "delivery" | "payment" | "return" | "support";
}

/** Discount percentage helper derived from regular vs. selling price. */
export function discountPercent(p: Pick<Product, "price" | "regularPrice">): number {
  if (!p.regularPrice || p.regularPrice <= p.price) return 0;
  return Math.round(((p.regularPrice - p.price) / p.regularPrice) * 100);
}

export type StockState = "in" | "low" | "out";

export function stockState(p: Pick<Product, "stock" | "lowStockThreshold">): StockState {
  if (p.stock <= 0) return "out";
  if (p.stock <= (p.lowStockThreshold ?? 3)) return "low";
  return "in";
}
