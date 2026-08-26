/**
 * Commerce rules shared by the cart, mini-cart and checkout.
 * Money is handled in whole BDT (৳ has no minor unit in common retail use).
 */

export const FREE_DELIVERY_THRESHOLD = 5000;
export const COMPARE_LIMIT = 4;

export interface DeliveryZone {
  id: string;
  label: string;
  labelBn: string;
  fee: number;
  eta: string;
}

/** Delivery zones, cheapest first. Free delivery over the threshold applies to all. */
export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "feni-sadar",
    label: "Inside Feni Sadar",
    labelBn: "ফেনী সদর",
    fee: 60,
    eta: "Same day – 1 day",
  },
  {
    id: "feni-district",
    label: "Feni District (upazila)",
    labelBn: "ফেনী জেলা",
    fee: 100,
    eta: "1–2 days",
  },
  {
    id: "nationwide",
    label: "Outside Feni (nationwide)",
    labelBn: "সারা বাংলাদেশ",
    fee: 130,
    eta: "2–4 days",
  },
];

export function getZone(id: string | undefined): DeliveryZone | undefined {
  return DELIVERY_ZONES.find((z) => z.id === id);
}

/** Delivery fee for a zone, honouring the free-delivery threshold. */
export function deliveryFee(zone: DeliveryZone | undefined, subtotal: number): number {
  if (!zone) return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return zone.fee;
}

/** Amount still needed to unlock free delivery (0 once reached). */
export function amountToFreeDelivery(subtotal: number): number {
  return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
}
