import type { IconKey } from "@/lib/types";
import type { SVGProps } from "react";
import {
  Laptop,
  Desktop,
  Gaming,
  Components,
  Monitor,
  Printer,
  Networking,
  Accessories,
  Grid,
} from "./icons";

const map: Record<IconKey, (p: SVGProps<SVGSVGElement> & { size?: number }) => React.ReactElement> = {
  laptop: Laptop,
  desktop: Desktop,
  gaming: Gaming,
  components: Components,
  monitor: Monitor,
  printer: Printer,
  networking: Networking,
  accessories: Accessories,
  grid: Grid,
};

export function CategoryIcon({
  icon,
  ...props
}: { icon: IconKey } & SVGProps<SVGSVGElement> & { size?: number }) {
  const Cmp = map[icon] ?? Grid;
  return <Cmp {...props} />;
}
