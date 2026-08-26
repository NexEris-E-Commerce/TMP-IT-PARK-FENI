"use client";

import { useState } from "react";
import { categories } from "@/lib/data/categories";
import { CategoryIcon } from "../ui/CategoryIcon";
import { Check, Star } from "../ui/icons";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Facets, ShopQuery } from "@/lib/shop";
import { useShopNav } from "./shop-nav";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-5 first:pt-0 last:border-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-dim">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border transition",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300",
          checked
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-line-strong bg-surface group-hover:border-brand-400",
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span
        className={cn(
          "flex-1 text-sm transition",
          checked ? "font-semibold text-ink" : "text-ink-soft group-hover:text-ink",
        )}
      >
        {label}
      </span>
      {count != null && (
        <span className="text-xs tabular-nums text-ink-dim">{count}</span>
      )}
    </label>
  );
}

function PriceSection({ query }: { query: ShopQuery }) {
  const { commit } = useShopNav();
  const [min, setMin] = useState(query.minPrice != null ? String(query.minPrice) : "");
  const [max, setMax] = useState(query.maxPrice != null ? String(query.maxPrice) : "");
  const clean = (v: string) => v.replace(/[^\d]/g, "");

  const apply = () => {
    commit((p) => {
      if (min) p.set("min", min);
      else p.delete("min");
      if (max) p.set("max", max);
      else p.delete("max");
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-ink-dim">
            ৳
          </span>
          <input
            inputMode="numeric"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(clean(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            className="w-full rounded-lg border border-line bg-surface py-2 pl-6 pr-2 text-sm text-ink outline-none transition placeholder:text-ink-dim focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <span className="text-ink-dim">–</span>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-ink-dim">
            ৳
          </span>
          <input
            inputMode="numeric"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(clean(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            className="w-full rounded-lg border border-line bg-surface py-2 pl-6 pr-2 text-sm text-ink outline-none transition placeholder:text-ink-dim focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={apply}
        className="mt-2.5 w-full rounded-lg bg-muted py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
      >
        Apply price
      </button>
    </div>
  );
}

export function FilterPanel({
  facets,
  query,
  showCategories = true,
}: {
  facets: Facets;
  query: ShopQuery;
  showCategories?: boolean;
}) {
  const { commit } = useShopNav();

  const selectCategory = (slug?: string) =>
    commit((p) => {
      if (slug) p.set("category", slug);
      else p.delete("category");
      // Price bounds are category-relative — reset them on context switch.
      p.delete("min");
      p.delete("max");
      p.delete("brand");
    });

  const toggleBrand = (slug: string) =>
    commit((p) => {
      const next = new Set(query.brands);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      if (next.size) p.set("brand", [...next].join(","));
      else p.delete("brand");
    });

  const toggleInStock = () =>
    commit((p) => {
      if (query.inStock) p.delete("stock");
      else p.set("stock", "in");
    });

  const setRating = (r: number) =>
    commit((p) => {
      if (query.minRating === r) p.delete("rating");
      else p.set("rating", String(r));
    });

  return (
    <div>
      {showCategories && (
        <Section title="Category">
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => selectCategory(undefined)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                !query.category
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-ink-soft hover:bg-muted hover:text-ink",
              )}
            >
              <span className="grid h-6 w-6 place-items-center">
                <span className="h-2 w-2 rounded-full bg-current" />
              </span>
              All Products
            </button>
            {categories.map((cat) => {
              const active = query.category === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => selectCategory(cat.slug)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                    active
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-ink-soft hover:bg-muted hover:text-ink",
                  )}
                >
                  <CategoryIcon icon={cat.icon} size={18} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Availability">
        <Checkbox
          checked={query.inStock}
          onChange={toggleInStock}
          label="In stock only"
        />
      </Section>

      <Section title="Price range">
        <PriceSection
          key={`${query.minPrice ?? ""}-${query.maxPrice ?? ""}`}
          query={query}
        />
        {(facets.priceMin > 0 || facets.priceMax > 0) && (
          <p className="mt-2 text-xs text-ink-dim">
            {formatBDT(facets.priceMin)} – {formatBDT(facets.priceMax)}
          </p>
        )}
      </Section>

      {facets.brands.length > 0 && (
        <Section title="Brand">
          <div className="flex flex-col">
            {facets.brands.map((b) => (
              <Checkbox
                key={b.slug}
                checked={query.brands.includes(b.slug)}
                onChange={() => toggleBrand(b.slug)}
                label={b.label}
                count={b.count}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Rating">
        <div className="flex flex-col gap-0.5">
          {[4, 3].map((r) => {
            const active = query.minRating === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition",
                  active
                    ? "bg-brand-50 font-semibold text-brand-700"
                    : "text-ink-soft hover:bg-muted",
                )}
              >
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={15}
                      filled={i < r}
                      className={i < r ? "text-amber-400" : "text-line-strong"}
                    />
                  ))}
                </span>
                &amp; up
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
