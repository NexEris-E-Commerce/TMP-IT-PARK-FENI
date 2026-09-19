"use client";

import { useActionState, useState } from "react";
import { ColorField } from "./ColorField";
import { gradientCss } from "@/lib/billboard-color-utils";
import type { AdminBillboardTheme, BillboardThemeFormState } from "@/lib/actions/billboard-themes";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

export function ThemeForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: BillboardThemeFormState, formData: FormData) => Promise<BillboardThemeFormState>;
  initial?: AdminBillboardTheme;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  const [gradientFrom, setGradientFrom] = useState(initial?.gradientFrom ?? "#2239bb");
  const [gradientVia, setGradientVia] = useState(initial?.gradientVia ?? "#2a49dd");
  const [gradientTo, setGradientTo] = useState(initial?.gradientTo ?? "#6a3cef");
  const [glowColor, setGlowColor] = useState(initial?.glowColor ?? "#9174ff");
  const [eyebrowColor, setEyebrowColor] = useState(initial?.eyebrowColor ?? "#ffffff");
  const [titleColor, setTitleColor] = useState(initial?.titleColor ?? "#ffffff");
  const [highlightColor, setHighlightColor] = useState(initial?.highlightColor ?? "#ffffff");
  const [subtitleColor, setSubtitleColor] = useState(initial?.subtitleColor ?? "#e5e7eb");
  const [plaqueColor, setPlaqueColor] = useState(initial?.plaqueColor ?? "#000000");

  return (
    <form action={formAction} className="space-y-6">
      {/* Live preview */}
      <div
        style={{ backgroundImage: gradientCss({ gradientFrom, gradientVia, gradientTo }) }}
        className="relative flex h-40 flex-col justify-center overflow-hidden rounded-2xl p-6"
      >
        <div style={{ backgroundColor: glowColor }} className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-50 blur-3xl" />
        <span style={{ color: eyebrowColor }} className="relative text-xs font-semibold">
          Eyebrow text
        </span>
        <h2 style={{ color: titleColor }} className="relative mt-1 font-display text-2xl font-extrabold">
          Title <span style={{ color: highlightColor }} className="underline">Highlight</span>
        </h2>
        <p style={{ color: subtitleColor }} className="relative mt-1 text-sm">
          Subtitle text sample
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <Field label="Theme name" required>
          <input name="name" defaultValue={initial?.name} required className={inputClass} placeholder="e.g. Eid Sale Gold" />
        </Field>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Background gradient</span>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <ColorField label="Start" name="gradientFrom" value={gradientFrom} onChange={setGradientFrom} />
          <ColorField label="Middle (optional)" name="gradientVia" value={gradientVia} onChange={setGradientVia} allowEmpty emptyLabel="No middle stop" />
          <ColorField label="End" name="gradientTo" value={gradientTo} onChange={setGradientTo} />
        </div>
        <div className="mt-4">
          <ColorField label="Glow accent" name="glowColor" value={glowColor} onChange={setGlowColor} />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Text colors</span>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <ColorField label="Eyebrow" name="eyebrowColor" value={eyebrowColor} onChange={setEyebrowColor} />
          <ColorField label="Title" name="titleColor" value={titleColor} onChange={setTitleColor} />
          <ColorField label="Highlight" name="highlightColor" value={highlightColor} onChange={setHighlightColor} />
          <ColorField label="Subtitle" name="subtitleColor" value={subtitleColor} onChange={setSubtitleColor} />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Photo backdrop</span>
        <p className="mt-1 text-xs text-ink-dim">
          When a slide has a background photo, this color sits (translucent, blurred) directly behind the text so it
          always stays readable — pick a dark color for light/busy photos, or a light color if your slides tend to
          use dark photos.
        </p>
        <div className="mt-3">
          <ColorField label="Backdrop color" name="plaqueColor" value={plaqueColor} onChange={setPlaqueColor} />
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{state.error}</p>}

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
