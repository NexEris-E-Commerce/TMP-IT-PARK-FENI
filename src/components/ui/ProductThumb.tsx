import { getCategory } from "@/lib/data/categories";
import { CategoryIcon } from "./CategoryIcon";
import { cn } from "@/lib/cn";

/**
 * Generated product image placeholder — a soft branded panel with the
 * category glyph. Reads as intentional design while the catalog has no
 * uploaded photography (admin image upload arrives in Phase 5).
 */
export function ProductThumb({
  category,
  name,
  className,
  iconSize = 60,
}: {
  category: string;
  name: string;
  className?: string;
  iconSize?: number;
}) {
  const cat = getCategory(category);
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-muted via-white to-brand-50/40",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(42,73,221,0.09)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-200/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-accent-200/40 blur-2xl" />
      <CategoryIcon
        icon={cat?.icon ?? "grid"}
        size={iconSize}
        strokeWidth={1.1}
        className="relative text-brand-500/75"
      />
    </div>
  );
}
