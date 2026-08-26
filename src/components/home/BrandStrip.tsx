import Link from "next/link";
import { brands } from "@/lib/data/brands";
import { BrandTile } from "../ui/BrandTile";
import { SectionHeading } from "./SectionHeading";

export function BrandStrip() {
  const items = brands.filter((b) => b.enabled !== false);

  return (
    <section>
      <SectionHeading
        eyebrow="Authorized Partner"
        title="Brands We Carry"
        subtitle="Genuine products from the brands you trust — with official warranty."
        actionHref="/brands"
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-9 lg:gap-4">
        {items.map((b) => (
          <Link key={b.slug} href={`/brands/${b.slug}`} aria-label={b.name}>
            <BrandTile brand={b} />
          </Link>
        ))}
      </div>
    </section>
  );
}
