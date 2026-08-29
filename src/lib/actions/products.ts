"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ProductFormState {
  error?: string;
}

import { parseSpecs } from "@/lib/product-form-helpers";

function num(fd: FormData, key: string): number | null {
  const raw = fd.get(key);
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const price = num(formData, "price");

  if (!name || !slug || price === null) {
    return { error: "Name, slug and price are required." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert({
    name,
    slug,
    brand: String(formData.get("brand") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim() || null,
    price,
    regular_price: num(formData, "regularPrice"),
    stock: num(formData, "stock") ?? 0,
    low_stock_threshold: num(formData, "lowStockThreshold") ?? 3,
    key_spec: String(formData.get("keySpec") ?? "").trim() || null,
    warranty: String(formData.get("warranty") ?? "").trim() || null,
    specs: parseSpecs(String(formData.get("specs") ?? "")),
    is_featured: formData.get("isFeatured") === "on",
    is_best_seller: formData.get("isBestSeller") === "on",
    is_deal: formData.get("isDeal") === "on",
  });

  if (error) {
    return { error: error.message.includes("duplicate") ? "A product with this slug already exists." : error.message };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const price = num(formData, "price");

  if (!name || !slug || price === null) {
    return { error: "Name, slug and price are required." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      brand: String(formData.get("brand") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim() || null,
      price,
      regular_price: num(formData, "regularPrice"),
      stock: num(formData, "stock") ?? 0,
      low_stock_threshold: num(formData, "lowStockThreshold") ?? 3,
      key_spec: String(formData.get("keySpec") ?? "").trim() || null,
      warranty: String(formData.get("warranty") ?? "").trim() || null,
      specs: parseSpecs(String(formData.get("specs") ?? "")),
      is_featured: formData.get("isFeatured") === "on",
      is_best_seller: formData.get("isBestSeller") === "on",
      is_deal: formData.get("isDeal") === "on",
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
}
