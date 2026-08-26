import type { Category } from "../types";

/**
 * Storefront categories. Order here is the default homepage/quick-nav order
 * (admin-reorderable in Phase 5). `productCount` is illustrative until the
 * catalog is DB-backed.
 */
export const categories: Category[] = [
  { slug: "laptop", name: "Laptop", nameBn: "ল্যাপটপ", icon: "laptop", tagline: "Everyday, business & premium laptops", productCount: 128 },
  { slug: "desktop", name: "Desktop", nameBn: "ডেস্কটপ", icon: "desktop", tagline: "Brand & custom desktop PCs", productCount: 74 },
  { slug: "gaming", name: "Gaming", nameBn: "গেমিং", icon: "gaming", tagline: "Gaming PCs, gear & accessories", productCount: 96 },
  { slug: "components", name: "Components", nameBn: "কম্পোনেন্ট", icon: "components", tagline: "CPU, GPU, RAM, storage & more", productCount: 210 },
  { slug: "monitor", name: "Monitor", nameBn: "মনিটর", icon: "monitor", tagline: "FHD, QHD, 4K & gaming monitors", productCount: 58 },
  { slug: "printer", name: "Printer", nameBn: "প্রিন্টার", icon: "printer", tagline: "Inkjet, laser & ink-tank printers", productCount: 42 },
  { slug: "networking", name: "Networking", nameBn: "নেটওয়ার্কিং", icon: "networking", tagline: "Routers, switches & Wi-Fi", productCount: 63 },
  { slug: "accessories", name: "Accessories", nameBn: "আক্সেসরিজ", icon: "accessories", tagline: "Keyboards, mice, headsets & more", productCount: 185 },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
