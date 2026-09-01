import "server-only";
import { createAdminClient } from "./supabase/admin";

export interface SslcommerzConfig {
  storeId: string;
  storePassword: string;
  sandbox: boolean;
}

/**
 * Resolves SSLCommerz credentials: the admin-managed `payment_settings` row
 * (set from /admin/settings) takes priority; falls back to
 * SSLCOMMERZ_STORE_ID / SSLCOMMERZ_STORE_PASSWORD / SSLCOMMERZ_SANDBOX env
 * vars if the row is empty. Returns null if neither source has credentials
 * — callers should treat that as "online payment isn't configured yet".
 */
export async function getSslcommerzConfig(): Promise<SslcommerzConfig | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("payment_settings")
    .select("store_id, store_password, sandbox")
    .eq("id", "sslcommerz")
    .single();

  const storeId = data?.store_id || process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = data?.store_password || process.env.SSLCOMMERZ_STORE_PASSWORD;
  const sandbox = data?.store_id ? data.sandbox : process.env.SSLCOMMERZ_SANDBOX !== "false";

  if (!storeId || !storePassword) return null;

  return { storeId, storePassword, sandbox };
}
