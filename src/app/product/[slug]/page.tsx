import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, relatedProducts } from "@/lib/data/products";
import { getAllProducts } from "@/lib/products-repo";
import { brandName } from "@/lib/data/brands";
import { getCategory } from "@/lib/data/categories";
import { discountPercent, stockState } from "@/lib/types";
import { formatBDT } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Reviews } from "@/components/product/Reviews";
import { ProductBuyActions } from "@/components/product/ProductBuyActions";
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  ReturnBox,
  Check,
} from "@/components/ui/icons";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const allProducts = await getAllProducts();
  const p = getProduct(slug, allProducts);
  return p
    ? { title: p.name, description: p.keySpec ?? undefined }
    : { title: "Product Not Found" };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const allProducts = await getAllProducts();
  const product = getProduct(slug, allProducts);
  if (!product) notFound();

  const cat = getCategory(product.category);
  const off = discountPercent(product);
  const stock = stockState(product);
  const related = relatedProducts(product, 4, allProducts);
  const savings = product.regularPrice ? product.regularPrice - product.price : 0;

  return (
    <Container className="py-8 lg:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/shop" className="transition hover:text-brand-700">
          Shop
        </Link>
        {cat && (
          <>
            <ChevronRight size={14} />
            <Link href={`/shop?category=${cat.slug}`} className="transition hover:text-brand-700">
              {cat.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="line-clamp-1 font-medium text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery
          category={product.category}
          name={product.name}
          discount={off}
          bestSeller={product.isBestSeller}
        />

        {/* Info */}
        <div>
          <Link
            href={`/brands/${product.brand}`}
            className="text-xs font-bold uppercase tracking-wide text-brand-600 transition hover:text-brand-700"
          >
            {brandName(product.brand)}
          </Link>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.rating != null && (
              <Rating value={product.rating} count={product.reviewCount} size={15} />
            )}
            {stock === "in" && (
              <Badge tone="success">
                <Check size={12} /> In Stock
              </Badge>
            )}
            {stock === "low" && <Badge tone="warn">Low Stock ({product.stock} left)</Badge>}
            {stock === "out" && <Badge tone="neutral">Out of Stock</Badge>}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Price price={product.price} regularPrice={product.regularPrice} size="lg" />
            {savings > 0 && (
              <span className="rounded-lg bg-danger-soft px-2.5 py-1 text-xs font-bold text-danger">
                You save {formatBDT(savings)} ({off}%)
              </span>
            )}
          </div>

          {product.keySpec && (
            <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-ink-soft">
              <span className="font-semibold text-ink">Key spec: </span>
              {product.keySpec}
            </p>
          )}

          <div className="mt-6">
            <ProductBuyActions product={product} />
          </div>

          {/* Trust row */}
          <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <Truck size={20} className="shrink-0 text-brand-600" />
              <span className="text-xs text-ink-soft">
                <span className="block font-semibold text-ink">Fast Delivery</span>
                All over Bangladesh
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} className="shrink-0 text-brand-600" />
              <span className="text-xs text-ink-soft">
                <span className="block font-semibold text-ink">Warranty</span>
                {product.warranty ?? "Official warranty"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ReturnBox size={20} className="shrink-0 text-brand-600" />
              <span className="text-xs text-ink-soft">
                <span className="block font-semibold text-ink">7-Day Return</span>
                Easy return policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
          Specifications
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          {(product.specs && product.specs.length > 0
            ? product.specs
            : [
                { label: "Brand", value: brandName(product.brand) },
                { label: "Category", value: cat?.name ?? product.category },
                ...(product.keySpec ? [{ label: "Highlights", value: product.keySpec }] : []),
                ...(product.warranty ? [{ label: "Warranty", value: product.warranty }] : []),
              ]
          ).map((row, idx) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm ${idx % 2 === 0 ? "bg-surface" : "bg-muted/50"}`}
            >
              <dt className="font-semibold text-ink-soft">{row.label}</dt>
              <dd className="col-span-2 text-ink">{row.value}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <Reviews product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-display text-xl font-extrabold tracking-tight text-ink">
            Related Products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
