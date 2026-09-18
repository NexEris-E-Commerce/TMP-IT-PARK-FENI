"use client";

import { useTransition } from "react";
import {
  deleteBillboardSlide,
  moveBillboardSlide,
  toggleBillboardSlideEnabled,
} from "@/lib/actions/billboard";
import { cn } from "@/lib/cn";

export function BillboardSlideRowActions({
  id,
  enabled,
  isFirst,
  isLast,
}: {
  id: string;
  enabled: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={pending}
        onClick={() => startTransition(() => toggleBillboardSlideEnabled(id, !enabled))}
        title={enabled ? "Enabled — click to disable" : "Disabled — click to enable"}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition disabled:opacity-50",
          enabled ? "border-brand-700 bg-brand-600" : "border-line-strong bg-line-strong",
        )}
      >
        <span
          style={{ transform: enabled ? "translateX(22px)" : "translateX(2px)" }}
          className="inline-block h-5 w-5 rounded-full bg-white ring-1 ring-black/10 transition-transform"
        />
      </button>

      <button
        type="button"
        disabled={pending || isFirst}
        onClick={() => startTransition(() => moveBillboardSlide(id, "up"))}
        aria-label="Move up"
        className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-soft transition hover:bg-muted disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={pending || isLast}
        onClick={() => startTransition(() => moveBillboardSlide(id, "down"))}
        aria-label="Move down"
        className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-soft transition hover:bg-muted disabled:opacity-30"
      >
        ↓
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this slide? This can't be undone.")) {
            startTransition(() => deleteBillboardSlide(id));
          }
        }}
        className="rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
