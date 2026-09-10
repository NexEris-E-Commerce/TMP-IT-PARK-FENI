"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SearchConsoleSettingsFormState {
  error?: string;
  success?: boolean;
}

export interface SearchConsoleSettings {
  metaTagContent: string;
  htmlFileName: string;
  htmlFileContent: string;
  gaMeasurementId: string;
  gtmContainerId: string;
}

export async function getSearchConsoleSettings(): Promise<SearchConsoleSettings> {
  await requireSuperAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("search_console_settings")
    .select("meta_tag_content, html_file_name, html_file_content, ga_measurement_id, gtm_container_id")
    .eq("id", "google_search_console")
    .single();

  return {
    metaTagContent: data?.meta_tag_content ?? "",
    htmlFileName: data?.html_file_name ?? "",
    htmlFileContent: data?.html_file_content ?? "",
    gaMeasurementId: data?.ga_measurement_id ?? "",
    gtmContainerId: data?.gtm_container_id ?? "",
  };
}

/**
 * Pulls the `content="..."` value out of a pasted <meta> tag, or returns
 * the input unchanged if it's already just the bare code — so the admin
 * can paste whichever Google showed them without thinking about it.
 */
function extractMetaContent(input: string): string {
  const match = input.match(/content\s*=\s*["']([^"']+)["']/i);
  return (match ? match[1] : input).trim();
}

/**
 * Google's downloadable verification file is named googleXXXXXXXX.html and
 * its one line of content is literally "google-site-verification: <that
 * same filename>". So the filename never needs to be typed separately —
 * it's derived from the pasted file content.
 */
function deriveHtmlFileName(content: string): string | null {
  const match = content.match(/google-site-verification:\s*(google[a-z0-9]+\.html)/i);
  return match ? match[1] : null;
}

export async function updateSearchConsoleSettings(
  _prev: SearchConsoleSettingsFormState,
  formData: FormData,
): Promise<SearchConsoleSettingsFormState> {
  await requireSuperAdmin();

  const metaTagInput = String(formData.get("metaTagContent") ?? "").trim();
  const htmlFileInput = String(formData.get("htmlFileContent") ?? "").trim();
  const gaMeasurementId = String(formData.get("gaMeasurementId") ?? "").trim();
  const gtmContainerId = String(formData.get("gtmContainerId") ?? "").trim();

  if (gaMeasurementId && !/^G-[A-Z0-9]+$/i.test(gaMeasurementId)) {
    return { error: "Google Analytics ID should look like G-XXXXXXXXXX." };
  }
  if (gtmContainerId && !/^GTM-[A-Z0-9]+$/i.test(gtmContainerId)) {
    return { error: "Google Tag Manager ID should look like GTM-XXXXXXX." };
  }

  let htmlFileName = "";
  let htmlFileContent = "";
  if (htmlFileInput) {
    const derived = deriveHtmlFileName(htmlFileInput);
    if (!derived) {
      return {
        error:
          "Couldn't find a googleXXXXXXXX.html filename inside that file's content — paste the exact contents of the file Google gave you to download.",
      };
    }
    htmlFileName = derived;
    htmlFileContent = htmlFileInput;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("search_console_settings")
    .update({
      meta_tag_content: metaTagInput ? extractMetaContent(metaTagInput) : null,
      html_file_name: htmlFileName || null,
      html_file_content: htmlFileContent || null,
      ga_measurement_id: gaMeasurementId || null,
      gtm_container_id: gtmContainerId || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "google_search_console");

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
