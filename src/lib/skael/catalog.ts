import { readFile } from 'fs/promises';
import path from 'path';
import { parseCompatibility, parseParts, parseVehicles } from './parse';
import type { PartFitmentRow, SkaelCatalog, VehicleFitmentRow } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'skael');

export async function loadSkaelCatalog(): Promise<SkaelCatalog> {
  const [vehiclesCsv, partsCsv, compatibilityCsv] = await Promise.all([
    readFile(path.join(DATA_DIR, 'vehicles.csv'), 'utf8'),
    readFile(path.join(DATA_DIR, 'parts.csv'), 'utf8'),
    readFile(path.join(DATA_DIR, 'compatibility.csv'), 'utf8'),
  ]);

  return {
    vehicles: parseVehicles(vehiclesCsv),
    parts: parseParts(partsCsv),
    compatibility: parseCompatibility(compatibilityCsv),
  };
}

export function partsForVehicle(
  catalog: SkaelCatalog,
  vehicleId: string
): PartFitmentRow[] {
  return catalog.compatibility
    .filter((row) => row.vehicle_id === vehicleId)
    .map((compatibility) => ({
      compatibility,
      part: catalog.parts.find((part) => part.part_id === compatibility.part_id) ?? null,
    }));
}

export function vehiclesForPart(
  catalog: SkaelCatalog,
  partId: string
): VehicleFitmentRow[] {
  return catalog.compatibility
    .filter((row) => row.part_id === partId)
    .map((compatibility) => ({
      compatibility,
      vehicle:
        catalog.vehicles.find((vehicle) => vehicle.vehicle_id === compatibility.vehicle_id) ??
        null,
    }));
}
