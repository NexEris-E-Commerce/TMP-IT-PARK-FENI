/**
 * NOTE: src/lib/data/products.ts is now intentionally empty — all product
 * data is managed directly in Supabase (via /admin or the Table Editor).
 * This script is kept only in case you want to bulk-import a catalog again
 * in the future: fill in src/lib/data/products.ts with Product objects,
 * then run this script to upsert them into Supabase.
 *
 * Usage:
 *   1. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and
 *      SUPABASE_SERVICE_ROLE_KEY set, and you've run supabase/schema.sql.
 *   2. npx tsx scripts/seed-products.ts
 *
 * Safe to re-run: upserts on `slug`, so existing rows get updated rather
 * than duplicated.
 */
import { createClient } from "@supabase/supabase-js";
import { products } from "../src/lib/data/products";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set them in .env.local (see .env.example) before running this script.",
  );
  process.exit(1);
}

if (products.length === 0) {
  console.log(
    "src/lib/data/products.ts is empty — nothing to seed. " +
      "Add products via /admin or the Supabase Table Editor instead.",
  );
  process.exit(0);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  const rows = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    image: p.image ?? null,
    price: p.price,
    regular_price: p.regularPrice ?? null,
    rating: p.rating ?? null,
    review_count: p.reviewCount ?? 0,
    stock: p.stock,
    low_stock_threshold: p.lowStockThreshold ?? 3,
    key_spec: p.keySpec ?? null,
    specs: p.specs ?? [],
    warranty: p.warranty ?? null,
    is_featured: p.isFeatured ?? false,
    is_best_seller: p.isBestSeller ?? false,
    is_deal: p.isDeal ?? false,
    deal_ends_at: p.dealEndsAt ?? null,
  }));

  console.log(`Seeding ${rows.length} products…`);

  const { error, count } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Done — ${count ?? rows.length} products upserted.`);
}

main();
