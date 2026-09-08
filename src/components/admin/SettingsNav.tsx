"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Globe,
  HardDrive,
  Key,
  Settings,
  Shield,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "General", href: "/settings", icon: Settings },
  { label: "Users", href: "/settings/users", icon: Users },
  { label: "Roles", href: "/settings/roles", icon: Shield },
  { label: "Permissions", href: "/settings/permissions", icon: Key },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Storage", href: "/settings/storage", icon: HardDrive },
  { label: "Site Controls", href: "/settings/site-controls", icon: Globe },
  { label: "Preferences", href: "/settings/preferences", icon: SlidersHorizontal },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary/12 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SettingsShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Command
        </p>
        <h1 className="display text-2xl text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Command Center configuration. Empty rooms stay empty until they are wired.
        </p>
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SettingsNav />
        </div>
        <div className="lg:col-span-3 space-y-6">{children}</div>
      </div>
    </div>
  );
}
