"use client";

import { ChevronDown } from "../ui/icons";
import { SORT_OPTIONS, type SortKey, DEFAULT_SORT } from "@/lib/shop";
import { useShopNav } from "./shop-nav";

export function SortSelect({ value }: { value: SortKey }) {
  const { commit } = useShopNav();

  return (
    <div className="relative">
      <select
        aria-label="Sort products"
        value={value}
        onChange={(e) => {
          const next = e.target.value as SortKey;
          commit((p) => {
            if (next === DEFAULT_SORT) p.delete("sort");
            else p.set("sort", next);
          });
        }}
        className="appearance-none rounded-lg border border-line bg-surface py-2 pl-3 pr-9 text-sm font-semibold text-ink outline-none transition hover:border-brand-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-dim"
      />
    </div>
  );
}
