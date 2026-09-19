import "server-only";
import { cache } from "react";
import type { IconKey, Product } from "./types";
import { createClient } from "./supabase/server";
import { getAllProducts } from "./products-repo";
import { gradientCss } from "./billboard-color-utils";
import { formatBDT } from "./format";

export interface BillboardSlide {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** CSS linear-gradient() value for the slide background (from the chosen theme). */
  gradientCss: string;
  glowColor: string;
  eyebrowColor: string;
  titleColor: string;
  highlightColor: string;
  subtitleColor: string;
  /** Base color for the translucent backdrop panel behind the copy when there's a background photo — always used at reduced opacity, never solid. */
  plaqueColor: string;
  category: IconKey;
  product: string;
  price: string;
  rating: number;
  /** Real product photo — when present, the storefront shows this instead of the generic category icon in the product mock card. */
  productImage?: string;
  /** Custom full-bleed background photo for the slide — when present, this replaces the solid gradient. */
  backgroundImage?: string;
}

type SlideMode = "manual" | "category" | "tag" | "random";

interface ThemeRow {
  gradient_from: string;
  gradient_via: string | null;
  gradient_to: string;
  glow_color: string;
  eyebrow_color: string;
  title_color: string;
  highlight_color: string;
  subtitle_color: string;
  plaque_color: string;
}

const FALLBACK_THEME: ThemeRow = {
  gradient_from: "#2239bb",
  gradient_via: "#2a49dd",
  gradient_to: "#6a3cef",
  glow_color: "#9174ff",
  eyebrow_color: "#ffffff",
  title_color: "#ffffff",
  highlight_color: "#ffffff",
  subtitle_color: "#e5e7eb",
  plaque_color: "#000000",
};

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
  background_image: string | null;
  eyebrow_color: string | null;
  title_color: string | null;
  highlight_color: string | null;
  subtitle_color: string | null;
  billboard_themes: ThemeRow | null;
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
  const theme = row.billboard_themes ?? FALLBACK_THEME;
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
    gradientCss: gradientCss({
      gradientFrom: theme.gradient_from,
      gradientVia: theme.gradient_via,
      gradientTo: theme.gradient_to,
    }),
    glowColor: theme.glow_color,
    // Per-slide overrides win over the theme's own colors when set.
    eyebrowColor: row.eyebrow_color?.trim() || theme.eyebrow_color,
    titleColor: row.title_color?.trim() || theme.title_color,
    highlightColor: row.highlight_color?.trim() || theme.highlight_color,
    subtitleColor: row.subtitle_color?.trim() || theme.subtitle_color,
    plaqueColor: theme.plaque_color,
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
    gradientCss: gradientCss({ gradientFrom: "#2239bb", gradientVia: "#2a49dd", gradientTo: "#6a3cef" }),
    glowColor: "#9174ff",
    eyebrowColor: "#ffffff",
    titleColor: "#ffffff",
    highlightColor: "#ffffff",
    subtitleColor: "#e5e7eb",
    plaqueColor: "#000000",
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
    gradientCss: gradientCss({ gradientFrom: "#5b2fd1", gradientVia: "#2239bb", gradientTo: "#2a49dd" }),
    glowColor: "#90b0ff",
    eyebrowColor: "#ffffff",
    titleColor: "#ffffff",
    highlightColor: "#ffffff",
    subtitleColor: "#e5e7eb",
    plaqueColor: "#000000",
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
    gradientCss: gradientCss({ gradientFrom: "#0f1b33", gradientVia: "#223397", gradientTo: "#5b2fd1" }),
    glowColor: "#7a54fb",
    eyebrowColor: "#ffffff",
    titleColor: "#ffffff",
    highlightColor: "#ffffff",
    subtitleColor: "#e5e7eb",
    plaqueColor: "#000000",
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
        "id, mode, product_id, category, tag, eyebrow, title, highlight, subtitle, primary_label, primary_href, secondary_label, secondary_href, background_image, eyebrow_color, title_color, highlight_color, subtitle_color, billboard_themes(gradient_from, gradient_via, gradient_to, glow_color, eyebrow_color, title_color, highlight_color, subtitle_color, plaque_color)",
      )
      .eq("enabled", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("Failed to fetch homepage billboard slides:", error);
      return DEFAULT_BILLBOARD_SLIDES;
    }

    const allProducts = await getAllProducts();
    const resolved = (data as unknown as SlideRow[])
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
