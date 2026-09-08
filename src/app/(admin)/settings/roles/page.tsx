import { SettingsShell } from "@/components/admin/SettingsNav";
import { DEFAULT_ROLES } from "@/lib/permissions";

export default function SettingsRolesPage() {
  const roles = Object.values(DEFAULT_ROLES);

  return (
    <SettingsShell>
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Roles</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Defined structure. No people assigned.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {roles.map((role) => (
            <div key={role.name} className="workspace-panel space-y-2">
              <p className="text-sm font-medium">{role.name}</p>
              <p className="text-[11px] text-muted-foreground">{role.description}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                0 users
              </p>
            </div>
          ))}
        </div>
      </div>
    </SettingsShell>
  );
}
