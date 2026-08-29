import type { Product } from "./types";
import { products as allProducts } from "./data/products";

export type BuildSlotKey = "cpu" | "motherboard" | "ram" | "storage" | "gpu";

export const BUILD_SLOTS: { key: BuildSlotKey; label: string; required: boolean }[] = [
  { key: "cpu", label: "Processor (CPU)", required: true },
  { key: "motherboard", label: "Motherboard", required: true },
  { key: "ram", label: "Memory (RAM)", required: true },
  { key: "storage", label: "Storage", required: true },
  { key: "gpu", label: "Graphics Card", required: false },
];

/**
 * Classifies a "components" category product into a build slot using its
 * name/keySpec text. Heuristic on purpose — once products carry a real
 * `subCategory` column in the database this can be a simple equality check.
 */
function classify(p: Product): BuildSlotKey | null {
  const text = `${p.name} ${p.keySpec ?? ""}`.toLowerCase();
  if (/processor|core i\d|ryzen/.test(text)) return "cpu";
  if (/motherboard/.test(text)) return "motherboard";
  if (/ddr\d|ram|memory/.test(text) && !/motherboard/.test(text)) return "ram";
  if (/ssd|nvme|hdd|storage/.test(text)) return "storage";
  if (/rtx|gtx|radeon|geforce|graphics/.test(text)) return "gpu";
  return null;
}

export function getBuildOptions(source: Product[] = allProducts): Record<BuildSlotKey, Product[]> {
  const grouped: Record<BuildSlotKey, Product[]> = {
    cpu: [],
    motherboard: [],
    ram: [],
    storage: [],
    gpu: [],
  };
  for (const p of source) {
    if (p.category !== "components") continue;
    const slot = classify(p);
    if (slot) grouped[slot].push(p);
  }
  return grouped;
}

const SOCKET_PATTERN = /lga\d{3,4}|am4|am5/i;

function extractSocket(p?: Product): string | null {
  if (!p) return null;
  const match = `${p.keySpec ?? ""} ${(p.specs ?? []).map((s) => s.value).join(" ")}`.match(
    SOCKET_PATTERN,
  );
  return match ? match[0].toUpperCase() : null;
}

/**
 * Basic compatibility check: warns if the selected CPU and motherboard
 * report different sockets. Returns null when compatible or when either
 * part's socket can't be determined from its listed specs.
 */
export function checkCpuMotherboardCompat(
  cpu?: Product,
  motherboard?: Product,
): string | null {
  const cpuSocket = extractSocket(cpu);
  const moboSocket = extractSocket(motherboard);
  if (!cpuSocket || !moboSocket) return null;
  if (cpuSocket !== moboSocket) {
    return `Socket mismatch: ${cpu?.name} uses ${cpuSocket}, but ${motherboard?.name} is ${moboSocket}. Choose a matching motherboard.`;
  }
  return null;
}
