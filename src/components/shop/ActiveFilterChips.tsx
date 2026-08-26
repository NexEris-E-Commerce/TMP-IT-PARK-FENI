"use client";

import { Close } from "../ui/icons";
import { brandName } from "@/lib/data/brands";
import { formatBDT } from "@/lib/format";
import { hasActiveFilters, type ShopQuery } from "@/lib/shop";
import { useShopNav } from "./shop-nav";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full text-brand-600 transition hover:bg-brand-100 hover:text-brand-800"
      >
        <Close size={13} strokeWidth={2.4} />
      </button>
    </span>
  );
}

export function ActiveFilterChips({ query }: { query: ShopQuery }) {
  const { commit } = useShopNav();
  if (!hasActiveFilters(query)) return null;

  const priceLabel =
    query.minPrice != null && query.maxPrice != null
      ? `${formatBDT(query.minPrice)} – ${formatBDT(query.maxPrice)}`
      : query.minPrice != null
        ? `From ${formatBDT(query.minPrice)}`
        : query.maxPrice != null
          ? `Up to ${formatBDT(query.maxPrice)}`
          : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {query.brands.map((b) => (
        <Chip
          key={b}
          label={brandName(b)}
          onRemove={() =>
            commit((p) => {
              const next = query.brands.filter((x) => x !== b);
              if (next.length) p.set("brand", next.join(","));
              else p.delete("brand");
            })
          }
        />
      ))}
      {priceLabel && (
        <Chip
          label={priceLabel}
          onRemove={() =>
            commit((p) => {
              p.delete("min");
              p.delete("max");
            })
          }
        />
      )}
      {query.inStock && (
        <Chip label="In stock" onRemove={() => commit((p) => p.delete("stock"))} />
      )}
      {query.minRating != null && (
        <Chip
          label={`${query.minRating}★ & up`}
          onRemove={() => commit((p) => p.delete("rating"))}
        />
      )}
      <button
        type="button"
        onClick={() =>
          commit((p) => {
            ["brand", "min", "max", "stock", "rating"].forEach((k) => p.delete(k));
          })
        }
        className="text-sm font-semibold text-ink-dim underline-offset-2 transition hover:text-danger hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
