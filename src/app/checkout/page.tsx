"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/format";
import { DELIVERY_ZONES, deliveryFee, getZone } from "@/lib/commerce";
import { cn } from "@/lib/cn";

const ERROR_MESSAGES: Record<string, string> = {
  payment_not_configured:
    "Online payment isn't switched on yet — please choose Cash on Delivery, or contact us to pay another way.",
  payment_failed: "Your payment didn't go through. You can try again or choose Cash on Delivery.",
  payment_cancelled: "Payment was cancelled. Your order details are still saved below — try again anytime.",
  payment_verification_failed: "We couldn't verify that payment. Please contact us before retrying.",
  payment_init_failed: "Couldn't start the payment session. Please try again in a moment.",
  order_not_found: "We couldn't find that order. Please start checkout again.",
  missing_order: "Something went wrong starting checkout. Please try again.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const params = useSearchParams();
  const errorCode = params.get("error");
  const { lines, subtotal, clear } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "sslcommerz">("cod");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const zone = getZone(zoneId);
  const fee = useMemo(() => deliveryFee(zone, subtotal), [zone, subtotal]);
  const total = subtotal + fee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim() || !addressLine.trim()) {
      setFormError("Please fill in your name, phone and address.");
      return;
    }
    if (!/^0\d{10}$/.test(phone.trim())) {
      setFormError("Please enter a valid 11-digit Bangladeshi phone number (e.g. 01XXXXXXXXX).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.productId,
            slug: l.slug,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
          })),
          fullName,
          phone,
          email: email || undefined,
          zoneId,
          addressLine,
          city: city || undefined,
          paymentMethod,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(data.redirect ?? "/checkout/success");
    } catch {
      setFormError("Network error — please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink-soft">Add something to your cart before checking out.</p>
        <Button href="/shop" className="mt-6">
          Go to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/cart" className="transition hover:text-brand-700">
          Cart
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Checkout</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Checkout
      </h1>

      {errorCode && ERROR_MESSAGES[errorCode] && (
        <div className="mt-4 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {ERROR_MESSAGES[errorCode]}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery details */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-ink">Delivery Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Rahim Uddin"
                />
              </Field>
              <Field label="Phone Number" required>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="01XXXXXXXXX"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Email (optional)">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="City / Area">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Feni Sadar"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Full Address" required>
                  <textarea
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className={cn(inputClass, "min-h-[88px] resize-y py-2.5")}
                    placeholder="House, road, area, landmark"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Order Notes (optional)">
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Call before delivery"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Delivery zone */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-ink">Delivery Zone</h2>
            <div className="mt-4 space-y-2.5">
              {DELIVERY_ZONES.map((z) => (
                <label
                  key={z.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition",
                    zoneId === z.id
                      ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                      : "border-line hover:border-brand-200",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="zone"
                      checked={zoneId === z.id}
                      onChange={() => setZoneId(z.id)}
                      className="h-4 w-4 accent-brand-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {z.label} <span className="text-ink-dim">· {z.labelBn}</span>
                      </p>
                      <p className="text-xs text-ink-dim">{z.eta}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-ink">
                    {subtotal >= 5000 ? "Free" : formatBDT(z.fee)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-ink">Payment Method</h2>
            <div className="mt-4 space-y-2.5">
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition",
                  paymentMethod === "cod"
                    ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                    : "border-line hover:border-brand-200",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4 accent-brand-600"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">Cash on Delivery</p>
                  <p className="text-xs text-ink-dim">Pay when your order arrives</p>
                </div>
              </label>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition",
                  paymentMethod === "sslcommerz"
                    ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                    : "border-line hover:border-brand-200",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "sslcommerz"}
                  onChange={() => setPaymentMethod("sslcommerz")}
                  className="h-4 w-4 accent-brand-600"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">bKash / Nagad / Rocket / Card</p>
                  <p className="text-xs text-ink-dim">Pay online via SSLCommerz</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-3 text-ink-soft">
                <span className="line-clamp-1">
                  {l.name} <span className="text-ink-dim">×{l.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-ink">{formatBDT(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery ({zone?.label})</span>
              <span className="font-semibold text-ink">{fee === 0 ? "Free" : formatBDT(fee)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatBDT(total)}</span>
          </div>

          {formError && (
            <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={submitting} className="mt-5 w-full">
            {submitting ? "Placing order…" : "Place Order"}
          </Button>
        </div>
      </form>
    </Container>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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
