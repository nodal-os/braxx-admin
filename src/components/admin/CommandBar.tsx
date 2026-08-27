"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  FileText,
  GitCompare,
  Handshake,
  Inbox,
  Layers,
  Megaphone,
  Receipt,
  Scale,
  Search,
  Settings,
  Share2,
  User,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HAVOK } from "@/lib/brand/ink";

interface SearchResult {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

const searchIndex: SearchResult[] = [
  { label: "Performance", description: "KPIs once live commerce is wired", href: "/performance", icon: BarChart3, category: "Rooms" },
  { label: "Social", description: "Social operations", href: "/social", icon: Share2, category: "Rooms" },
  { label: "Campaign", description: "Campaign planning", href: "/campaign", icon: Megaphone, category: "Rooms" },
  { label: "Partners", description: "Partner network", href: "/partners", icon: Handshake, category: "Rooms" },
  { label: "Dealers", description: "Dealer directory", href: "/partners/dealers", icon: Handshake, category: "Rooms" },
  { label: "Creators", description: "Creator roster", href: "/partners/creators", icon: Handshake, category: "Rooms" },
  { label: "Partner Requests", description: "Incoming partner applications", href: "/partners/requests", icon: FileText, category: "Rooms" },
  { label: "Operations", description: "Tasks and workflows", href: "/operations", icon: Wrench, category: "Rooms" },
  { label: "Expenses", description: "Expense tracking", href: "/expenses", icon: Receipt, category: "Rooms" },
  { label: "Inventory", description: "Stock and fulfillment", href: "/inventory", icon: Warehouse, category: "Rooms" },
  { label: "Catalog", description: "SKAEL vehicles, parts, and HAVØK fitment", href: "/catalog", icon: GitCompare, category: "Rooms" },
  { label: "Laws", description: "HAVØK Legal · state statutes", href: "/laws", icon: Scale, category: "Rooms" },
  { label: "Content", description: "Creative and media", href: "/content", icon: Layers, category: "Rooms" },
  { label: "Inbox", description: "Messages", href: "/inbox", icon: Inbox, category: "Rooms" },
  { label: "Activity", description: "Activity stream", href: "/activity", icon: Activity, category: "Rooms" },
  { label: "Users", description: "Access control", href: "/users", icon: User, category: "Rooms" },
  { label: "Settings", description: "System configuration", href: "/settings", icon: Settings, category: "Rooms" },
  { label: "O3", description: "HAVØK line · catalog", href: "/catalog", icon: GitCompare, category: "Line" },
  { label: "O3 Pro", description: "HAVØK line · catalog", href: "/catalog", icon: GitCompare, category: "Line" },
  { label: "X1", description: "HAVØK line · catalog", href: "/catalog", icon: GitCompare, category: "Line" },
];

export function CommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = query.trim()
    ? searchIndex.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <div className="h-[var(--command-bar-height)] flex items-center gap-3 px-5 border-b border-border bg-background">
        <Link href="/performance" className="flex items-center gap-2.5 shrink-0 mr-2">
          <span className="display text-sm text-foreground tracking-tight">{HAVOK.name}</span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {HAVOK.product}
          </span>
        </Link>

        <button
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-2 flex-1 max-w-xl mx-auto rounded border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 transition-colors"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-[12px]">Search rooms…</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-secondary px-1.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-secondary transition-colors ml-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-[10px] font-medium text-primary">
                  H
                </span>
                <span className="text-[11px] font-medium text-foreground hidden sm:block">
                  Command
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{HAVOK.name}</p>
                <p className="text-xs text-muted-foreground">{HAVOK.host}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => router.push("/login")}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              setOpen(false);
              setQuery("");
            }
          }}
        >
          <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search rooms, catalog, line…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {query.trim() && Object.keys(grouped).length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {!query.trim() && (
                <div className="px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                    Rooms
                  </p>
                  <div className="space-y-0.5">
                    {searchIndex
                      .filter((r) => r.category === "Rooms")
                      .map((r) => (
                        <button
                          key={r.href + r.label}
                          onClick={() => handleSelect(r.href)}
                          className="flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm hover:bg-secondary transition-colors text-left"
                        >
                          <r.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                            {r.description}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="px-4 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
                    {category}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((r) => (
                      <button
                        key={r.label + r.href}
                        onClick={() => handleSelect(r.href)}
                        className="flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm hover:bg-secondary transition-colors text-left group"
                      >
                        <r.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{r.description}</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-secondary/40 text-[10px] text-muted-foreground">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
