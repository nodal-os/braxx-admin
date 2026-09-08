import { SettingsShell } from "@/components/admin/SettingsNav";
import { ACTIONS, MODULES } from "@/lib/permissions";

export default function SettingsPermissionsPage() {
  return (
    <SettingsShell>
      <div className="workspace-panel space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Permissions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Module × action map. Not assigned to anyone yet.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                  Module
                </th>
                {ACTIONS.map((action) => (
                  <th
                    key={action}
                    className="text-center py-2 px-2 font-medium text-muted-foreground capitalize"
                  >
                    {action.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((mod) => (
                <tr key={mod} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-medium capitalize">
                    {mod.replace(/_/g, " ")}
                  </td>
                  {ACTIONS.map((action) => (
                    <td
                      key={action}
                      className="text-center py-2.5 px-2 text-muted-foreground"
                    >
                      ·
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SettingsShell>
  );
}
