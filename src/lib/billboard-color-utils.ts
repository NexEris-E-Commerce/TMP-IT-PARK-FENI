/** Converts "#rrggbb" (or a bare "rrggbb") to "rgba(r, g, b, alpha)". Falls back to a plain black tint if the input isn't a valid hex color, so a bad value never crashes rendering. */
export function hexToRgba(hex: string | null | undefined, alpha: number): string {
  const clean = (hex ?? "").replace("#", "");
  const isValid = /^[0-9a-fA-F]{6}$/.test(clean);
  const value = isValid ? clean : "000000";
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface BillboardThemeColors {
  gradientFrom: string;
  gradientVia: string | null;
  gradientTo: string;
  glowColor: string;
  eyebrowColor: string;
  titleColor: string;
  highlightColor: string;
  subtitleColor: string;
  plaqueColor: string;
}

/** CSS linear-gradient value for a theme's background (used inline, since these colors are admin-chosen and can't be Tailwind utility classes). */
export function gradientCss(t: Pick<BillboardThemeColors, "gradientFrom" | "gradientVia" | "gradientTo">): string {
  const stops = t.gradientVia ? [t.gradientFrom, t.gradientVia, t.gradientTo] : [t.gradientFrom, t.gradientTo];
  return `linear-gradient(to bottom right, ${stops.join(", ")})`;
}
