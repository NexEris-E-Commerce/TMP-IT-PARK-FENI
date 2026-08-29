import "server-only";
import { cache } from "react";
import type { Product } from "./types";
import { createClient } from "./supabase/server";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  image: string | null;
  price: number;
  regular_price: number | null;
  rating: number | null;
  review_count: number | null;
  stock: number;
  low_stock_threshold: number | null;
  key_spec: string | null;
  specs: { label: string; value: string }[] | null;
  warranty: string | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  is_deal: boolean | null;
  deal_ends_at: string | null;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    image: row.image ?? undefined,
    price: row.price,
    regularPrice: row.regular_price ?? undefined,
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold ?? undefined,
    keySpec: row.key_spec ?? undefined,
    specs: row.specs ?? undefined,
    warranty: row.warranty ?? undefined,
    isFeatured: row.is_featured ?? undefined,
    isBestSeller: row.is_best_seller ?? undefined,
    isDeal: row.is_deal ?? undefined,
    dealEndsAt: row.deal_ends_at ?? undefined,
  };
}

/**
 * Fetches the live product catalog from Supabase — the only source of
 * truth for the storefront. Cached per-request (React `cache`) so pages
 * that need it multiple times (layout + page, or several home sections)
 * only hit the database once per request.
 *
 * Returns an empty array if Supabase isn't configured yet or the query
 * fails — the storefront shows "no products" rather than falling back to
 * any dummy data.
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase env vars are not set — the storefront has no products to show.");
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch products from Supabase:", error);
      return [];
    }

    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("Failed to fetch products from Supabase:", err);
    return [];
  }
});
