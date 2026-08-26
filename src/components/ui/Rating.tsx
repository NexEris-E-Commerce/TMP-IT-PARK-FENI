import { Star } from "./icons";
import { cn } from "@/lib/cn";

export function Rating({
  value,
  count,
  size = 14,
  showValue = true,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            filled={i <= rounded}
            className={i <= rounded ? "text-amber-400" : "text-line-strong"}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-ink-soft">{value.toFixed(1)}</span>
      )}
      {count != null && <span className="text-xs text-ink-dim">({count})</span>}
    </span>
  );
}
