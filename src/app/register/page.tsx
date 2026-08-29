"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  async function handleGoogleSignup() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (done) {
    return (
      <Container className="flex min-h-[70vh] items-center justify-center py-14 text-center">
        <div className="max-w-sm">
          <h1 className="font-display text-2xl font-extrabold text-ink">Check your email</h1>
          <p className="mt-2 text-sm text-ink-soft">
            We&rsquo;ve sent a confirmation link to <span className="font-semibold text-ink">{email}</span>.
            Click it to activate your account.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="font-display text-2xl font-extrabold text-ink">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-soft">Join IT PARK FENI for faster checkout and order tracking.</p>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line-strong bg-surface text-sm font-semibold text-ink transition hover:bg-muted"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs font-medium text-ink-dim">
          <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft">Full Name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
