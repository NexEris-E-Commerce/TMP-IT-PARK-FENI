import { getCategory } from "@/lib/data/categories";
import { parseShopQuery, runShopQuery } from "@/lib/shop";
import { CatalogView } from "@/components/shop/CatalogView";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const query = parseShopQuery(sp);
  const result = runShopQuery(query);
  const cat = query.category ? getCategory(query.category) : undefined;

  return (
    <CatalogView
      title={cat ? cat.name : query.q ? `Search: ${query.q}` : "All Products"}
      subtitle={
        cat?.tagline ??
        (query.q
          ? `${result.total} ${result.total === 1 ? "result" : "results"} matching your search`
          : "Browse our complete range of laptops, desktops, components and more.")
      }
      breadcrumbs={cat ? [{ label: "Shop", href: "/shop" }] : []}
      query={query}
      result={result}
    />
  );
}
