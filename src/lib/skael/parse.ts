import type { Compatibility, Part, Vehicle } from './types';

export function parseCsv(text: string): Record<string, string>[] {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = (row[index] ?? '').trim();
    });
    return record;
  });
}

function parseCsvRows(text: string): string[][] {
  const input = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function field(row: Record<string, string>, key: string): string {
  return row[key] ?? '';
}

export function parseVehicles(csv: string): Vehicle[] {
  return parseCsv(csv).map((row) => ({
    vehicle_id: field(row, 'vehicle_id'),
    brand: field(row, 'brand'),
    model: field(row, 'model'),
    category: field(row, 'category'),
    year: field(row, 'year'),
    price_usd: field(row, 'price_usd'),
    product_url: field(row, 'product_url'),
    voltage_v: field(row, 'voltage_v'),
    battery_ah: field(row, 'battery_ah'),
    peak_kw: field(row, 'peak_kw'),
    rated_kw: field(row, 'rated_kw'),
    top_speed_mph: field(row, 'top_speed_mph'),
    range_mi: field(row, 'range_mi'),
    weight_kg: field(row, 'weight_kg'),
    wheelbase_mm: field(row, 'wheelbase_mm'),
    front_suspension: field(row, 'front_suspension'),
    rear_suspension: field(row, 'rear_suspension'),
    controller: field(row, 'controller'),
    frame: field(row, 'frame'),
    regen: field(row, 'regen'),
    colors: field(row, 'colors'),
    warranty: field(row, 'warranty'),
    notes: field(row, 'notes'),
    data_quality: field(row, 'data_quality'),
    source: field(row, 'source'),
  }));
}

export function parseParts(csv: string): Part[] {
  return parseCsv(csv).map((row) => ({
    part_id: field(row, 'part_id'),
    category: field(row, 'category'),
    subcategory: field(row, 'subcategory'),
    brand: field(row, 'brand'),
    name: field(row, 'name'),
    product_url: field(row, 'product_url'),
    price_usd: field(row, 'price_usd'),
    availability: field(row, 'availability'),
    voltage: field(row, 'voltage'),
    key_spec: field(row, 'key_spec'),
    notes: field(row, 'notes'),
    source: field(row, 'source'),
  }));
}

export function parseCompatibility(csv: string): Compatibility[] {
  return parseCsv(csv).map((row) => ({
    part_id: field(row, 'part_id'),
    vehicle_id: field(row, 'vehicle_id'),
    fitment: field(row, 'fitment'),
    adapter_notes: field(row, 'adapter_notes'),
    source_url: field(row, 'source_url'),
    confidence: field(row, 'confidence'),
    evidence: field(row, 'evidence'),
  }));
}
