import "server-only";
import sharp from "sharp";

export type TextTheme = "light" | "dark";

/**
 * Downloads a billboard background photo and decides whether the copy
 * column (roughly the left half, where the title/subtitle render) should
 * use light text-on-dark-photo styling ("dark") or dark text-on-light-photo
 * styling ("light"). Computed once when the slide is saved, not on every
 * page load, so the homepage never waits on this.
 *
 * Defaults to "dark" (the site's original white-text style) on any
 * failure — a wrong guess there is far less jarring than a broken slide.
 */
export async function detectTextTheme(imageUrl: string): Promise<TextTheme> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return "dark";
    const buffer = Buffer.from(await res.arrayBuffer());

    // Sample only the left ~55% of the image — that's where the eyebrow,
    // title and subtitle actually render — rather than averaging the whole
    // photo, which could be misled by a bright product shot on the right.
    const meta = await sharp(buffer).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const sampleWidth = width > 0 ? Math.max(1, Math.round(width * 0.55)) : undefined;

    const pipeline = sharp(buffer).extract(
      sampleWidth && height ? { left: 0, top: 0, width: sampleWidth, height } : { left: 0, top: 0, width: 1, height: 1 },
    );

    const { data, info } = await pipeline
      .resize(24, 24, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let sum = 0;
    const pixelCount = data.length / info.channels;
    for (let idx = 0; idx < data.length; idx += info.channels) {
      const r = data[idx];
      const g = data[idx + 1] ?? r;
      const b = data[idx + 2] ?? r;
      // Perceived luminance (ITU-R BT.601)
      sum += 0.299 * r + 0.587 * g + 0.114 * b;
    }
    const avgLuminance = sum / pixelCount;

    // Our left-side dark overlay (see Hero.tsx) already darkens whatever's
    // underneath somewhat, so the threshold sits higher than a "bare
    // image" contrast check would use — only genuinely bright photos
    // (light product shots, white backgrounds) flip to dark text.
    return avgLuminance > 175 ? "light" : "dark";
  } catch (err) {
    console.error("detectTextTheme failed, defaulting to dark:", err);
    return "dark";
  }
}
