"use client";

import { useActionState } from "react";
import { categories } from "@/lib/data/categories";
import { specsToText } from "@/lib/product-form-helpers";
import { ImageUploadField } from "./ImageUploadField";
import type { Product } from "@/lib/types";
import type { ProductFormState } from "@/lib/actions/products";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

export function ProductForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initial?: Partial<Product> & { id?: string };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Product Name" required>
          <input name="name" defaultValue={initial?.name} required className={inputClass} />
        </Field>
        <Field label="Slug (URL-friendly)" required>
          <input name="slug" defaultValue={initial?.slug} required className={inputClass} placeholder="e.g. asus-tuf-a15" />
        </Field>
        <Field label="Brand">
          <input name="brand" defaultValue={initial?.brand} className={inputClass} placeholder="e.g. asus" />
        </Field>
        <Field label="Category">
          <select name="category" defaultValue={initial?.category ?? categories[0].slug} className={inputClass}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <span className="text-xs font-semibold text-ink-soft">Product Image</span>
          <div className="mt-1.5">
            <ImageUploadField defaultValue={initial?.image} />
          </div>
        </div>
        <Field label="Key Spec (short highlight)">
          <input name="keySpec" defaultValue={initial?.keySpec} className={inputClass} placeholder="e.g. Ryzen 7 · 16GB · RTX 4060" />
        </Field>
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Price (৳)" required>
          <input type="number" name="price" defaultValue={initial?.price} required min={0} className={inputClass} />
        </Field>
        <Field label="Regular Price (৳, optional — for showing a discount)">
          <input type="number" name="regularPrice" defaultValue={initial?.regularPrice} min={0} className={inputClass} />
        </Field>
        <Field label="Stock Quantity">
          <input type="number" name="stock" defaultValue={initial?.stock ?? 0} min={0} className={inputClass} />
        </Field>
        <Field label="Low Stock Threshold">
          <input type="number" name="lowStockThreshold" defaultValue={initial?.lowStockThreshold ?? 3} min={0} className={inputClass} />
        </Field>
        <Field label="Warranty">
          <input name="warranty" defaultValue={initial?.warranty} className={inputClass} placeholder="e.g. 2 Years Official" />
        </Field>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <Field label="Specifications (one per line: Label: Value)">
          <textarea
            name="specs"
            defaultValue={specsToText(initial?.specs)}
            className={`${inputClass} min-h-[140px] resize-y py-2.5 font-mono text-xs`}
            placeholder={"Processor: AMD Ryzen 7 7735HS\nRAM: 16GB DDR5\nStorage: 512GB NVMe SSD"}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <Checkbox name="isFeatured" label="Featured" defaultChecked={initial?.isFeatured} />
        <Checkbox name="isBestSeller" label="Best Seller" defaultChecked={initial?.isBestSeller} />
        <Checkbox name="isDeal" label="Deal of the Day" defaultChecked={initial?.isDeal} />
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

function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-brand-600" />
      {label}
    </label>
  );
}
