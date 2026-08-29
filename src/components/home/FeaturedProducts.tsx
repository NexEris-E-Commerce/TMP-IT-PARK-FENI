import { featuredProducts } from "@/lib/data/products";
import { getAllProducts } from "@/lib/products-repo";
import { ProductGrid } from "../product/ProductGrid";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedProducts() {
  const allProducts = await getAllProducts();
  const items = featuredProducts(8, allProducts);
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
