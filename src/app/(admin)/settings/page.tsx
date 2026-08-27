import { SettingsShell } from "@/components/admin/SettingsNav";
import { HAVOK } from "@/lib/brand/ink";

const facts = [
  { label: "Brand", value: HAVOK.name },
  { label: "Product", value: HAVOK.product },
  { label: "Host", value: HAVOK.host },
  { label: "Public site", value: HAVOK.publicSite },
  { label: "Checkout", value: `${HAVOK.checkout} · Shopify, checkout-only` },
  { label: "Location", value: HAVOK.location },
  { label: "Line", value: HAVOK.line.join(" · ") },
  { label: "Ships", value: "Bikes themselves" },
  { label: "Template", value: "Ink · Paper night" },
];

export default function SettingsPage() {
  return (
    <SettingsShell>
      <div className="workspace-panel space-y-5">
        <div>
          <h2 className="text-sm font-medium text-foreground">House facts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Confirmed HAVØK facts. Nothing here is a live editor.
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="content-rail">
              <dt className="content-rail-label">{fact.label}</dt>
              <dd className="content-rail-value break-all">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SettingsShell>
  );
}
