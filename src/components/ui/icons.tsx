import type { SVGProps } from "react";

/**
 * Inline SVG icon set — no external icon dependency.
 * Stroke icons inherit `currentColor`; pass `size` or `className` to size.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, strokeWidth = 1.8, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ── UI / navigation ───────────────────────────── */
export const Search = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-3.5-3.5" /></Svg>
);
export const Cart = (p: IconProps) => (
  <Svg {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2.2l2.1 12.4a1.5 1.5 0 0 0 1.5 1.2h9.1a1.5 1.5 0 0 0 1.5-1.2L21 7H5.5" /></Svg>
);
export const Heart = (p: IconProps) => (
  <Svg {...p}><path d="M12 20.5 4.3 12.9a4.6 4.6 0 0 1 6.5-6.5l1.2 1.2 1.2-1.2a4.6 4.6 0 1 1 6.5 6.5Z" /></Svg>
);
export const Compare = (p: IconProps) => (
  <Svg {...p}><path d="M7 4v16M7 4 3.5 8M7 4l3.5 4M17 20V4m0 16 3.5-4M17 20l-3.5-4" /></Svg>
);
export const User = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>
);
export const ChevronDown = (p: IconProps) => (<Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>);
export const ChevronRight = (p: IconProps) => (<Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>);
export const ChevronLeft = (p: IconProps) => (<Svg {...p}><path d="m15 6-6 6 6 6" /></Svg>);
export const ArrowRight = (p: IconProps) => (<Svg {...p}><path d="M5 12h14m-6-6 6 6-6 6" /></Svg>);
export const Menu = (p: IconProps) => (<Svg {...p}><path d="M3 6h18M3 12h18M3 18h18" /></Svg>);
export const Close = (p: IconProps) => (<Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>);
export const Plus = (p: IconProps) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>);
export const Minus = (p: IconProps) => (<Svg {...p}><path d="M5 12h14" /></Svg>);
export const Check = (p: IconProps) => (<Svg {...p}><path d="m20 6-11 11-5-5" /></Svg>);
export const AlertTriangle = (p: IconProps) => (
  <Svg {...p}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></Svg>
);
export const RefreshCw = (p: IconProps) => (
  <Svg {...p}><path d="M21 12a9 9 0 0 1-15.4 6.4M3 12a9 9 0 0 1 15.4-6.4" /><path d="M21 4v5h-5M3 20v-5h5" /></Svg>
);
export const Download = (p: IconProps) => (
  <Svg {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Svg>
);
export const Edit = (p: IconProps) => (
  <Svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" /></Svg>
);
export const Trash = (p: IconProps) => (
  <Svg {...p}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></Svg>
);
export const Grid = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>
);
export const Sliders = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h9M18 7h2M4 12h2M11 12h9M4 17h9M18 17h2" /><circle cx="15" cy="7" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="15" cy="17" r="2" /></Svg>
);
export const Phone = (p: IconProps) => (
  <Svg {...p}><path d="M6.6 3.5 4 4.2A2 2 0 0 0 2.6 6.5C3.4 13.9 10.1 20.6 17.5 21.4a2 2 0 0 0 2.3-1.4l.7-2.6-4.3-2-1.6 1.9a13 13 0 0 1-5.6-5.6l1.9-1.6Z" /></Svg>
);
export const MapPin = (p: IconProps) => (
  <Svg {...p}><path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.6" /></Svg>
);
export const Eye = (p: IconProps) => (
  <Svg {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Svg>
);
export const Star = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9Z" />
  </Svg>
);

/* ── Category icons ───────────────────────────── */
export const Laptop = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 20h20" /></Svg>
);
export const Desktop = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="3" width="9" height="18" rx="1.5" /><path d="M7 7h3M7 11h3" /><circle cx="8.5" cy="17" r="0.6" fill="currentColor" /></Svg>
);
export const Gaming = (p: IconProps) => (
  <Svg {...p}><path d="M7 8h10a4 4 0 0 1 4 4l-.7 4.3a2.3 2.3 0 0 1-4.1.9L14.5 15h-5l-1.7 2.2a2.3 2.3 0 0 1-4.1-.9L3 12a4 4 0 0 1 4-4Z" /><path d="M7.5 11v2M6.5 12h2M15.5 11.5h.01M17.5 13.5h.01" /></Svg>
);
export const Components = (p: IconProps) => (
  <Svg {...p}><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 3v2m4-2v2m-4 14v2m4-2v2M3 10h2m-2 4h2m14-4h2m-2 4h2" /></Svg>
);
export const Monitor = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="12" rx="1.6" /><path d="M9 20h6m-3-4v4" /></Svg>
);
export const Printer = (p: IconProps) => (
  <Svg {...p}><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="1.5" /><path d="M7 17h10v4H7z" /><circle cx="17.5" cy="12.5" r="0.6" fill="currentColor" /></Svg>
);
export const Networking = (p: IconProps) => (
  <Svg {...p}><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0" /><circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" /><path d="M2 9a15 15 0 0 1 20 0" /></Svg>
);
export const Accessories = (p: IconProps) => (
  <Svg {...p}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="7" rx="1.5" /><rect x="17" y="13" width="4" height="7" rx="1.5" /></Svg>
);

/* ── USP / service icons ──────────────────────── */
export const Truck = (p: IconProps) => (
  <Svg {...p}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></Svg>
);
export const CreditCard = (p: IconProps) => (
  <Svg {...p}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 9.5h19M6 15h4" /></Svg>
);
export const ReturnBox = (p: IconProps) => (
  <Svg {...p}><path d="M3 8a9 9 0 1 1-1 4" /><path d="M2 4v5h5" /></Svg>
);
export const Headset = (p: IconProps) => (
  <Svg {...p}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M20 19a3 3 0 0 1-3 3h-3" /></Svg>
);
export const Wrench = (p: IconProps) => (
  <Svg {...p}><path d="M15 4a5 5 0 0 0-5.9 6.3L3 16.4 5.6 19l6.1-6.1A5 5 0 0 0 18 7.9L15.2 10.7 13.3 8.8 16 6Z" /></Svg>
);
export const ShieldCheck = (p: IconProps) => (
  <Svg {...p}><path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6Z" /><path d="m9 12 2 2 4-4" /></Svg>
);
export const Calendar = (p: IconProps) => (
  <Svg {...p}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4m8-4v4M3.5 10h17" /></Svg>
);

/* ── Social (filled) ──────────────────────────── */
export const Facebook = ({ size = 20, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
  </svg>
);
export const Instagram = ({ size = 20, ...p }: IconProps) => (
  <Svg size={size} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></Svg>
);
export const YouTube = ({ size = 20, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M22.5 8.2a2.9 2.9 0 0 0-2-2C18.7 5.7 12 5.7 12 5.7s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 1 12a30 30 0 0 0 .5 3.8 2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 23 12a30 30 0 0 0-.5-3.8ZM9.8 15.3V8.7l5.7 3.3Z" />
  </svg>
);
export const GitHub = ({ size = 20, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
  </svg>
);
