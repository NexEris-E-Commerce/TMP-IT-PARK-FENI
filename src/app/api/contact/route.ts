import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, contactLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = await checkRateLimit(contactLimiter, `contact:${ip}`);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please wait a bit and try again." },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } },
    );
  }

  let body: { name?: string; email?: string; phone?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Please fill in your name and message." }, { status: 400 });
  }
  if (!body.email?.trim() && !body.phone?.trim()) {
    return NextResponse.json(
      { error: "Please provide an email or phone number so we can reply." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: body.name.trim(),
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    subject: body.subject?.trim() || null,
    message: body.message.trim(),
  });

  if (error) {
    console.error("Contact message insert failed:", error);
    return NextResponse.json({ error: "Couldn't send your message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
