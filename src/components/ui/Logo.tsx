import { cn } from "@/lib/cn";

/**
 * IT PARK FENI brand lockup — a gradient "it" mark + wordmark + tagline.
 * A real uploaded logo can replace this in Phase 5 (Homepage CMS / Settings).
 */
export function Logo({
  className,
  showTagline = true,
  size = "md",
}: {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const mark = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const word = size === "lg" ? "text-[22px]" : size === "sm" ? "text-base" : "text-[19px]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-[0_8px_18px_-6px_rgba(42,73,221,0.6)]",
          mark,
        )}
      >
        <span className="font-display font-extrabold leading-none tracking-tight">
          it
        </span>
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white/90" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-extrabold tracking-tight text-ink", word)}>
          IT <span className="text-accent-600">PARK</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-dim">
            Complete IT Solution
          </span>
        )}
      </span>
    </span>
  );
}
