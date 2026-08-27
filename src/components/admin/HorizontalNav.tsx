"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ChevronDown,
  GitCompare,
  Handshake,
  Inbox,
  Layers,
  Megaphone,
  Receipt,
  Scale,
  Settings,
  Share2,
  UserCog,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  subItems?: Array<{
    label: string;
    href: string;
    description: string;
  }>;
};

const navItems: NavItem[] = [
  { label: "Performance", href: "/performance", icon: BarChart3 },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Social", href: "/social", icon: Share2 },
  {
    label: "Campaign",
    href: "/campaign",
    icon: Megaphone,
    subItems: [
      { label: "Overview", href: "/campaign", description: "Campaign room" },
      { label: "Briefs", href: "/campaign/briefs", description: "Creative briefs" },
      { label: "Add Campaign", href: "/campaign/new", description: "Open the builder" },
    ],
  },
  {
    label: "Partners",
    href: "/partners",
    icon: Handshake,
    subItems: [
      { label: "Overview", href: "/partners", description: "Partner network" },
      { label: "Dealers", href: "/partners/dealers", description: "Dealer directory" },
      { label: "Creators", href: "/partners/creators", description: "Creator roster" },
      { label: "Requests", href: "/partners/requests", description: "Incoming applications" },
    ],
  },
  { label: "Operations", href: "/operations", icon: Wrench },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Warehouse,
    subItems: [
      { label: "Overview", href: "/inventory", description: "Stock room" },
      { label: "Update Stock", href: "/inventory/update", description: "Adjustments" },
    ],
  },
  { label: "Catalog", href: "/catalog", icon: GitCompare },
  { label: "Laws", href: "/laws", icon: Scale },
  { label: "Content", href: "/content", icon: Layers },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Users", href: "/users", icon: UserCog },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function HorizontalNav() {
  const pathname = usePathname();

  return (
    <nav className="h-[var(--nav-height)] flex items-end px-5 border-b border-border bg-background overflow-x-auto scrollbar-thin">
      <div className="flex items-end gap-0 min-w-max">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <div key={item.href} className="relative group/nav">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 pb-2 pt-2 text-[11px] uppercase tracking-[0.14em] transition-colors border-b -mb-[1px]",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
                {item.subItems?.length ? (
                  <ChevronDown className="h-3 w-3 opacity-60" />
                ) : null}
              </Link>

              {item.subItems?.length ? (
                <div className="pointer-events-none absolute left-0 top-full z-50 pt-2 opacity-0 translate-y-1 transition-all duration-150 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-focus-within/nav:pointer-events-auto group-focus-within/nav:opacity-100 group-focus-within/nav:translate-y-0">
                  <div className="min-w-[260px] rounded-lg border border-border bg-card p-2 shadow-lg">
                    <div className="flex flex-col gap-1">
                      {item.subItems.map((sub) => {
                        const subActive =
                          pathname === sub.href ||
                          (sub.href !== item.href && pathname.startsWith(sub.href + "/"));
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "rounded-md px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors",
                              subActive
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-secondary"
                            )}
                          >
                            <span className="block">{sub.label}</span>
                            <span
                              className={cn(
                                "block text-[9px] normal-case tracking-normal mt-0.5",
                                subActive ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}
                            >
                              {sub.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
