"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductThumb } from "../ui/ProductThumb";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/cn";

const OPTIMIZABLE_HOST_SUFFIXES = [".supabase.co"];
function isOptimizable(url: string) {
  try {
    return OPTIMIZABLE_HOST_SUFFIXES.some((suffix) => new URL(url).hostname.endsWith(suffix));
  } catch {
    return false;
  }
}

/**
 * Product image gallery. When the product has a real photo (`image`), it's
 * shown as the single main stage image — the "4 views" placeholder rotation
 * below is only for products that don't have a real photo yet, since it
 * would be misleading to show four fake rotated copies of one real photo.
 */
const VIEWS = [
  { transform: "none" },
  { transform: "scale(1.12) rotate(-6deg)" },
  { transform: "scale(0.9) rotate(5deg)" },
  { transform: "scale(1.05) rotate(2deg)" },
];

export function ProductGallery({
  category,
  name,
  image,
  discount = 0,
  bestSeller = false,
}: {
  category: string;
  name: string;
  image?: string | null;
  discount?: number;
  bestSeller?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const hasRealImage = Boolean(image) && !imageFailed;

  return (
    <div>
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        {hasRealImage ? (
          <Image
            src={image!}
            alt={name}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
            unoptimized={!isOptimizable(image!)}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="h-full w-full transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.08]"
            style={{ transform: VIEWS[active].transform }}
          >
            <ProductThumb
              category={category}
              name={name}
              iconSize={120}
              className="h-full w-full"
            />
          </div>
        )}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="danger">-{discount}% OFF</Badge>}
          {bestSeller && <Badge tone="accent">Best Seller</Badge>}
        </div>
        {!hasRealImage && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            Hover to zoom
          </span>
        )}
      </div>

      {!hasRealImage && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="Product images">
          {VIEWS.map((view, n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={active === n}
              aria-label={`View ${n + 1}`}
              onClick={() => setActive(n)}
              className={cn(
                "overflow-hidden rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                active === n
                  ? "border-brand-400 ring-2 ring-brand-500/20"
                  : "border-line hover:border-brand-200",
              )}
            >
              <div style={{ transform: view.transform }} className="aspect-square w-full">
                <ProductThumb
                  category={category}
                  name={`${name} view ${n + 1}`}
                  iconSize={30}
                  className="h-full w-full"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
