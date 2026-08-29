import { getBrand, brandName } from "@/lib/data/brands";
import { getAllProducts } from "@/lib/products-repo";
import { ProductListing } from "@/components/product/ProductListing";

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">) {
  const { slug } = await params;
  return { title: brandName(slug) };
}

export default async function BrandPage({ params }: PageProps<"/brands/[slug]">) {
  const { slug } = await params;
  const brand = getBrand(slug);
  const name = brand?.name ?? brandName(slug);
  const allProducts = await getAllProducts();
  const list = allProducts.filter((p) => p.brand === slug);

  return (
    <ProductListing
      title={name}
      subtitle={`Genuine ${name} products with official warranty, in stock in Feni.`}
      products={list}
      breadcrumbs={[{ label: "Brands", href: "/brands" }]}
      emptyMessage={`No ${name} products are listed yet — more coming soon.`}
    />
  );
}
