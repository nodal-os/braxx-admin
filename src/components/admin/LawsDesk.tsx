"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { LawState, LawsCatalog } from "@/lib/laws";
import { Search } from "lucide-react";

const LOCKED = {
  eyebrow: "Legal",
  title: "State Laws",
  hero: "Off-highway electric motorcycle. Not a Class 1–3 e-bike. Not street-legal as sold.",
  disclaimer:
    "This page is buyer information, not legal advice. Verified August 26, 2026. Contact legal@havok.com.",
  models:
    "O3 8 kW 72V+ ~80 mph; O3 Pro 15 kW 72V+ 60+ mph; X1 21 kW 72V+ ~80 mph. All off-highway electric motorcycles, no plate at purchase.",
  federal:
    "15 U.S.C. §2085 / CPSC needs pedals, <750 W, <20 mph motor-alone. These machines fail that test.",
} as const;

const FEATURED_ORDER = ["CA", "TX", "FL", "NY", "NJ", "IL"] as const;

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function matchesQuery(haystack: string, query: string): boolean {
  if (!query.trim()) return true;
  return haystack.toLowerCase().includes(query.trim().toLowerCase());
}

function stateSearchText(state: LawState): string {
  return [
    state.code,
    state.name,
    state.region,
    state.roads,
    state.need,
    state.helmet,
    state.notes,
    state.ohv,
    state.takeaway,
    state.seller ?? "",
  ].join(" ");
}

function roadsVariant(roads: string): "destructive" | "warning" | "outline" {
  const value = roads.toLowerCase();
  if (value.includes("illegal")) return "destructive";
  if (value.includes("gray")) return "warning";
  return "outline";
}

export function LawsDesk({ catalog }: { catalog: LawsCatalog }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const states = catalog.states;
  const regions = useMemo(() => uniqueSorted(states.map((state) => state.region)), [states]);
  const featured = useMemo(() => {
    const rows = states.filter((state) => state.featured);
    return [...rows].sort((left, right) => {
      const leftRank = FEATURED_ORDER.indexOf(left.code as (typeof FEATURED_ORDER)[number]);
      const rightRank = FEATURED_ORDER.indexOf(right.code as (typeof FEATURED_ORDER)[number]);
      return (leftRank === -1 ? 99 : leftRank) - (rightRank === -1 ? 99 : rightRank);
    });
  }, [states]);

  const visible = useMemo(
    () =>
      states.filter((state) => {
        const matchesRegion = region === "all" || state.region === region;
        const matchesFeatured = !featuredOnly || state.featured;
        return matchesRegion && matchesFeatured && matchesQuery(stateSearchText(state), query);
      }),
    [states, region, featuredOnly, query]
  );

  const selected =
    states.find((state) => state.code === selectedCode) ??
    featured.find((state) => state.code === selectedCode) ??
    null;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
          {LOCKED.eyebrow}
        </p>
        <h1 className="display text-2xl text-foreground">{LOCKED.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground">{LOCKED.hero}</p>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {LOCKED.disclaimer}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="workspace-panel space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Models
          </p>
          <p className="text-sm leading-relaxed text-foreground">{LOCKED.models}</p>
        </div>
        <div className="workspace-panel space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Federal
          </p>
          <p className="text-sm leading-relaxed text-foreground">{LOCKED.federal}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Metric label="Jurisdictions" value={states.length} />
        <Metric label="Featured" value={featured.length} />
        <Metric label="Verified" value={catalog.last_verified} />
      </div>

      {featured.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 border-b border-border pb-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
              Featured
            </h2>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {featured.map((state) => state.code).join(" · ")}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {featured.map((state) => (
              <button
                key={state.code}
                type="button"
                onClick={() => setSelectedCode(state.code)}
                className={cn(
                  "text-left rounded-lg border p-4 transition-colors",
                  selectedCode === state.code
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/35"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium">
                    {state.name}{" "}
                    <span className="opacity-60">{state.code}</span>
                  </span>
                  <Badge
                    variant={selectedCode === state.code ? "outline" : roadsVariant(state.roads)}
                    className={cn(
                      "text-[10px] uppercase shrink-0",
                      selectedCode === state.code && "border-primary-foreground/40 text-primary-foreground"
                    )}
                  >
                    {state.roads}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{state.takeaway}</p>
                {state.seller ? (
                  <p className="mt-2 text-[11px] leading-relaxed opacity-70">{state.seller}</p>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-1 w-fit">
          <ModeButton
            active={!featuredOnly}
            onClick={() => setFeaturedOnly(false)}
            label="All"
          />
          <ModeButton
            active={featuredOnly}
            onClick={() => setFeaturedOnly(true)}
            label="Featured"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search states, roads, helmet, notes…"
            className="h-9 pl-9 text-xs"
          />
        </div>
      </div>

      {regions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip
            label="All"
            active={region === "all"}
            onClick={() => setRegion("all")}
          />
          {regions.map((value) => (
            <CategoryChip
              key={value}
              label={value}
              active={region === value}
              onClick={() => setRegion(value)}
            />
          ))}
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3 border-b border-border pb-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
            Jurisdictions
          </h2>
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {visible.length} shown
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-xs text-muted-foreground">
            No jurisdictions match that search.
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-[0.14em]">State</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.14em] min-w-[140px]">
                    On public roads as sold
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.14em] min-w-[220px]">
                    What you need
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.14em] min-w-[180px]">
                    Helmet / age
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.14em] min-w-[220px]">
                    Notes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((state) => (
                  <TableRow
                    key={state.code}
                    data-state={selectedCode === state.code ? "selected" : undefined}
                    className="cursor-pointer"
                    onClick={() => setSelectedCode(state.code)}
                  >
                    <TableCell className="align-top">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {state.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          {state.code}
                          {state.featured ? " · Featured" : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={roadsVariant(state.roads)} className="text-[10px] uppercase whitespace-normal">
                        {state.roads}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-xs text-foreground leading-relaxed">
                      {state.need}
                    </TableCell>
                    <TableCell className="align-top text-xs text-foreground leading-relaxed">
                      {state.helmet}
                    </TableCell>
                    <TableCell className="align-top text-xs text-muted-foreground leading-relaxed">
                      {state.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {selected && (
        <section className="workspace-panel space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {selected.featured ? "Featured" : selected.region}
              </p>
              <h2 className="display text-xl text-foreground mt-1">
                {selected.name}
              </h2>
            </div>
            <Badge variant={roadsVariant(selected.roads)} className="text-[10px] uppercase">
              {selected.roads}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{selected.takeaway}</p>
          {selected.seller ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{selected.seller}</p>
          ) : null}
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="min-w-0">
        <span className="text-[9px] text-muted-foreground uppercase tracking-[0.16em] block">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-[10px] uppercase tracking-[0.14em] transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-[10px] uppercase tracking-[0.14em] border transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
