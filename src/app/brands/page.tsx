import Link from "next/link";
import { brands } from "@/lib/data/brands";
import { getAllProducts } from "@/lib/products-repo";
import { Container } from "@/components/ui/Container";
import { BrandTile } from "@/components/ui/BrandTile";
import { ChevronRight } from "@/components/ui/icons";

export const metadata = { title: "Brands" };

export default async function BrandsPage() {
  const items = brands.filter((b) => b.enabled !== false);
  const allProducts = await getAllProducts();
  const countFor = (slug: string) => allProducts.filter((p) => p.brand === slug).length;

  return (
    <Container className="py-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Brands</span>
      </nav>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Brands We Carry
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">
          Authorized dealer for the world's leading technology brands — every
          product genuine, with official warranty.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((b) => (
          <Link
            key={b.slug}
            href={`/brands/${b.slug}`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-8 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
          >
            <span
              className="font-display text-2xl font-extrabold tracking-tight opacity-80 transition group-hover:opacity-100"
              style={{ color: b.color }}
            >
              {b.name}
            </span>
            <span className="text-xs text-ink-dim">{countFor(b.slug)} products</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
