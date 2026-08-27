import { SettingsShell } from "@/components/admin/SettingsNav";
import { HAVOK } from "@/lib/brand/ink";

export default function SettingsSiteControlsPage() {
  return (
    <SettingsShell>
      <div className="workspace-panel space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Site controls</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Public site is ridehavok.com. This admin does not publish it.
          </p>
        </div>
        <div className="content-rail">
          <span className="content-rail-label">Public site</span>
          <span className="content-rail-value">{HAVOK.publicSite}</span>
        </div>
        <div className="content-rail">
          <span className="content-rail-label">Checkout</span>
          <span className="content-rail-value">{HAVOK.checkout}</span>
        </div>
      </div>
    </SettingsShell>
  );
}
