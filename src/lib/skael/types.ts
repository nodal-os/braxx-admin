export const VEHICLE_CATEGORIES = ['emoto', 'ebike', 'e-atv', 'e-utv'] as const;
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const DATA_QUALITY_VALUES = ['verified', 'messy', 'inferred'] as const;
export type DataQuality = (typeof DATA_QUALITY_VALUES)[number];

export const PART_CATEGORIES = [
  'battery',
  'charger',
  'controller',
  'display',
  'throttle',
  'motor',
  'fork',
  'shock',
  'triple_clamp',
  'swingarm',
  'wheel',
  'tire',
  'brake',
  'drivetrain',
  'plastics',
  'other',
] as const;
export type PartCategory = (typeof PART_CATEGORIES)[number];

export const FITMENT_VALUES = [
  'direct',
  'adapter',
  'tune',
  'platform',
  'unconfirmed',
  'incompatible',
] as const;
export type Fitment = (typeof FITMENT_VALUES)[number];

export const CONFIDENCE_VALUES = ['high', 'medium', 'low'] as const;
export type Confidence = (typeof CONFIDENCE_VALUES)[number];

export interface Vehicle {
  vehicle_id: string;
  brand: string;
  model: string;
  category: VehicleCategory | string;
  year: string;
  price_usd: string;
  product_url: string;
  voltage_v: string;
  battery_ah: string;
  peak_kw: string;
  rated_kw: string;
  top_speed_mph: string;
  range_mi: string;
  weight_kg: string;
  wheelbase_mm: string;
  front_suspension: string;
  rear_suspension: string;
  controller: string;
  frame: string;
  regen: string;
  colors: string;
  warranty: string;
  notes: string;
  data_quality: DataQuality | string;
  source: string;
}

export interface Part {
  part_id: string;
  category: PartCategory | string;
  subcategory: string;
  brand: string;
  name: string;
  product_url: string;
  price_usd: string;
  availability: string;
  voltage: string;
  key_spec: string;
  notes: string;
  source: string;
}

export interface Compatibility {
  part_id: string;
  vehicle_id: string;
  fitment: Fitment | string;
  adapter_notes: string;
  source_url: string;
  confidence: Confidence | string;
  evidence: string;
}

export interface SkaelCatalog {
  vehicles: Vehicle[];
  parts: Part[];
  compatibility: Compatibility[];
}

export interface PartFitmentRow {
  compatibility: Compatibility;
  part: Part | null;
}

export interface VehicleFitmentRow {
  compatibility: Compatibility;
  vehicle: Vehicle | null;
}

export const VEHICLE_SPEC_FIELDS = [
  { key: 'price_usd', label: 'MSRP', unit: 'USD' },
  { key: 'year', label: 'Year', unit: '' },
  { key: 'category', label: 'Category', unit: '' },
  { key: 'voltage_v', label: 'Voltage', unit: 'V' },
  { key: 'battery_ah', label: 'Battery', unit: 'Ah' },
  { key: 'peak_kw', label: 'Peak Power', unit: 'kW' },
  { key: 'rated_kw', label: 'Rated Power', unit: 'kW' },
  { key: 'top_speed_mph', label: 'Top Speed', unit: 'mph' },
  { key: 'range_mi', label: 'Range', unit: 'mi' },
  { key: 'weight_kg', label: 'Weight', unit: 'kg' },
  { key: 'wheelbase_mm', label: 'Wheelbase', unit: 'mm' },
  { key: 'front_suspension', label: 'Front Suspension', unit: '' },
  { key: 'rear_suspension', label: 'Rear Suspension', unit: '' },
  { key: 'controller', label: 'Controller', unit: '' },
  { key: 'frame', label: 'Frame', unit: '' },
  { key: 'regen', label: 'Regen', unit: '' },
  { key: 'colors', label: 'Colors', unit: '' },
  { key: 'warranty', label: 'Warranty', unit: '' },
] as const satisfies ReadonlyArray<{
  key: keyof Vehicle;
  label: string;
  unit: string;
}>;
