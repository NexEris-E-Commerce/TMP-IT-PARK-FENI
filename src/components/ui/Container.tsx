import { cn } from "@/lib/cn";

/** Centered max-width page container with responsive gutters. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}
