import type { Brand } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Brand wordmark tile for the homepage brand strip and Brands page. */
export function BrandTile({ brand, className }: { brand: Brand; className?: string }) {
  return (
    <div
      className={cn(
        "group flex h-16 w-full items-center justify-center rounded-xl border border-line bg-surface px-5 transition hover:border-brand-200 hover:shadow-sm",
        className,
      )}
    >
      <span
        className="font-display text-lg font-extrabold tracking-tight opacity-75 transition group-hover:opacity-100"
        style={{ color: brand.color }}
      >
        {brand.name}
      </span>
    </div>
  );
}
