"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Phone, MapPin, Check } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { formatPhone } from "@/lib/format";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Contact Us</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Contact Us
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Questions about a product, order, or repair? Reach out — we usually reply within a few hours.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {sent ? (
            <div className="grid place-items-center rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
                <Check size={26} />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-ink">Message Sent!</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Thanks for reaching out — our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
                </Field>
                <Field label="Phone">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
                </Field>
                <Field label="Email">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
                </Field>
                <Field label="Subject">
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} placeholder="How can we help?" />
                </Field>
              </div>
              <Field label="Message" required>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClass} min-h-[120px] resize-y py-2.5`}
                  placeholder="Tell us what you need…"
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">{error}</p>
              )}

              <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Phone size={18} />
              </span>
              <div>
                <p className="text-xs text-ink-dim">Call or WhatsApp</p>
                <a href={`tel:${site.phone}`} className="text-sm font-bold text-ink hover:text-brand-700">
                  {formatPhone(site.phone)}
                </a>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                @
              </span>
              <div>
                <p className="text-xs text-ink-dim">Email</p>
                <a href={`mailto:${site.email}`} className="text-sm font-bold text-ink hover:text-brand-700">
                  {site.email}
                </a>
              </div>
            </div>
          </div>

          {site.showrooms.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{s.label}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{s.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-soft">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
