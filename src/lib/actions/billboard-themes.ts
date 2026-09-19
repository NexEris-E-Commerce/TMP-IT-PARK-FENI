"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface BillboardThemeFormState {
  error?: string;
}

export interface AdminBillboardTheme {
  id: string;
  name: string;
  slug: string | null;
  isBuiltin: boolean;
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

function mapRow(row: Record<string, unknown>): AdminBillboardTheme {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: (row.slug as string | null) ?? null,
    isBuiltin: row.is_builtin as boolean,
    gradientFrom: row.gradient_from as string,
    gradientVia: (row.gradient_via as string | null) ?? null,
    gradientTo: row.gradient_to as string,
    glowColor: row.glow_color as string,
    eyebrowColor: row.eyebrow_color as string,
    titleColor: row.title_color as string,
    highlightColor: row.highlight_color as string,
    subtitleColor: row.subtitle_color as string,
    plaqueColor: row.plaque_color as string,
  };
}

/** Built-ins first, then custom themes newest-first — for theme pickers and the /admin/billboard/themes list. */
export async function getBillboardThemes(): Promise<AdminBillboardTheme[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("billboard_themes")
    .select("*")
    .order("is_builtin", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch billboard themes:", error);
    return [];
  }
  return (data ?? []).map(mapRow);
}

function buildThemePayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const gradientVia = String(formData.get("gradientVia") ?? "").trim();

  return {
    name,
    gradient_from: String(formData.get("gradientFrom") ?? "#2239bb").trim(),
    gradient_via: gradientVia || null,
    gradient_to: String(formData.get("gradientTo") ?? "#6a3cef").trim(),
    glow_color: String(formData.get("glowColor") ?? "#9174ff").trim(),
    eyebrow_color: String(formData.get("eyebrowColor") ?? "#ffffff").trim(),
    title_color: String(formData.get("titleColor") ?? "#ffffff").trim(),
    highlight_color: String(formData.get("highlightColor") ?? "#ffffff").trim(),
    subtitle_color: String(formData.get("subtitleColor") ?? "#e5e7eb").trim(),
    plaque_color: String(formData.get("plaqueColor") ?? "#000000").trim(),
  };
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function validateThemePayload(payload: ReturnType<typeof buildThemePayload>): string | null {
  if (!payload.name) return "Give this theme a name.";
  const colorFields: [string, string | null][] = [
    ["Gradient start", payload.gradient_from],
    ["Gradient end", payload.gradient_to],
    ["Glow", payload.glow_color],
    ["Eyebrow text", payload.eyebrow_color],
    ["Title text", payload.title_color],
    ["Highlight text", payload.highlight_color],
    ["Subtitle text", payload.subtitle_color],
    ["Photo backdrop", payload.plaque_color],
  ];
  for (const [label, value] of colorFields) {
    if (value && !HEX_RE.test(value)) return `${label} color must be a valid hex color (e.g. #2a49dd).`;
  }
  if (payload.gradient_via && !HEX_RE.test(payload.gradient_via)) {
    return "Gradient middle color must be a valid hex color (e.g. #2a49dd).";
  }
  return null;
}

export async function createBillboardTheme(
  _prev: BillboardThemeFormState,
  formData: FormData,
): Promise<BillboardThemeFormState> {
  await requireAdmin();
  const payload = buildThemePayload(formData);
  const error = validateThemePayload(payload);
  if (error) return { error };

  const supabase = createAdminClient();
  const { error: insertError } = await supabase.from("billboard_themes").insert({ ...payload, is_builtin: false });
  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/billboard/themes");
  revalidatePath("/admin/billboard");
  return {};
}

/** Used both by the standalone theme form and by "save these colors as a new theme" from inside a slide's color pickers. Returns the new theme's id so a slide form can select it immediately. */
export async function createBillboardThemeFromColors(colors: {
  name: string;
  gradientFrom: string;
  gradientVia: string | null;
  gradientTo: string;
  glowColor: string;
  eyebrowColor: string;
  titleColor: string;
  highlightColor: string;
  subtitleColor: string;
  plaqueColor: string;
}): Promise<{ id?: string; error?: string }> {
  await requireAdmin();
  if (!colors.name.trim()) return { error: "Give this theme a name." };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("billboard_themes")
    .insert({
      name: colors.name.trim(),
      is_builtin: false,
      gradient_from: colors.gradientFrom,
      gradient_via: colors.gradientVia,
      gradient_to: colors.gradientTo,
      glow_color: colors.glowColor,
      eyebrow_color: colors.eyebrowColor,
      title_color: colors.titleColor,
      highlight_color: colors.highlightColor,
      subtitle_color: colors.subtitleColor,
      plaque_color: colors.plaqueColor,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/billboard/themes");
  revalidatePath("/admin/billboard");
  return { id: data.id };
}

export async function updateBillboardTheme(
  id: string,
  _prev: BillboardThemeFormState,
  formData: FormData,
): Promise<BillboardThemeFormState> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: existing } = await supabase.from("billboard_themes").select("is_builtin").eq("id", id).single();
  if (existing?.is_builtin) return { error: "Built-in themes can't be edited — save your changes as a new theme instead." };

  const payload = buildThemePayload(formData);
  const error = validateThemePayload(payload);
  if (error) return { error };

  const { error: updateError } = await supabase.from("billboard_themes").update(payload).eq("id", id);
  if (updateError) return { error: updateError.message };

  revalidatePath("/admin/billboard/themes");
  revalidatePath("/admin/billboard");
  return {};
}

export async function deleteBillboardTheme(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: existing } = await supabase.from("billboard_themes").select("is_builtin").eq("id", id).single();
  if (existing?.is_builtin) return { error: "Built-in themes can't be deleted." };

  await supabase.from("billboard_themes").delete().eq("id", id);
  revalidatePath("/admin/billboard/themes");
  revalidatePath("/admin/billboard");
  return {};
}
