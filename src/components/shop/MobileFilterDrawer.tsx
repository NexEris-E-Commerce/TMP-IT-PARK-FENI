"use client";

import { useEffect, useState } from "react";
import { Sliders, Close } from "../ui/icons";
import { activeFilterCount, type Facets, type ShopQuery } from "@/lib/shop";
import { cn } from "@/lib/cn";
import { FilterPanel } from "./FilterPanel";

export function MobileFilterDrawer({
  facets,
  query,
  total,
  showCategories = true,
}: {
  facets: Facets;
  query: ShopQuery;
  total: number;
  showCategories?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(query);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink transition hover:border-brand-300 lg:hidden"
      >
        <Sliders size={17} />
        Filters
        {count > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-surface shadow-glass transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-4">
            <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-muted"
            >
              <Close size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <FilterPanel facets={facets} query={query} showCategories={showCategories} />
          </div>

          <div className="border-t border-line bg-canvas px-4 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Show {total} {total === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
