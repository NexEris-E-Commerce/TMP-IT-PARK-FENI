"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Plus, Minus, Close, Cart as CartIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/format";
import { amountToFreeDelivery, FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem, isLoaded } = useCart();
  const remaining = amountToFreeDelivery(subtotal);

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Your Cart</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Your Cart
      </h1>

      {!isLoaded ? null : lines.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-3xl border border-line bg-surface px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <CartIcon size={28} />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            Browse our laptops, components and accessories — add something you like and it&rsquo;ll show up here.
          </p>
          <Button href="/shop" className="mt-6">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Line items */}
          <div className="lg:col-span-2">
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-4 p-4 sm:p-5">
                  <Link
                    href={`/product/${line.slug}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24"
                  >
                    {line.image ? (
                      <Image src={line.image} alt={line.name} fill className="object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs text-ink-dim">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${line.slug}`}
                        className="text-sm font-semibold text-ink transition hover:text-brand-700 sm:text-base"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        aria-label="Remove item"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-dim transition hover:bg-danger-soft hover:text-danger"
                      >
                        <Close size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-xl border border-line-strong">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-9 w-9 place-items-center rounded-l-xl text-ink-soft transition hover:bg-muted"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold tabular-nums text-ink">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                          disabled={line.quantity >= line.stock}
                          aria-label="Increase quantity"
                          className="grid h-9 w-9 place-items-center rounded-r-xl text-ink-soft transition hover:bg-muted disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-ink sm:text-base">
                        {formatBDT(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-ink">Order Summary</h2>

            {remaining > 0 ? (
              <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                Add {formatBDT(remaining)} more for free delivery!
              </p>
            ) : (
              <p className="mt-2 rounded-lg bg-success/10 px-3 py-2 text-xs font-semibold text-success">
                You&rsquo;ve unlocked free delivery 🎉
              </p>
            )}

            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span>
                  {subtotal >= FREE_DELIVERY_THRESHOLD ? "Free" : "Calculated at checkout"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold text-ink">
              <span>Total</span>
              <span>{formatBDT(subtotal)}</span>
            </div>

            <Button href="/checkout" size="lg" className="mt-5 w-full">
              Proceed to Checkout
            </Button>
            <Button href="/shop" variant="outline" className="mt-3 w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
