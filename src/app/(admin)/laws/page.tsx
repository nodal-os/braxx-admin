import { LawsDesk } from "@/components/admin/LawsDesk";
import { loadLawsCatalog } from "@/lib/laws";

export const dynamic = "force-dynamic";

export default async function LawsPage() {
  const catalog = await loadLawsCatalog();

  return <LawsDesk catalog={catalog} />;
}
