import { SkaelCatalogView } from "@/components/admin/SkaelCatalog";
import { loadSkaelCatalog } from "@/lib/skael";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const catalog = await loadSkaelCatalog();

  return <SkaelCatalogView catalog={catalog} />;
}
