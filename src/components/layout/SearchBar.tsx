"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "../ui/icons";
import { cn } from "@/lib/cn";

/** Storefront search. Submits to /search; empty query falls back to /shop. */
export function SearchBar({
  className,
  autoFocus,
  onSubmitted,
}: {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/shop");
        onSubmitted?.();
      }}
      className={cn(
        "flex h-11 w-full items-center overflow-hidden rounded-xl border border-line-strong bg-surface pl-1 transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/15",
        className,
      )}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search laptops, components, printers…"
        aria-label="Search products"
        className="h-full flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-dim"
      />
      <button
        type="submit"
        aria-label="Search"
        className="mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700 focus-ring"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
