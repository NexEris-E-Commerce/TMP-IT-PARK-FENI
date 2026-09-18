export interface BillboardTheme {
  id: string;
  label: string;
  gradient: string;
  glow: string;
}

/**
 * Fixed palette an admin picks from at /admin/billboard, rather than free-form
 * color input — keeps every slide visually consistent with the rest of the
 * site's design tokens instead of admins picking arbitrary colors.
 */
export const BILLBOARD_THEMES: BillboardTheme[] = [
  {
    id: "brand",
    label: "Brand Blue",
    gradient: "from-brand-700 via-brand-600 to-accent-600",
    glow: "bg-accent-400/40",
  },
  {
    id: "accent",
    label: "Accent Purple",
    gradient: "from-accent-700 via-brand-700 to-brand-600",
    glow: "bg-brand-300/40",
  },
  {
    id: "dark",
    label: "Deep Ink",
    gradient: "from-ink via-brand-800 to-accent-700",
    glow: "bg-accent-500/40",
  },
];

export function getBillboardTheme(id: string | null | undefined): BillboardTheme {
  return BILLBOARD_THEMES.find((t) => t.id === id) ?? BILLBOARD_THEMES[0];
}
