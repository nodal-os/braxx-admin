import type { Vehicle } from './types';

export function displayBrand(brand: string): string {
  const normalized = brand.toLowerCase().replace(/ø/g, 'o');
  return normalized === 'havok' ? 'HAVØK' : brand;
}

export function vehicleLabel(vehicle: Pick<Vehicle, 'brand' | 'model'>): string {
  return [displayBrand(vehicle.brand), vehicle.model].filter(Boolean).join(' ').trim();
}

export function isFirstPartyHavok(vehicle: Pick<Vehicle, 'brand' | 'model'>): boolean {
  const brand = vehicle.brand.toLowerCase().replace(/ø/g, 'o');
  const model = vehicle.model.toLowerCase();
  return brand.includes('havok') && /\b(o3|03)\b/.test(model);
}

export function hasIncompleteSpecs(vehicle: Vehicle): boolean {
  const specKeys: Array<keyof Vehicle> = [
    'price_usd',
    'voltage_v',
    'battery_ah',
    'peak_kw',
    'top_speed_mph',
    'range_mi',
    'weight_kg',
  ];
  return specKeys.some((key) => !vehicle[key]);
}
