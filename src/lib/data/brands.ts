import type { Brand } from "../types";

/**
 * Partner brands shown in the homepage brand strip and Brands page.
 * `mark` + `color` drive the monogram logo tile (real SVG logos can be
 * uploaded via the admin Brand manager in Phase 5).
 */
export const brands: Brand[] = [
  { slug: "intel", name: "Intel", mark: "intel", color: "#0f7dc2", enabled: true },
  { slug: "amd", name: "AMD", mark: "AMD", color: "#ed1c24", enabled: true },
  { slug: "asus", name: "ASUS", mark: "ASUS", color: "#00539b", enabled: true },
  { slug: "msi", name: "MSI", mark: "MSI", color: "#ff0018", enabled: true },
  { slug: "gigabyte", name: "Gigabyte", mark: "GIGABYTE", color: "#e75a10", enabled: true },
  { slug: "logitech", name: "Logitech", mark: "logitech", color: "#00b8fc", enabled: true },
  { slug: "samsung", name: "Samsung", mark: "SAMSUNG", color: "#1428a0", enabled: true },
  { slug: "epson", name: "Epson", mark: "EPSON", color: "#003399", enabled: true },
  { slug: "tp-link", name: "TP-Link", mark: "TP-LINK", color: "#4acbd6", enabled: true },
];

/**
 * Display names for every brand referenced by the catalog, including brands
 * that don't appear in the partner strip above (laptops, memory, etc.).
 */
export const brandLabels: Record<string, string> = {
  ...Object.fromEntries(brands.map((b) => [b.slug, b.name])),
  hp: "HP",
  dell: "Dell",
  lenovo: "Lenovo",
  acer: "Acer",
  corsair: "Corsair",
  kingston: "Kingston",
  "western-digital": "Western Digital",
  "it-park": "IT PARK",
};

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function brandName(slug: string): string {
  return (
    brandLabels[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}
