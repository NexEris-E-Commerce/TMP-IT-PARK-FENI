export interface SpecPair {
  label: string;
  value: string;
}

/** Parses "Label: Value" lines (one per line) into spec pairs. */
export function parseSpecs(raw: string): SpecPair[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: (label ?? "").trim(), value: rest.join(":").trim() };
    })
    .filter((s) => s.label && s.value);
}

/** Reverse of parseSpecs — used to pre-fill the textarea when editing. */
export function specsToText(specs: SpecPair[] | null | undefined): string {
  return (specs ?? []).map((s) => `${s.label}: ${s.value}`).join("\n");
}
