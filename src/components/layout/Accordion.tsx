"use client";

import { useState } from "react";
import { ChevronDown } from "../ui/icons";
import { cn } from "@/lib/cn";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
          >
            <span className="text-sm font-semibold text-ink">{item.q}</span>
            <ChevronDown
              size={18}
              className={cn("shrink-0 text-ink-dim transition-transform", open === i && "rotate-180")}
            />
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm leading-relaxed text-ink-soft sm:px-5 sm:pb-5">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
