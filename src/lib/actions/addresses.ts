"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getZone } from "@/lib/commerce";

export interface AddressFormState {
  error?: string;
  success?: boolean;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return { supabase, user };
}

export async function saveAddress(
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  let supabase, user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { error: "Please sign in to save an address." };
  }

  const id = String(formData.get("id") ?? "").trim() || null;
  const label = String(formData.get("label") ?? "").trim() || "Home";
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const zoneId = String(formData.get("zoneId") ?? "").trim();
  const addressLine = String(formData.get("addressLine") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim() || null;
  const isDefault = formData.get("isDefault") === "on";

  if (!fullName || !phone || !addressLine) {
    return { error: "Please fill in name, phone and address." };
  }
  if (!/^0\d{10}$/.test(phone)) {
    return { error: "Please enter a valid 11-digit Bangladeshi phone number (e.g. 01XXXXXXXXX)." };
  }
  if (!getZone(zoneId)) {
    return { error: "Please choose a valid delivery zone." };
  }

  // If this address is being marked default, clear the flag on the
  // person's other addresses first so there's only ever one default.
  if (isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const row = {
    user_id: user.id,
    label,
    full_name: fullName,
    phone,
    zone_id: zoneId,
    address_line: addressLine,
    city,
    is_default: isDefault,
  };

  const { error } = id
    ? await supabase.from("addresses").update(row).eq("id", id).eq("user_id", user.id)
    : await supabase.from("addresses").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(id: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(id: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  await supabase.from("addresses").update({ is_default: true }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/account/addresses");
}
