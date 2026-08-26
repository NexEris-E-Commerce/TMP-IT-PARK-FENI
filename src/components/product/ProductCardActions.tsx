"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { stockState } from "@/lib/types";
import { Cart, Heart, Check } from "../ui/icons";
import { cn } from "@/lib/cn";

/**
 * Interactive card controls: wishlist toggle + add-to-cart.
 * Local state gives real feedback now; both wire into the cart/wishlist
 * stores in Phase 3. Kept in its own client island so the card stays a
 * server component.
 */
export function ProductCardActions({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const out = stockState(product) === "out";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => setWished((w) => !w)}
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
        disabled={out}
        onClick={() => {
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
