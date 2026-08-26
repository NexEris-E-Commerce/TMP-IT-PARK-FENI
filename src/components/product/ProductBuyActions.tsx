"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { stockState } from "@/lib/types";
import { Cart, Heart, Plus, Minus, Check } from "../ui/icons";
import { cn } from "@/lib/cn";

/**
 * Product detail buy box: quantity stepper + add-to-cart / buy-now / wishlist.
 * Local state gives real feedback now; wires into the cart & checkout flow in
 * Phase 3.
 */
export function ProductBuyActions({ product }: { product: Product }) {
  const out = stockState(product) === "out";
  const max = Math.max(1, product.stock);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  return (
    <div className="space-y-4">
      {!out && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink">Quantity</span>
          <div className="inline-flex items-center rounded-xl border border-line-strong">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="grid h-10 w-10 place-items-center rounded-l-xl text-ink-soft transition hover:bg-muted disabled:opacity-40"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-sm font-bold tabular-nums text-ink">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(max, q + 1))}
              disabled={qty >= max}
              aria-label="Increase quantity"
              className="grid h-10 w-10 place-items-center rounded-r-xl text-ink-soft transition hover:bg-muted disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-xs text-ink-dim">{product.stock} available</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={out}
          onClick={() => {
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1600);
          }}
          className={cn(
            "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-[0_10px_22px_-8px_rgba(42,73,221,0.6)] transition active:scale-[0.99] focus-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
            added ? "bg-success" : "bg-brand-600 hover:bg-brand-700",
          )}
        >
          {added ? (
            <>
              <Check size={18} /> Added to Cart
            </>
          ) : (
            <>
              <Cart size={18} /> Add to Cart
            </>
          )}
        </button>
        <button
          type="button"
          disabled={out}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent-600 text-sm font-bold text-white shadow-[0_10px_22px_-8px_rgba(106,60,239,0.6)] transition hover:bg-accent-700 active:scale-[0.99] focus-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Buy Now
        </button>
        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition focus-ring",
            wished
              ? "border-danger/30 bg-danger-soft text-danger"
              : "border-line-strong text-ink-soft hover:border-brand-200 hover:text-brand-600",
          )}
        >
          <Heart size={20} className={wished ? "fill-current" : undefined} />
        </button>
      </div>

      {out && (
        <p className="text-sm font-semibold text-danger">
          Currently out of stock — call us to check restock availability.
        </p>
      )}
    </div>
  );
}
