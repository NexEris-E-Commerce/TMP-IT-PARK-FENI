import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Google's "HTML file" Search Console verification method requires hosting
 * a specific file (e.g. /google1a2b3c4d5e6f7g8h.html) at the site root with
 * exact content. Since the filename is only known once an admin pastes it
 * in /admin/settings, it's served dynamically here rather than as a static
 * file — this route only ever responds to that one exact, current filename
 * and 404s for everything else, so it can't be used to serve arbitrary
 * content at arbitrary paths.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ googleVerificationFile: string }> }) {
  const { googleVerificationFile } = await params;

  if (!/^google[a-z0-9]+\.html$/i.test(googleVerificationFile)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("search_console_settings")
    .select("html_file_name, html_file_content")
    .eq("id", "google_search_console")
    .single();

  if (!data?.html_file_name || data.html_file_name !== googleVerificationFile || !data.html_file_content) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(data.html_file_content, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
