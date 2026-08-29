import { bestSellers } from "@/lib/data/products";
import { getAllProducts } from "@/lib/products-repo";
import { ProductGrid } from "../product/ProductGrid";
import { SectionHeading } from "./SectionHeading";

export async function BestSellers() {
  const allProducts = await getAllProducts();
  const items = bestSellers(8, allProducts);
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
