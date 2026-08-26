/**
 * Formatting helpers for the Bangladesh market (BDT currency, phone, dates).
 */

/**
 * Format an amount as Bangladeshi Taka.
 * Uses Western grouping (e.g. ৳125,000) to match common BD retail sites.
 */
export function formatBDT(amount: number, opts?: { decimals?: boolean }): string {
  const value = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(Math.max(0, Math.round(opts?.decimals ? amount * 100 : amount) / (opts?.decimals ? 100 : 1)));
  return `৳${value}`;
}

/** Compact taka for tight spaces (e.g. ৳1.25L, ৳45k). */
export function formatBDTCompact(amount: number): string {
  if (amount >= 10_000_000) return `৳${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `৳${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1_000) return `৳${Math.round(amount / 1_000)}k`;
  return formatBDT(amount);
}

/** Format a BD phone number for display: 01974-862253. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return raw;
}
