import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Search as SearchIcon } from "@/components/ui/icons";
import { parseShopQuery, runShopQuery } from "@/lib/shop";
import { getAllProducts } from "@/lib/products-repo";
import { CatalogView } from "@/components/shop/CatalogView";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const query = parseShopQuery(sp);

  // No query yet — show a friendly prompt instead of the whole catalog.
  if (!query.q) {
    return (
      <Container className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-md place-items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <SearchIcon size={30} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
            Search IT PARK FENI
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Find products by name, brand or category using the search bar above.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Browse all products
          </Link>
        </div>
      </Container>
    );
  }

  const allProducts = await getAllProducts();
  const result = runShopQuery(query, allProducts);

  return (
    <CatalogView
      title={`Search: “${query.q}”`}
      subtitle={`${result.total} ${result.total === 1 ? "result" : "results"} for your search — refine below.`}
      breadcrumbs={[{ label: "Search", href: "/search" }]}
      query={query}
      result={result}
    />
  );
}
