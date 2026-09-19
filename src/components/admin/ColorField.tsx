"use client";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function ColorField({
  label,
  name,
  value,
  onChange,
  allowEmpty,
  emptyLabel = "Use theme color",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  /** When true, an empty value is valid (renders a "use theme color" toggle) — used for per-slide overrides. */
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const isEmpty = allowEmpty && !value;
  const swatchValue = HEX_RE.test(value) ? value : "#ffffff";

  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        {allowEmpty && (
          <button
            type="button"
            onClick={() => onChange(isEmpty ? swatchValue : "")}
            className="shrink-0 rounded-lg border border-line-strong px-2 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:bg-muted"
          >
            {isEmpty ? "Custom…" : emptyLabel}
          </button>
        )}
        {!isEmpty && (
          <>
            <input
              type="color"
              value={swatchValue}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1"
              aria-label={`${label} swatch`}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#2a49dd"
              className="h-10 w-full rounded-xl border border-line-strong bg-surface px-3 font-mono text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </>
        )}
        {/* Hidden field so a plain (non-JS-tracked) form submit still carries the value; the visible inputs above call onChange to keep it in sync. */}
        <input type="hidden" name={name} value={isEmpty ? "" : value} />
      </div>
    </label>
  );
}
