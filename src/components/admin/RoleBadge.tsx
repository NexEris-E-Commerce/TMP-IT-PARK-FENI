import { cn } from "@/lib/cn";

/**
 * Read-only status pill shown to admins who aren't super admins — they can
 * see who has admin/super admin access but can't change it.
 */
export function RoleBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        active ? "bg-brand-600/10 text-brand-700" : "bg-muted text-ink-dim",
      )}
    >
      {active ? label : "—"}
    </span>
  );
}
