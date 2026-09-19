"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface BillboardSlideFormState {
  error?: string;
}

export interface AdminBillboardSlideRow {
  id: string;
  sortOrder: number;
  enabled: boolean;
  mode: "manual" | "category" | "tag" | "random";
  productId: string | null;
  productName: string | null;
  category: string | null;
  tag: string | null;
  eyebrow: string | null;
  title: string | null;
  highlight: string | null;
  subtitle: string | null;
  primaryLabel: string | null;
  primaryHref: string | null;
  secondaryLabel: string | null;
  secondaryHref: string | null;
  themeId: string | null;
  backgroundImage: string | null;
  eyebrowColor: string | null;
  titleColor: string | null;
  highlightColor: string | null;
  subtitleColor: string | null;
}

/** All slides (enabled or not), for the /admin/billboard list + edit forms. */
export async function getAdminBillboardSlides(): Promise<AdminBillboardSlideRow[]> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("homepage_billboard_slides")
    .select("*, products(name)")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch billboard slides:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    sortOrder: row.sort_order,
    enabled: row.enabled,
    mode: row.mode,
    productId: row.product_id,
    productName: (row.products as { name: string } | null)?.name ?? null,
    category: row.category,
    tag: row.tag,
    eyebrow: row.eyebrow,
    title: row.title,
    highlight: row.highlight,
    subtitle: row.subtitle,
    primaryLabel: row.primary_label,
    primaryHref: row.primary_href,
    secondaryLabel: row.secondary_label,
    secondaryHref: row.secondary_href,
    themeId: row.theme_id,
    backgroundImage: row.background_image,
    eyebrowColor: row.eyebrow_color,
    titleColor: row.title_color,
    highlightColor: row.highlight_color,
    subtitleColor: row.subtitle_color,
  }));
}

/** For the "Specific Product" mode picker, and to drive the live preview when that product is selected. */
export interface ProductPickerOption {
  id: string;
  name: string;
  price: number;
  image: string | null;
  rating: number | null;
  category: string;
  keySpec: string | null;
  slug: string;
}

export async function getProductPickerOptions(): Promise<ProductPickerOption[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price, image, rating, category, key_spec, slug")
    .order("name", { ascending: true });
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    rating: p.rating,
    category: p.category,
    keySpec: p.key_spec,
    slug: p.slug,
  }));
}

/** For the "Tag" mode's autocomplete — every distinct tag currently in use. */
export async function getDistinctProductTags(): Promise<string[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase.from("products").select("tags");
  const set = new Set<string>();
  for (const row of data ?? []) {
    for (const t of row.tags ?? []) set.add(t);
  }
  return Array.from(set).sort();
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function buildPayload(formData: FormData) {
  const mode = String(formData.get("mode") ?? "manual") as "manual" | "category" | "tag" | "random";
  const themeId = String(formData.get("themeId") ?? "").trim() || null;

  const colorOverride = (field: string) => {
    const v = String(formData.get(field) ?? "").trim();
    return v && HEX_RE.test(v) ? v : null;
  };

  return {
    mode,
    product_id: mode === "manual" ? String(formData.get("productId") ?? "").trim() || null : null,
    category: mode === "category" ? String(formData.get("category") ?? "").trim() || null : null,
    tag: mode === "tag" ? String(formData.get("tag") ?? "").trim().toLowerCase() || null : null,
    eyebrow: String(formData.get("eyebrow") ?? "").trim() || null,
    title: String(formData.get("title") ?? "").trim() || null,
    highlight: String(formData.get("highlight") ?? "").trim() || null,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    primary_label: String(formData.get("primaryLabel") ?? "").trim() || null,
    primary_href: String(formData.get("primaryHref") ?? "").trim() || null,
    secondary_label: String(formData.get("secondaryLabel") ?? "").trim() || null,
    secondary_href: String(formData.get("secondaryHref") ?? "").trim() || null,
    theme_id: themeId,
    background_image: String(formData.get("backgroundImage") ?? "").trim() || null,
    eyebrow_color: colorOverride("eyebrowColor"),
    title_color: colorOverride("titleColor"),
    highlight_color: colorOverride("highlightColor"),
    subtitle_color: colorOverride("subtitleColor"),
    enabled: formData.get("enabled") === "on",
  };
}

function validate(payload: ReturnType<typeof buildPayload>): string | null {
  if (payload.mode === "manual" && !payload.product_id) return "Pick a product for \"Specific Product\" mode.";
  if (payload.mode === "category" && !payload.category) return "Pick a category for \"Category\" mode.";
  if (payload.mode === "tag" && !payload.tag) return "Enter a tag for \"Tag\" mode.";
  if (!payload.theme_id) return "Pick a theme.";
  return null;
}

export async function createBillboardSlide(
  _prev: BillboardSlideFormState,
  formData: FormData,
): Promise<BillboardSlideFormState> {
  await requireAdmin();

  const payload = buildPayload(formData);
  const error = validate(payload);
  if (error) return { error };

  const supabase = createAdminClient();

  const { data: maxRow } = await supabase
    .from("homepage_billboard_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error: insertError } = await supabase
    .from("homepage_billboard_slides")
    .insert({ ...payload, sort_order: nextSortOrder });

  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/billboard");
  revalidatePath("/");
  redirect("/admin/billboard");
}

export async function updateBillboardSlide(
  id: string,
  _prev: BillboardSlideFormState,
  formData: FormData,
): Promise<BillboardSlideFormState> {
  await requireAdmin();

  const payload = buildPayload(formData);
  const error = validate(payload);
  if (error) return { error };

  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from("homepage_billboard_slides")
    .update(payload)
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/admin/billboard");
  revalidatePath("/");
  redirect("/admin/billboard");
}

export async function deleteBillboardSlide(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("homepage_billboard_slides").delete().eq("id", id);
  revalidatePath("/admin/billboard");
  revalidatePath("/");
}

export async function toggleBillboardSlideEnabled(id: string, enabled: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("homepage_billboard_slides").update({ enabled }).eq("id", id);
  revalidatePath("/admin/billboard");
  revalidatePath("/");
}

/** Swaps this slide's sort_order with its neighbor in the given direction. */
export async function moveBillboardSlide(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: rows } = await supabase
    .from("homepage_billboard_slides")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (!rows) return;
  const index = rows.findIndex((r) => r.id === id);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || neighborIndex < 0 || neighborIndex >= rows.length) return;

  const current = rows[index];
  const neighbor = rows[neighborIndex];

  await Promise.all([
    supabase.from("homepage_billboard_slides").update({ sort_order: neighbor.sort_order }).eq("id", current.id),
    supabase.from("homepage_billboard_slides").update({ sort_order: current.sort_order }).eq("id", neighbor.id),
  ]);

  revalidatePath("/admin/billboard");
  revalidatePath("/");
}
