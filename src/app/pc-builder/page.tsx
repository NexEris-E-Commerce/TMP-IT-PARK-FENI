import { getBuildOptions } from "@/lib/pc-builder";
import { getAllProducts } from "@/lib/products-repo";
import { PcBuilderClient } from "@/components/pc-builder/PcBuilderClient";

export const metadata = { title: "PC Builder" };

export default async function PcBuilderPage() {
  const allProducts = await getAllProducts();
  const options = getBuildOptions(allProducts);

  return <PcBuilderClient options={options} />;
}
