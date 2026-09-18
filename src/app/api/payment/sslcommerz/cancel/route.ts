import { NextResponse } from "next/server";

/**
 * 303, not the 307 NextResponse.redirect() defaults to — see the comment in
 * the fail route for why: SSLCommerz POSTs here, and without 303 the
 * browser replays that POST onto /checkout, which 405s since it only
 * handles GET/HEAD.
 */
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/checkout?error=payment_cancelled`, 303);
}

export const GET = POST;
