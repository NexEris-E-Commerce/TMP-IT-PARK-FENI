"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { ChevronRight, Heart, Cart as CartIcon, Close } from "@/components/ui/icons";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/format";

export default function WishlistPage() {
  const { items, remove, isLoaded } = useWishlist();
  const { addItem } = useCart();

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Wishlist</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Your Wishlist
      </h1>

      {!isLoaded ? null : items.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-3xl border border-line bg-surface px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Heart size={28} />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">Your wishlist is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Button href="/shop" className="mt-6">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.productId} className="relative rounded-2xl border border-line bg-surface p-4">
              <button
                type="button"
                onClick={() => remove(item.productId)}
                aria-label="Remove from wishlist"
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg bg-surface/90 text-ink-dim shadow-sm transition hover:bg-danger-soft hover:text-danger"
              >
                <Close size={15} />
              </button>

              <Link href={`/product/${item.slug}`} className="block">
                <ProductImage
                  image={item.image}
                  name={item.name}
                  className="aspect-square rounded-xl"
                  iconSize={40}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                />
                <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-ink">{item.name}</h3>
              </Link>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-bold text-ink">{formatBDT(item.price)}</span>
                {item.regularPrice && item.regularPrice > item.price && (
                  <span className="text-xs text-ink-dim line-through">
                    {formatBDT(item.regularPrice)}
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={item.stock <= 0}
                onClick={() =>
                  addItem(
                    {
                      id: item.productId,
                      slug: item.slug,
                      name: item.name,
                      image: item.image,
                      price: item.price,
                      stock: item.stock,
                      brand: "",
                      category: "",
                    },
                    1,
                  )
                }
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CartIcon size={16} />
                {item.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
