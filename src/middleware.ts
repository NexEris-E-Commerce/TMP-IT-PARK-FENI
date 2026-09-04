import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every navigation so server
 * components always see a valid (non-expired) session cookie.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // If Supabase isn't configured yet, don't block the app — just pass through.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  // Most traffic on a storefront (shop, product pages, home) is anonymous
  // browsing with no Supabase session cookie at all. `getUser()` below makes
  // a real network round-trip to Supabase's Auth server to validate the
  // token — worth it when there's a session to refresh, but pure overhead
  // (and a real source of multi-second navigation delays) when there isn't
  // one. Skip the network call entirely when no auth cookie is present.
  const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
  if (!hasAuthCookie) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }) => response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
