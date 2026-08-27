import { SettingsShell } from "@/components/admin/SettingsNav";

export default function SettingsPreferencesPage() {
  return (
    <SettingsShell>
      <div className="workspace-panel space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Preferences</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Template is fixed to Ink. No theme switcher.
          </p>
        </div>
        <div className="content-rail">
          <span className="content-rail-label">OS template</span>
          <span className="content-rail-value">Ink · Paper night</span>
        </div>
        <div className="content-rail">
          <span className="content-rail-label">Type</span>
          <span className="content-rail-value">Inter + Space Grotesk</span>
        </div>
        <div className="content-rail">
          <span className="content-rail-label">Accent</span>
          <span className="content-rail-value">#E8C4A0</span>
        </div>
      </div>
    </SettingsShell>
  );
}
