import "server-only";
import { cache } from "react";
import type { IconKey, Product } from "./types";
import { createClient } from "./supabase/server";
import { getAllProducts } from "./products-repo";
import { getBillboardTheme } from "./billboard-themes";
import { formatBDT } from "./format";

export interface BillboardSlide {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  gradient: string;
  glow: string;
  category: IconKey;
  product: string;
  price: string;
  rating: number;
  /** Real product photo — when present, the storefront shows this instead of the generic category icon in the product mock card. */
  productImage?: string;
  /** Custom full-bleed background photo for the slide — when present, this replaces the solid gradient (still tinted with the theme gradient for text contrast). */
  backgroundImage?: string;
}

type SlideMode = "manual" | "category" | "tag" | "random";

interface SlideRow {
  id: string;
  mode: SlideMode;
  product_id: string | null;
  category: string | null;
  tag: string | null;
  eyebrow: string | null;
  title: string | null;
  highlight: string | null;
  subtitle: string | null;
  primary_label: string | null;
  primary_href: string | null;
  secondary_label: string | null;
  secondary_href: string | null;
  theme: string | null;
  background_image: string | null;
}

const KNOWN_ICON_KEYS: IconKey[] = [
  "laptop",
  "desktop",
  "gaming",
  "components",
  "monitor",
  "printer",
  "networking",
  "accessories",
  "grid",
];

function toIconKey(category: string): IconKey {
  return (KNOWN_ICON_KEYS as string[]).includes(category) ? (category as IconKey) : "grid";
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

/** Prefers in-stock products where possible, but doesn't hard-require it. */
function pickProductFrom(candidates: Product[]): Product | undefined {
  const inStock = candidates.filter((p) => p.stock > 0);
  return pickRandom(inStock.length > 0 ? inStock : candidates);
}

function resolveProductForRow(row: SlideRow, allProducts: Product[]): Product | undefined {
  switch (row.mode) {
    case "manual":
      return row.product_id ? allProducts.find((p) => p.id === row.product_id) : undefined;
    case "category":
      return row.category ? pickProductFrom(allProducts.filter((p) => p.category === row.category)) : undefined;
    case "tag":
      return row.tag ? pickProductFrom(allProducts.filter((p) => p.tags?.includes(row.tag!))) : undefined;
    case "random":
      return pickProductFrom(allProducts);
    default:
      return undefined;
  }
}

function buildSlide(row: SlideRow, product: Product): BillboardSlide {
  const theme = getBillboardTheme(row.theme);
  const categoryHref = `/shop?category=${encodeURIComponent(product.category)}`;

  return {
    eyebrow: row.eyebrow?.trim() || "Featured",
    title: row.title?.trim() || product.name,
    highlight: row.highlight?.trim() || "",
    subtitle: row.subtitle?.trim() || product.keySpec || "",
    primary: {
      label: row.primary_label?.trim() || "Shop Now",
      href: row.primary_href?.trim() || `/product/${product.slug}`,
    },
    secondary: {
      label: row.secondary_label?.trim() || "View All",
      href: row.secondary_href?.trim() || categoryHref,
    },
    gradient: theme.gradient,
    glow: theme.glow,
    category: toIconKey(product.category),
    product: product.name,
    price: formatBDT(product.price),
    rating: product.rating ?? 4.8,
    productImage: product.image,
    backgroundImage: row.background_image?.trim() || undefined,
  };
}

/** Shown when no billboard slides are configured yet, or none of the
 * configured ones could be resolved to a real product (e.g. every picked
 * product was deleted) — the homepage should never render an empty Hero. */
export const DEFAULT_BILLBOARD_SLIDES: BillboardSlide[] = [
  {
    eyebrow: "Complete IT Solution",
    title: "Build the PC You've Always",
    highlight: "Imagined",
    subtitle:
      "Hand-picked components, expert assembly and genuine warranty — configure your dream rig with our smart PC Builder.",
    primary: { label: "Start Building", href: "/pc-builder" },
    secondary: { label: "Shop Components", href: "/shop?category=components" },
    gradient: "from-brand-700 via-brand-600 to-accent-600",
    glow: "bg-accent-400/40",
    category: "gaming",
    product: "Custom Gaming PC",
    price: "৳85,000",
    rating: 4.9,
  },
  {
    eyebrow: "Genuine • Warranty • Best Price",
    title: "Laptops & Components for",
    highlight: "Every Need",
    subtitle:
      "From everyday work to high-end creation — authorized brands, honest pricing and after-sales support you can trust.",
    primary: { label: "Shop Laptops", href: "/shop?category=laptop" },
    secondary: { label: "View All Deals", href: "/deals" },
    gradient: "from-accent-700 via-brand-700 to-brand-600",
    glow: "bg-brand-300/40",
    category: "laptop",
    product: "Business Laptops",
    price: "৳62,000",
    rating: 4.8,
  },
  {
    eyebrow: "Level Up Your Setup",
    title: "Gaming Gear That Helps You",
    highlight: "Win",
    subtitle:
      "GPUs, monitors, mechanical keyboards and more. Everything you need for a competitive edge, in stock in Feni.",
    primary: { label: "Shop Gaming", href: "/shop?category=gaming" },
    secondary: { label: "Explore Monitors", href: "/shop?category=monitor" },
    gradient: "from-ink via-brand-800 to-accent-700",
    glow: "bg-accent-500/40",
    category: "components",
    product: "RTX Graphics Cards",
    price: "৳38,500",
    rating: 4.9,
  },
];

/**
 * Resolves the enabled rows in `homepage_billboard_slides` into render-ready
 * slides for the Hero carousel. Falls back to DEFAULT_BILLBOARD_SLIDES if
 * nothing is configured, or if every configured slide fails to resolve to a
 * real product (deleted product, empty category/tag, etc).
 */
export const getHomepageBillboardSlides = cache(async (): Promise<BillboardSlide[]> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return DEFAULT_BILLBOARD_SLIDES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_billboard_slides")
      .select(
        "id, mode, product_id, category, tag, eyebrow, title, highlight, subtitle, primary_label, primary_href, secondary_label, secondary_href, theme, background_image",
      )
      .eq("enabled", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("Failed to fetch homepage billboard slides:", error);
      return DEFAULT_BILLBOARD_SLIDES;
    }

    const allProducts = await getAllProducts();
    const resolved = (data as SlideRow[])
      .map((row) => {
        const product = resolveProductForRow(row, allProducts);
        return product ? buildSlide(row, product) : null;
      })
      .filter((s): s is BillboardSlide => s !== null);

    return resolved.length > 0 ? resolved : DEFAULT_BILLBOARD_SLIDES;
  } catch (err) {
    console.error("Failed to resolve homepage billboard slides:", err);
    return DEFAULT_BILLBOARD_SLIDES;
  }
});
