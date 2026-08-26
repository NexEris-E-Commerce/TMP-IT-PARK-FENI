"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => n.toString().padStart(2, "0");

/** Counts down to the end of the current day. Client-only to avoid SSR drift. */
export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const tick = () => setLeft(Math.max(0, end.getTime() - Date.now()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  const h = left == null ? null : Math.floor(left / 3_600_000);
  const m = left == null ? null : Math.floor((left % 3_600_000) / 60_000);
  const s = left == null ? null : Math.floor((left % 60_000) / 1000);

  const Box = ({ v, l }: { v: number | null; l: string }) => (
    <div className="flex flex-col items-center">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink font-display text-base font-extrabold tabular-nums text-white">
        {v == null ? "--" : pad(v)}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-ink-dim">
        {l}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-1.5" aria-label="Time left for today's deals">
      <Box v={h} l="Hrs" />
      <span className="pb-4 font-bold text-ink-dim">:</span>
      <Box v={m} l="Min" />
      <span className="pb-4 font-bold text-ink-dim">:</span>
      <Box v={s} l="Sec" />
    </div>
  );
}
