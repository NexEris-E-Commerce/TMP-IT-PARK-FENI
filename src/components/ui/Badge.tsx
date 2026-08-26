import { cn } from "@/lib/cn";

type Tone = "danger" | "success" | "warn" | "brand" | "accent" | "neutral" | "glass";

const tones: Record<Tone, string> = {
  danger: "bg-danger text-white",
  success: "bg-success-soft text-success",
  warn: "bg-warn-soft text-warn",
  brand: "bg-brand-600 text-white",
  accent: "bg-accent-600 text-white",
  neutral: "bg-muted text-ink-soft",
  glass: "bg-white/80 text-ink backdrop-blur-sm border border-white/60",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
