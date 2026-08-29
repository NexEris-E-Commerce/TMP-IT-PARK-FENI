import { dealProducts } from "@/lib/data/products";
import { getAllProducts } from "@/lib/products-repo";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata = { title: "Deals" };

export default async function DealsPage() {
  const allProducts = await getAllProducts();
  return (
    <ProductListing
      title="Deals of the Day"
      subtitle="Limited-time offers across laptops, components, monitors and more."
      products={dealProducts(undefined, allProducts)}
      emptyMessage="No active deals right now — check back soon!"
    />
  );
}
