import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, stockState } from "@/lib/types";
import { brandName } from "@/lib/data/brands";
import { ProductImage } from "../ui/ProductImage";
import { Badge } from "../ui/Badge";
import { Price } from "../ui/Price";
import { Rating } from "../ui/Rating";
import { Eye } from "../ui/icons";
import { ProductCardActions } from "./ProductCardActions";
import { cn } from "@/lib/cn";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const off = discountPercent(product);
  const stock = stockState(product);
  const href = `/product/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <Link href={href} aria-label={product.name} tabIndex={-1}>
          <ProductImage
            image={product.image}
            category={product.category}
            name={product.name}
            className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Corner flags */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <Badge tone="danger">-{off}%</Badge>}
          {product.isBestSeller && stock !== "out" && (
            <Badge tone="accent">Best Seller</Badge>
          )}
          {stock === "low" && <Badge tone="warn">Low Stock</Badge>}
          {stock === "out" && <Badge tone="neutral">Out of Stock</Badge>}
        </div>

        {/* Quick view — reveals on hover / focus-within */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-ink focus-ring"
          >
            <Eye size={15} />
            Quick View
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-dim">
          {brandName(product.brand)}
        </div>
        <h3 className="mt-1">
          <Link
            href={href}
            className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-ink transition hover:text-brand-700 focus-ring rounded-sm"
          >
            {product.name}
          </Link>
        </h3>
        {product.keySpec && (
          <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{product.keySpec}</p>
        )}

        {product.rating != null && (
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewCount} size={13} />
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-2 pt-3">
          <Price price={product.price} regularPrice={product.regularPrice} />
          <ProductCardActions product={product} className="ml-auto" />
        </div>
      </div>
    </article>
  );
}
