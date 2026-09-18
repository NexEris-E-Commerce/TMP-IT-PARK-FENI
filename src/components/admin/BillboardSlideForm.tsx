"use client";

import { useActionState, useState } from "react";
import { categories } from "@/lib/data/categories";
import { BILLBOARD_THEMES } from "@/lib/billboard-themes";
import { ImageUploadField } from "./ImageUploadField";
import type { AdminBillboardSlideRow, BillboardSlideFormState } from "@/lib/actions/billboard";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

const MODES = [
  { id: "manual", label: "Specific Product", hint: "Always shows the exact product you pick." },
  { id: "category", label: "Category", hint: "Shows a product from a category you pick (re-picked on each visit)." },
  { id: "tag", label: "Tag", hint: "Shows a product carrying a tag you pick (re-picked on each visit)." },
  { id: "random", label: "Random", hint: "Shows any in-stock product — different on every visit." },
] as const;

export function BillboardSlideForm({
  action,
  initial,
  submitLabel,
  products,
  existingTags,
}: {
  action: (prev: BillboardSlideFormState, formData: FormData) => Promise<BillboardSlideFormState>;
  initial?: AdminBillboardSlideRow;
  submitLabel: string;
  products: { id: string; name: string }[];
  existingTags: string[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [mode, setMode] = useState<string>(initial?.mode ?? "manual");

  return (
    <form action={formAction} className="space-y-6">
      {/* Mode picker */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">What this slide shows</span>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3.5 transition ${
                mode === m.id ? "border-brand-500 bg-brand-50/50 ring-1 ring-brand-500" : "border-line-strong hover:bg-muted"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <input
                  type="radio"
                  name="mode"
                  value={m.id}
                  checked={mode === m.id}
                  onChange={() => setMode(m.id)}
                  className="h-4 w-4 accent-brand-600"
                />
                {m.label}
              </span>
              <span className="text-xs text-ink-dim">{m.hint}</span>
            </label>
          ))}
        </div>

        {mode === "manual" && (
          <div className="mt-4">
            <Field label="Product" required>
              <select name="productId" defaultValue={initial?.productId ?? ""} required={mode === "manual"} className={inputClass}>
                <option value="" disabled>
                  Select a product…
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {mode === "category" && (
          <div className="mt-4">
            <Field label="Category" required>
              <select name="category" defaultValue={initial?.category ?? categories[0].slug} className={inputClass}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {mode === "tag" && (
          <div className="mt-4">
            <Field label="Tag" required>
              <input
                name="tag"
                defaultValue={initial?.tag ?? ""}
                list="existing-tags"
                placeholder="e.g. eid-sale"
                className={inputClass}
              />
              <datalist id="existing-tags">
                {existingTags.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>
            {existingTags.length === 0 && (
              <p className="mt-1.5 text-xs text-ink-dim">
                No products have tags yet — add a comma-separated tag to a product first (in the product edit form),
                then it&rsquo;ll show up here.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Copy overrides */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">
          Slide text (optional — leave blank to auto-fill from the product)
        </span>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow (small tag line above the title)">
            <input name="eyebrow" defaultValue={initial?.eyebrow ?? ""} className={inputClass} placeholder="e.g. Eid Special" />
          </Field>
          <Field label="Theme color">
            <select name="theme" defaultValue={initial?.theme ?? "brand"} className={inputClass}>
              {BILLBOARD_THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <span className="text-xs font-semibold text-ink-soft">
              Background photo (optional — replaces the solid theme color with this image, tinted for text
              readability)
            </span>
            <div className="mt-1.5">
              <ImageUploadField defaultValue={initial?.backgroundImage ?? undefined} name="backgroundImage" />
            </div>
          </div>
          <Field label="Title">
            <input name="title" defaultValue={initial?.title ?? ""} className={inputClass} placeholder="e.g. Laptops & Components for" />
          </Field>
          <Field label="Highlight (bold word/phrase after the title)">
            <input name="highlight" defaultValue={initial?.highlight ?? ""} className={inputClass} placeholder="e.g. Every Need" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subtitle">
              <input name="subtitle" defaultValue={initial?.subtitle ?? ""} className={inputClass} />
            </Field>
          </div>
          <Field label="Primary button label">
            <input name="primaryLabel" defaultValue={initial?.primaryLabel ?? ""} className={inputClass} placeholder="e.g. Shop Now" />
          </Field>
          <Field label="Primary button link">
            <input name="primaryHref" defaultValue={initial?.primaryHref ?? ""} className={inputClass} placeholder="/product/... or /shop?..." />
          </Field>
          <Field label="Secondary button label">
            <input name="secondaryLabel" defaultValue={initial?.secondaryLabel ?? ""} className={inputClass} placeholder="e.g. View All Deals" />
          </Field>
          <Field label="Secondary button link">
            <input name="secondaryHref" defaultValue={initial?.secondaryHref ?? ""} className={inputClass} placeholder="/shop?category=..." />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="enabled" defaultChecked={initial?.enabled ?? true} className="h-4 w-4 accent-brand-600" />
          Enabled (shown on the homepage)
        </label>
      </div>

      {state.error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
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
