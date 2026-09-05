import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getAllProducts } from "@/lib/products-repo";
import { categories } from "@/lib/data/categories";
import { brands } from "@/lib/data/brands";

// Regenerate at most once per hour so new products/brands show up in the
// sitemap without needing a full redeploy.
export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/deals", priority: 0.8, changeFrequency: "daily" },
  { path: "/pc-builder", priority: 0.7, changeFrequency: "weekly" },
  { path: "/brands", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { path: "/help", priority: 0.4, changeFrequency: "monthly" },
  { path: "/payment-methods", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/return-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/shipping-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/warranty", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const products = await getAllProducts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/shop?category=${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands
    .filter((b) => b.enabled)
    .map((brand) => ({
      url: `${base}/brands/${brand.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...brandEntries, ...productEntries];
}
