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
import {
  hasIncompleteSpecs,
  isFirstPartyHavok,
  vehicleLabel,
} from "@/lib/skael/helpers";
import { VEHICLE_SPEC_FIELDS } from "@/lib/skael/types";
import type { Compatibility, Part, SkaelCatalog, Vehicle } from "@/lib/skael/types";
import { ExternalLink, Search } from "lucide-react";

type FilterMode = "vehicle" | "part";

const FITMENT_VARIANT: Record<string, "success" | "info" | "purple" | "outline" | "warning" | "destructive"> = {
  direct: "success",
  adapter: "info",
  tune: "purple",
  platform: "outline",
  unconfirmed: "warning",
  incompatible: "destructive",
};

const QUALITY_VARIANT: Record<string, "success" | "warning" | "secondary"> = {
  verified: "success",
  messy: "warning",
  inferred: "secondary",
};

function displayValue(value: string | undefined, unit?: string): string {
  if (!value) return "—";
  return unit ? `${value} ${unit}` : value;
}

function matchesQuery(haystack: string, query: string): boolean {
  if (!query.trim()) return true;
  return haystack.toLowerCase().includes(query.trim().toLowerCase());
}

function vehicleSearchText(vehicle: Vehicle): string {
  return [
    vehicle.vehicle_id,
    vehicle.brand,
    vehicle.model,
    vehicle.category,
    vehicle.year,
    vehicle.notes,
    vehicle.data_quality,
  ].join(" ");
}

function partSearchText(part: Part): string {
  return [
    part.part_id,
    part.brand,
    part.name,
    part.category,
    part.subcategory,
    part.key_spec,
    part.notes,
  ].join(" ");
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function SkaelCatalogView({ catalog }: { catalog: SkaelCatalog }) {
  const [mode, setMode] = useState<FilterMode>("vehicle");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const vehicles = catalog.vehicles;
  const parts = catalog.parts;

  const vehicleCategories = useMemo(
    () => uniqueSorted(vehicles.map((vehicle) => vehicle.category)),
    [vehicles]
  );
  const partCategories = useMemo(
    () => uniqueSorted(parts.map((part) => part.category)),
    [parts]
  );

  const visibleVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        const matchesCategory = category === "all" || vehicle.category === category;
        return matchesCategory && matchesQuery(vehicleSearchText(vehicle), query);
      }),
    [vehicles, category, query]
  );

  const visibleParts = useMemo(
    () =>
      parts.filter((part) => {
        const matchesCategory = category === "all" || part.category === category;
        return matchesCategory && matchesQuery(partSearchText(part), query);
      }),
    [parts, category, query]
  );

  const selectedVehicles = useMemo(
    () =>
      selectedVehicleIds
        .map((id) => vehicles.find((vehicle) => vehicle.vehicle_id === id))
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)),
    [selectedVehicleIds, vehicles]
  );

  const selectedPart = parts.find((part) => part.part_id === selectedPartId) ?? null;

  const partsForSelected = useMemo(() => {
    if (selectedVehicles.length === 0) return [];
    return selectedVehicles.map((vehicle) => ({
      vehicle,
      rows: catalog.compatibility
        .filter((row) => row.vehicle_id === vehicle.vehicle_id)
        .map((compatibility) => ({
          compatibility,
          part: parts.find((part) => part.part_id === compatibility.part_id) ?? null,
        })),
    }));
  }, [catalog.compatibility, parts, selectedVehicles]);

  const vehiclesForSelectedPart = useMemo(() => {
    if (!selectedPartId) return [];
    return catalog.compatibility
      .filter((row) => row.part_id === selectedPartId)
      .map((compatibility) => ({
        compatibility,
        vehicle: vehicles.find((vehicle) => vehicle.vehicle_id === compatibility.vehicle_id) ?? null,
      }));
  }, [catalog.compatibility, selectedPartId, vehicles]);

  const qualityCounts = useMemo(() => {
    return vehicles.reduce(
      (acc, vehicle) => {
        const key = vehicle.data_quality || "unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [vehicles]);

  const switchMode = (next: FilterMode) => {
    setMode(next);
    setQuery("");
    setCategory("all");
  };

  const toggleVehicle = (vehicleId: string) => {
    setSelectedVehicleIds((current) =>
      current.includes(vehicleId)
        ? current.filter((id) => id !== vehicleId)
        : [...current, vehicleId]
    );
  };

  const categories = mode === "vehicle" ? vehicleCategories : partCategories;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              SKAEL
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              HAVØK Command Center
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-2xl">
            Filter emotos and aftermarket parts both ways — by vehicle, or by part.
            Fitment and confidence stay attached. Messy and inferred rows stay visible.
            HAVØK 03 remains in the catalog even when specs are incomplete.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <Metric label="Vehicles" value={vehicles.length} />
        <Metric label="Parts" value={parts.length} />
        <Metric label="Joins" value={catalog.compatibility.length} />
        <Metric label="Verified" value={qualityCounts.verified ?? 0} />
        <Metric label="Messy / inferred" value={(qualityCounts.messy ?? 0) + (qualityCounts.inferred ?? 0)} />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-1 w-fit">
          <ModeButton
            active={mode === "vehicle"}
            onClick={() => switchMode("vehicle")}
            label="By vehicle"
          />
          <ModeButton
            active={mode === "part"}
            onClick={() => switchMode("part")}
            label="By part"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              mode === "vehicle"
                ? "Search bikes, brands, years…"
                : "Search parts, brands, categories…"
            }
            className="h-9 pl-9 text-xs font-mono"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip
            label="All"
            active={category === "all"}
            onClick={() => setCategory("all")}
          />
          {categories.map((value) => (
            <CategoryChip
              key={value}
              label={value}
              active={category === value}
              onClick={() => setCategory(value)}
            />
          ))}
        </div>
      )}

      {mode === "vehicle" ? (
        <>
          <section className="space-y-3">
            <SectionLabel
              title="Vehicles"
              note={`${visibleVehicles.length} shown · messy and inferred stay in`}
            />
            {visibleVehicles.length === 0 ? (
              <EmptyBlock message="No vehicles match that search." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {visibleVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.vehicle_id || vehicle.model}
                    vehicle={vehicle}
                    selected={selectedVehicleIds.includes(vehicle.vehicle_id)}
                    onToggle={() => toggleVehicle(vehicle.vehicle_id)}
                  />
                ))}
              </div>
            )}
          </section>

          {selectedVehicles.length >= 2 && <SpecMatrix vehicles={selectedVehicles} />}

          <section className="space-y-3">
            <SectionLabel
              title="Compatible parts"
              note={
                selectedVehicles.length === 0
                  ? "Pick a vehicle to see parts"
                  : `${selectedVehicles.length} bike${selectedVehicles.length === 1 ? "" : "s"} selected`
              }
            />
            {selectedVehicles.length === 0 ? (
              <EmptyBlock message="Select one or more vehicles to list compatible parts, fitment, and confidence." />
            ) : (
              <div className="space-y-6">
                {partsForSelected.map(({ vehicle, rows }) => (
                  <div key={vehicle.vehicle_id} className="space-y-2">
                    <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
                      {vehicleLabel(vehicle) || vehicle.vehicle_id}
                    </h3>
                    {rows.length === 0 ? (
                      <EmptyBlock message="No compatibility rows for this vehicle yet." />
                    ) : (
                      <FitmentTable
                        rows={rows.map(({ part, compatibility }) => ({
                          id: `${compatibility.part_id}-${compatibility.vehicle_id}-${compatibility.fitment}`,
                          title: part?.name || compatibility.part_id,
                          subtitle: [part?.brand, part?.category, part?.subcategory]
                            .filter(Boolean)
                            .join(" · "),
                          extra: part?.key_spec,
                          url: part?.product_url,
                          compatibility,
                        }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <section className="space-y-3">
            <SectionLabel title="Parts" note={`${visibleParts.length} shown`} />
            {visibleParts.length === 0 ? (
              <EmptyBlock message="No parts match that search." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {visibleParts.map((part) => (
                  <button
                    key={part.part_id || part.name}
                    type="button"
                    onClick={() => setSelectedPartId(part.part_id)}
                    className={cn(
                      "text-left rounded-lg border p-4 transition-colors",
                      selectedPartId === part.part_id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                        {part.category || "part"}
                        {part.subcategory ? ` · ${part.subcategory}` : ""}
                      </span>
                      {part.availability && (
                        <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                          {part.availability}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium leading-tight">
                      {part.name || part.part_id}
                    </h3>
                    <p className="mt-1 text-xs opacity-60">{part.brand}</p>
                    {part.key_spec && (
                      <p className="mt-2 text-[11px] opacity-70 line-clamp-2">{part.key_spec}</p>
                    )}
                    {part.price_usd && (
                      <p className="mt-2 text-xs font-mono tabular-nums">${part.price_usd}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <SectionLabel
              title="Compatible vehicles"
              note={
                selectedPart
                  ? vehicleLabel({ brand: selectedPart.brand, model: selectedPart.name })
                  : "Pick a part"
              }
            />
            {!selectedPart ? (
              <EmptyBlock message="Select a part to list compatible vehicles, fitment, and confidence." />
            ) : vehiclesForSelectedPart.length === 0 ? (
              <EmptyBlock message="No compatibility rows for this part yet." />
            ) : (
              <FitmentTable
                rows={vehiclesForSelectedPart.map(({ vehicle, compatibility }) => ({
                  id: `${compatibility.part_id}-${compatibility.vehicle_id}-${compatibility.fitment}`,
                  title: vehicle
                    ? vehicleLabel(vehicle) || vehicle.vehicle_id
                    : compatibility.vehicle_id,
                  subtitle: vehicle
                    ? [vehicle.year, vehicle.category].filter(Boolean).join(" · ")
                    : "Vehicle row not in catalog",
                  extra: vehicle?.notes,
                  url: vehicle?.product_url,
                  quality: vehicle?.data_quality,
                  compatibility,
                }))}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="min-w-0">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-sm font-mono font-semibold tabular-nums text-foreground">
          {value}
        </span>
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
        "px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
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
        "rounded px-2 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function SectionLabel({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-border pb-2">
      <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
        {title}
      </h2>
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {note}
      </span>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-xs text-muted-foreground">
      {message}
    </div>
  );
}

function QualityBadge({ quality }: { quality?: string }) {
  if (!quality) return null;
  return (
    <Badge variant={QUALITY_VARIANT[quality] ?? "outline"} className="text-[10px] uppercase">
      {quality}
    </Badge>
  );
}

function FitmentBadges({ compatibility }: { compatibility: Compatibility }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {compatibility.fitment && (
        <Badge
          variant={FITMENT_VARIANT[compatibility.fitment] ?? "outline"}
          className="text-[10px] uppercase"
        >
          {compatibility.fitment}
        </Badge>
      )}
      {compatibility.confidence && (
        <Badge variant="secondary" className="text-[10px] uppercase">
          {compatibility.confidence}
        </Badge>
      )}
    </div>
  );
}

function VehicleCard({
  vehicle,
  selected,
  onToggle,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onToggle: () => void;
}) {
  const incomplete = hasIncompleteSpecs(vehicle);
  const firstParty = isFirstPartyHavok(vehicle);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "text-left rounded-lg border p-4 transition-colors",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card hover:border-foreground/30"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <QualityBadge quality={vehicle.data_quality} />
          {firstParty && (
            <Badge variant="default" className="text-[10px] uppercase">
              First party
            </Badge>
          )}
          {incomplete && (
            <Badge variant="outline" className={cn("text-[10px] uppercase", selected && "border-background/40")}>
              Specs incomplete
            </Badge>
          )}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider opacity-50">
          {vehicle.category || "vehicle"}
        </span>
      </div>
      <h3 className="text-sm font-medium leading-tight">
        {vehicleLabel(vehicle) || vehicle.vehicle_id}
      </h3>
      <p className="mt-1 text-xs opacity-60">
        {[vehicle.year, vehicle.vehicle_id].filter(Boolean).join(" · ")}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-wider">
        <SpecChip label="Peak" value={displayValue(vehicle.peak_kw, "kW")} selected={selected} />
        <SpecChip label="Speed" value={displayValue(vehicle.top_speed_mph, "mph")} selected={selected} />
        <SpecChip label="Range" value={displayValue(vehicle.range_mi, "mi")} selected={selected} />
      </div>
    </button>
  );
}

function SpecChip({
  label,
  value,
  selected,
}: {
  label: string;
  value: string;
  selected: boolean;
}) {
  return (
    <div className={cn("rounded-md px-2 py-2", selected ? "bg-background/10" : "bg-secondary")}>
      <span className="block opacity-50 mb-0.5">{label}</span>
      <span className="block text-[11px] tracking-tight normal-case">{value}</span>
    </div>
  );
}

function SpecMatrix({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="space-y-3">
      <SectionLabel title="Spec compare" note={`${vehicles.length} selected`} />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                Measurement
              </TableHead>
              {vehicles.map((vehicle) => (
                <TableHead key={vehicle.vehicle_id} className="min-w-[160px]">
                  <div className="space-y-1.5">
                    <QualityBadge quality={vehicle.data_quality} />
                    <div className="text-xs font-medium text-foreground normal-case tracking-normal">
                      {vehicleLabel(vehicle) || vehicle.vehicle_id}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {VEHICLE_SPEC_FIELDS.map((spec) => (
              <TableRow key={spec.key}>
                <TableCell className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {spec.label}
                </TableCell>
                {vehicles.map((vehicle) => (
                  <TableCell key={`${vehicle.vehicle_id}-${spec.key}`} className="text-xs">
                    {displayValue(String(vehicle[spec.key] ?? ""), spec.unit)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function FitmentTable({
  rows,
}: {
  rows: Array<{
    id: string;
    title: string;
    subtitle: string;
    extra?: string;
    url?: string;
    quality?: string;
    compatibility: Compatibility;
  }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px] font-mono uppercase tracking-wider">Item</TableHead>
            <TableHead className="text-[10px] font-mono uppercase tracking-wider">Fitment</TableHead>
            <TableHead className="text-[10px] font-mono uppercase tracking-wider">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="align-top">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                      >
                        {row.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{row.title}</span>
                    )}
                    {row.quality && <QualityBadge quality={row.quality} />}
                  </div>
                  {row.subtitle && (
                    <p className="text-xs text-muted-foreground">{row.subtitle}</p>
                  )}
                  {row.extra && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{row.extra}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="align-top">
                <FitmentBadges compatibility={row.compatibility} />
              </TableCell>
              <TableCell className="align-top text-xs text-muted-foreground">
                <div className="space-y-1">
                  {row.compatibility.adapter_notes && (
                    <p>Adapter · {row.compatibility.adapter_notes}</p>
                  )}
                  {row.compatibility.evidence && (
                    <p>Evidence · {row.compatibility.evidence}</p>
                  )}
                  {!row.compatibility.adapter_notes && !row.compatibility.evidence && "—"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
