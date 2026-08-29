"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { stockState } from "@/lib/types";
import { Cart, Heart, Check, Compare } from "../ui/icons";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useCompare } from "@/lib/compare-context";

/**
 * Interactive card controls: wishlist toggle + add-to-cart.
 * Kept in its own client island so the card stays a server component.
 */
export function ProductCardActions({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const { isWished, toggle } = useWishlist();
  const { isComparing, toggle: toggleCompare } = useCompare();
  const wished = isWished(product.id);
  const comparing = isComparing(product.id);
  const [added, setAdded] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const out = stockState(product) === "out";

  return (
    <div className={cn("relative flex items-center gap-1.5", className)}>
      {compareError && (
        <p className="absolute -top-9 left-0 z-10 w-max max-w-[220px] rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
          {compareError}
        </p>
      )}
      <button
        type="button"
        onClick={() => toggle(product)}
        aria-pressed={wished}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg border transition focus-ring",
          wished
            ? "border-danger/30 bg-danger-soft text-danger"
            : "border-line text-ink-soft hover:border-brand-200 hover:text-brand-600",
        )}
      >
        <Heart size={17} className={wished ? "fill-current" : undefined} />
      </button>
      <button
        type="button"
        onClick={() => {
          const result = toggleCompare(product);
          if (!result.ok) {
            setCompareError(result.reason ?? "Couldn't add to compare.");
            window.setTimeout(() => setCompareError(null), 2400);
          }
        }}
        aria-pressed={comparing}
        aria-label={comparing ? "Remove from compare" : "Add to compare"}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg border transition focus-ring",
          comparing
            ? "border-brand-300 bg-brand-50 text-brand-700"
            : "border-line text-ink-soft hover:border-brand-200 hover:text-brand-600",
        )}
      >
        <Compare size={17} />
      </button>
      <button
        type="button"
        disabled={out}
        onClick={() => {
          addItem(product, 1);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
        aria-label={out ? "Out of stock" : "Add to cart"}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg text-white transition focus-ring disabled:cursor-not-allowed disabled:opacity-40",
          added ? "bg-success" : "bg-brand-600 hover:bg-brand-700",
        )}
      >
        {added ? <Check size={17} /> : <Cart size={17} />}
      </button>
    </div>
  );
}
