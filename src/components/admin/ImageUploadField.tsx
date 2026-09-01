"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Close } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

export function ImageUploadField({ defaultValue }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      {/* This hidden input is what actually submits with the form as `image`. */}
      <input type="hidden" name="image" value={url} />

      {url ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-line bg-muted">
          <Image src={url} alt="Product preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove image"
            className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white transition hover:bg-danger"
          >
            <Close size={13} />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line-strong text-center text-xs text-ink-dim transition hover:border-brand-300 hover:text-brand-600",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? "Uploading…" : "Click to upload"}
        </label>
      )}

      <div className="mt-2">
        <span className="text-xs text-ink-dim">Or paste an image URL:</span>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={cn(inputClass, "mt-1")}
          placeholder="https://…"
        />
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
