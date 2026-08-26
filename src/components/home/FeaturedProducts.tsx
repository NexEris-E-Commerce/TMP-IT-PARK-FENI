import { featuredProducts } from "@/lib/data/products";
import { ProductGrid } from "../product/ProductGrid";
import { SectionHeading } from "./SectionHeading";

export function FeaturedProducts() {
  const items = featuredProducts(8);
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeading
        eyebrow="Handpicked"
        title="Featured Products"
        subtitle="Popular picks our customers in Feni love — genuine, in-stock and ready to ship."
        actionHref="/shop"
      />
      <ProductGrid products={items} />
    </section>
  );
}
