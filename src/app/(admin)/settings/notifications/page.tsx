import { SettingsShell } from "@/components/admin/SettingsNav";

export default function SettingsNotificationsPage() {
  return (
    <SettingsShell>
      <div className="workspace-panel">
        <h2 className="text-sm font-medium text-foreground">Notifications</h2>
        <p className="text-xs text-muted-foreground mt-1">
          No alert channels are configured.
        </p>
        <div className="mt-8 rounded-lg border border-dashed border-border px-4 py-10 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          No data yet
        </div>
      </div>
    </SettingsShell>
  );
}
