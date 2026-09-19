"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { categories } from "@/lib/data/categories";
import { ImageUploadField } from "./ImageUploadField";
import { ColorField } from "./ColorField";
import { BillboardSlideVisual } from "@/components/home/BillboardSlideVisual";
import { gradientCss } from "@/lib/billboard-color-utils";
import { createBillboardThemeFromColors } from "@/lib/actions/billboard-themes";
import type { AdminBillboardTheme } from "@/lib/actions/billboard-themes";
import type { AdminBillboardSlideRow, BillboardSlideFormState, ProductPickerOption } from "@/lib/actions/billboard";
import type { BillboardSlide } from "@/lib/billboard";
import type { IconKey } from "@/lib/types";
import { formatBDT } from "@/lib/format";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

const MODES = [
  { id: "manual", label: "Specific Product", hint: "Always shows the exact product you pick." },
  { id: "category", label: "Category", hint: "Shows a product from a category you pick (re-picked on each visit)." },
  { id: "tag", label: "Tag", hint: "Shows a product carrying a tag you pick (re-picked on each visit)." },
  { id: "random", label: "Random", hint: "Shows any in-stock product — different on every visit." },
] as const;

const KNOWN_ICON_KEYS: IconKey[] = [
  "laptop", "desktop", "gaming", "components", "monitor", "printer", "networking", "accessories", "grid",
];
function toIconKey(category: string): IconKey {
  return (KNOWN_ICON_KEYS as string[]).includes(category) ? (category as IconKey) : "grid";
}

export function BillboardSlideForm({
  action,
  initial,
  submitLabel,
  products,
  existingTags,
  themes,
}: {
  action: (prev: BillboardSlideFormState, formData: FormData) => Promise<BillboardSlideFormState>;
  initial?: AdminBillboardSlideRow;
  submitLabel: string;
  products: ProductPickerOption[];
  existingTags: string[];
  themes: AdminBillboardTheme[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [mode, setMode] = useState<string>(initial?.mode ?? "manual");
  const [productId, setProductId] = useState(initial?.productId ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0].slug);
  const [tag, setTag] = useState(initial?.tag ?? "");

  const [eyebrow, setEyebrow] = useState(initial?.eyebrow ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [highlight, setHighlight] = useState(initial?.highlight ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [primaryLabel, setPrimaryLabel] = useState(initial?.primaryLabel ?? "");
  const [secondaryLabel, setSecondaryLabel] = useState(initial?.secondaryLabel ?? "");
  const [backgroundImage, setBackgroundImage] = useState(initial?.backgroundImage ?? "");

  const defaultThemeId = initial?.themeId ?? themes.find((t) => t.slug === "brand")?.id ?? themes[0]?.id ?? "";
  const [themeId, setThemeId] = useState(defaultThemeId);

  const [eyebrowColor, setEyebrowColor] = useState(initial?.eyebrowColor ?? "");
  const [titleColor, setTitleColor] = useState(initial?.titleColor ?? "");
  const [highlightColor, setHighlightColor] = useState(initial?.highlightColor ?? "");
  const [subtitleColor, setSubtitleColor] = useState(initial?.subtitleColor ?? "");

  const [saveAsThemeName, setSaveAsThemeName] = useState("");
  const [savingTheme, startSavingTheme] = useTransition();
  const [saveThemeMessage, setSaveThemeMessage] = useState<string | null>(null);

  const selectedTheme = themes.find((t) => t.id === themeId) ?? themes[0];
  const selectedProduct = products.find((p) => p.id === productId);

  const hasAnyOverride = !!(eyebrowColor || titleColor || highlightColor || subtitleColor);

  async function handleSaveAsTheme() {
    if (!selectedTheme) return;
    setSaveThemeMessage(null);
    startSavingTheme(async () => {
      const result = await createBillboardThemeFromColors({
        name: saveAsThemeName,
        gradientFrom: selectedTheme.gradientFrom,
        gradientVia: selectedTheme.gradientVia,
        gradientTo: selectedTheme.gradientTo,
        glowColor: selectedTheme.glowColor,
        eyebrowColor: eyebrowColor || selectedTheme.eyebrowColor,
        titleColor: titleColor || selectedTheme.titleColor,
        highlightColor: highlightColor || selectedTheme.highlightColor,
        subtitleColor: subtitleColor || selectedTheme.subtitleColor,
        plaqueColor: selectedTheme.plaqueColor,
      });
      if (result.error) {
        setSaveThemeMessage(result.error);
      } else if (result.id) {
        setSaveThemeMessage(`Saved as "${saveAsThemeName}" — selected below.`);
        setThemeId(result.id);
        setEyebrowColor("");
        setTitleColor("");
        setHighlightColor("");
        setSubtitleColor("");
        setSaveAsThemeName("");
      }
    });
  }

  // Builds the exact same BillboardSlide shape the homepage uses, straight
  // from current form state, so the preview below is pixel-for-pixel what
  // will actually render — not a mocked-up approximation.
  const previewSlide: BillboardSlide = useMemo(() => {
    const theme = selectedTheme;
    const previewProduct =
      mode === "manual" && selectedProduct
        ? {
            name: selectedProduct.name,
            price: formatBDT(selectedProduct.price),
            rating: selectedProduct.rating ?? 4.8,
            image: selectedProduct.image ?? undefined,
            category: toIconKey(selectedProduct.category),
            keySpec: selectedProduct.keySpec ?? "",
            slug: selectedProduct.slug,
          }
        : {
            name: mode === "manual" ? "(pick a product)" : "(auto-picked product)",
            price: "৳ —",
            rating: 4.8,
            image: undefined,
            category: mode === "category" ? toIconKey(category) : "grid",
            keySpec: "",
            slug: "",
          };

    return {
      eyebrow: eyebrow || "Featured",
      title: title || previewProduct.name,
      highlight: highlight,
      subtitle: subtitle || previewProduct.keySpec || "",
      primary: { label: primaryLabel || "Shop Now", href: "#" },
      secondary: { label: secondaryLabel || "View All", href: "#" },
      gradientCss: theme
        ? gradientCss({ gradientFrom: theme.gradientFrom, gradientVia: theme.gradientVia, gradientTo: theme.gradientTo })
        : gradientCss({ gradientFrom: "#2239bb", gradientVia: "#2a49dd", gradientTo: "#6a3cef" }),
      glowColor: theme?.glowColor ?? "#9174ff",
      eyebrowColor: eyebrowColor || theme?.eyebrowColor || "#ffffff",
      titleColor: titleColor || theme?.titleColor || "#ffffff",
      highlightColor: highlightColor || theme?.highlightColor || "#ffffff",
      subtitleColor: subtitleColor || theme?.subtitleColor || "#e5e7eb",
      plaqueColor: theme?.plaqueColor ?? "#000000",
      category: previewProduct.category,
      product: previewProduct.name,
      price: previewProduct.price,
      rating: previewProduct.rating,
      productImage: previewProduct.image,
      backgroundImage: backgroundImage || undefined,
    };
  }, [
    selectedTheme, mode, selectedProduct, category, eyebrow, title, highlight, subtitle,
    primaryLabel, secondaryLabel, eyebrowColor, titleColor, highlightColor, subtitleColor, backgroundImage,
  ]);

  return (
    <div className="space-y-6">
      {/* Live preview — always in sync with the fields below */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Live Preview</span>
        <div className="mt-2 h-[280px] overflow-hidden rounded-2xl sm:h-[320px] lg:h-[360px]">
          <BillboardSlideVisual slide={previewSlide} priority />
        </div>
      </div>

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
                <select name="productId" value={productId} onChange={(e) => setProductId(e.target.value)} required className={inputClass}>
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
                <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
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
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
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
                  No products have tags yet — add a comma-separated tag to a product first (in the product edit
                  form), then it&rsquo;ll show up here.
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
              <input name="eyebrow" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className={inputClass} placeholder="e.g. Eid Special" />
            </Field>
            <Field label="Title">
              <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Laptops & Components for" />
            </Field>
            <Field label="Highlight (bold word/phrase after the title)">
              <input name="highlight" value={highlight} onChange={(e) => setHighlight(e.target.value)} className={inputClass} placeholder="e.g. Every Need" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Subtitle">
                <input name="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Primary button label">
              <input name="primaryLabel" value={primaryLabel} onChange={(e) => setPrimaryLabel(e.target.value)} className={inputClass} placeholder="e.g. Shop Now" />
            </Field>
            <Field label="Primary button link">
              <input name="primaryHref" defaultValue={initial?.primaryHref ?? ""} className={inputClass} placeholder="/product/... or /shop?..." />
            </Field>
            <Field label="Secondary button label">
              <input name="secondaryLabel" value={secondaryLabel} onChange={(e) => setSecondaryLabel(e.target.value)} className={inputClass} placeholder="e.g. View All Deals" />
            </Field>
            <Field label="Secondary button link">
              <input name="secondaryHref" defaultValue={initial?.secondaryHref ?? ""} className={inputClass} placeholder="/shop?category=..." />
            </Field>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-ink-soft">
              Background photo (optional — replaces the solid theme gradient with this image)
            </span>
            <div className="mt-1.5">
              <ImageUploadField defaultValue={backgroundImage} name="backgroundImage" onValueChange={setBackgroundImage} />
            </div>
          </div>
        </div>

        {/* Theme + colors */}
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Theme</span>
          <div className="mt-3">
            <select name="themeId" value={themeId} onChange={(e) => setThemeId(e.target.value)} className={inputClass}>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.isBuiltin ? "" : "(custom)"}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-ink-dim">
              Manage reusable themes (add your own color combos) from{" "}
              <a href="/admin/billboard/themes" target="_blank" className="font-semibold text-brand-700 hover:underline">
                Billboard Themes
              </a>
              .
            </p>
          </div>

          <div className="mt-5 border-t border-line pt-5">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">
              Override text colors for this slide only
            </span>
            <p className="mt-1 text-xs text-ink-dim">
              Leave any of these on &ldquo;Use theme color&rdquo; to inherit from the theme above — only set the
              ones you want different just for this slide.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <ColorField label="Eyebrow" name="eyebrowColor" value={eyebrowColor} onChange={setEyebrowColor} allowEmpty />
              <ColorField label="Title" name="titleColor" value={titleColor} onChange={setTitleColor} allowEmpty />
              <ColorField label="Highlight" name="highlightColor" value={highlightColor} onChange={setHighlightColor} allowEmpty />
              <ColorField label="Subtitle" name="subtitleColor" value={subtitleColor} onChange={setSubtitleColor} allowEmpty />
            </div>

            {hasAnyOverride && (
              <div className="mt-4 rounded-xl border border-line-strong bg-muted/50 p-3.5">
                <p className="text-xs font-semibold text-ink">Want to reuse this exact color combo on other slides?</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={saveAsThemeName}
                    onChange={(e) => setSaveAsThemeName(e.target.value)}
                    placeholder="Name this theme, e.g. Eid Sale Gold"
                    className="h-9 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    disabled={!saveAsThemeName.trim() || savingTheme}
                    onClick={handleSaveAsTheme}
                    className="h-9 shrink-0 rounded-lg bg-ink px-3 text-xs font-bold text-white transition hover:bg-ink/90 disabled:opacity-50"
                  >
                    {savingTheme ? "Saving…" : "Save as new theme"}
                  </button>
                </div>
                {saveThemeMessage && <p className="mt-1.5 text-xs text-ink-soft">{saveThemeMessage}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input type="checkbox" name="enabled" defaultChecked={initial?.enabled ?? true} className="h-4 w-4 accent-brand-600" />
            Enabled (shown on the homepage)
          </label>
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
    </div>
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
