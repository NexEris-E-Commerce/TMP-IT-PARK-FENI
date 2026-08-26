import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Price({
  price,
  regularPrice,
  size = "md",
  className,
}: {
  price: number;
  regularPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discounted = regularPrice != null && regularPrice > price;
  const priceSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-[15px]";
  const oldSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-display font-extrabold text-brand-700", priceSize)}>
        {formatBDT(price)}
      </span>
      {discounted && (
        <span className={cn("text-ink-dim line-through", oldSize)}>
          {formatBDT(regularPrice)}
        </span>
      )}
    </div>
  );
}
