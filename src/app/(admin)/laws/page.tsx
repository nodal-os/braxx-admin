import { EmptyRoom } from "@/components/workspace/EmptyRoom";

export default function LawsPage() {
  return (
    <EmptyRoom
      kicker="HAVØK Legal"
      title="State laws"
      body="This room is the Command Center desk for statutes published at ridehavok.com/laws. No statute file is loaded in this admin. The public /laws route currently 404s. Empty is correct — no invented copy."
    />
  );
}
