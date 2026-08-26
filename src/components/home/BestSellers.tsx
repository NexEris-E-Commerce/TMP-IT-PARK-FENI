import { bestSellers } from "@/lib/data/products";
import { ProductGrid } from "../product/ProductGrid";
import { SectionHeading } from "./SectionHeading";

export function BestSellers() {
  const items = bestSellers(8);
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeading
        eyebrow="Top Rated"
        title="Best Sellers"
        subtitle="The gear flying off our shelves this month."
        actionHref="/shop?sort=popular"
      />
      <ProductGrid products={items} />
    </section>
  );
}
