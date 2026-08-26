import { dealProducts } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <ProductListing
      title="Deals of the Day"
      subtitle="Limited-time offers across laptops, components, monitors and more."
      products={dealProducts()}
      emptyMessage="No active deals right now — check back soon!"
    />
  );
}
