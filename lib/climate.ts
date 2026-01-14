/**
 * Climate Utility for Texas Power Comparison
 *
 * This module provides climate zone information for Texas ZIP codes,
 * which is used to adjust electricity usage estimates based on regional
 * climate patterns and cooling/heating demands.
 */

// Climate zone types
export type ClimateZoneType =
  | 'houston'
  | 'dallas'
  | 'austin'
  | 'san-antonio'
  | 'fort-worth'
  | 'other';

// Climate zone information
export interface ClimateZone {
  zone: ClimateZoneType;
  name: string;
  modifier: number; // Percentage as decimal (e.g., 0.15 = 15%)
  description: string;
}

/**
 * ZIP code prefix ranges for each climate zone
 *
 * Texas ZIP codes are grouped by their first 3 digits to determine
 * which climate zone they belong to. This affects energy usage estimates
 * due to varying cooling and heating demands across the state.
 */
export const ZIP_CODE_ZONES: Record<string, ClimateZoneType> = {
  // Houston Area (770-775)
  '770': 'houston',
  '771': 'houston',
  '772': 'houston',
  '773': 'houston',
  '774': 'houston',
  '775': 'houston',

  // Dallas Area (750-753)
  '750': 'dallas',
  '751': 'dallas',
  '752': 'dallas',
  '753': 'dallas',

  // Austin Area (786-787)
  '786': 'austin',
  '787': 'austin',

  // San Antonio Area (780-782)
  '780': 'san-antonio',
  '781': 'san-antonio',
  '782': 'san-antonio',

  // Fort Worth Area (760-763)
  '760': 'fort-worth',
  '761': 'fort-worth',
  '762': 'fort-worth',
  '763': 'fort-worth',
};

/**
 * Climate zone data with modifiers and descriptions
 *
 * Modifiers represent the percentage increase in energy usage
 * compared to a baseline, accounting for regional climate factors:
 * - Temperature extremes (hot summers, cold winters)
 * - Humidity levels (affects AC efficiency)
 * - Number of cooling/heating degree days
 * - Typical insulation and construction standards
 */
export const CLIMATE_ZONES: Record<ClimateZoneType, ClimateZone> = {
  houston: {
    zone: 'houston',
    name: 'Houston Area',
    modifier: 0.15, // 15% increase
    description: 'Hot, humid summers with high AC usage year-round. Coastal humidity increases cooling demands.',
  },
  dallas: {
    zone: 'dallas',
    name: 'Dallas Area',
    modifier: 0.12, // 12% increase
    description: 'Hot summers and moderate winters. Higher cooling costs in summer months.',
  },
  austin: {
    zone: 'austin',
    name: 'Austin Area',
    modifier: 0.12, // 12% increase
    description: 'Hot summers with extended cooling season. Central Texas climate patterns.',
  },
  'san-antonio': {
    zone: 'san-antonio',
    name: 'San Antonio Area',
    modifier: 0.15, // 15% increase
    description: 'Hot, humid climate similar to Houston. High AC usage throughout most of the year.',
  },
  'fort-worth': {
    zone: 'fort-worth',
    name: 'Fort Worth Area',
    modifier: 0.10, // 10% increase
    description: 'Moderate climate with balanced heating and cooling needs. Less extreme than other major metros.',
  },
  other: {
    zone: 'other',
    name: 'Other Texas',
    modifier: 0.10, // 10% increase (default)
    description: 'Average Texas climate. Standard heating and cooling requirements.',
  },
};

/**
 * Get climate zone information for a ZIP code
 *
 * @param zipCode - 5-digit ZIP code string
 * @returns ClimateZone object with zone info, modifier, and description
 *
 * @example
 * ```typescript
 * const zone = getClimateZone('77001'); // Houston
 * console.log(zone.name); // "Houston Area"
 * console.log(zone.modifier); // 0.15 (15%)
 * ```
 */
export function getClimateZone(zipCode: string): ClimateZone {
  // Validate ZIP code
  if (!zipCode || zipCode.length < 3) {
    console.warn(`Invalid ZIP code: ${zipCode}. Using default climate zone.`);
    return CLIMATE_ZONES.other;
  }

  // Extract first 3 digits
  const zipPrefix = zipCode.substring(0, 3);

  // Look up zone by prefix
  const zoneType = ZIP_CODE_ZONES[zipPrefix];

  // Return zone data or default to 'other'
  if (zoneType && CLIMATE_ZONES[zoneType]) {
    return CLIMATE_ZONES[zoneType];
  }

  return CLIMATE_ZONES.other;
}

/**
 * Get the climate modifier for a ZIP code as a percentage
 *
 * @param zipCode - 5-digit ZIP code string
 * @returns Modifier as a decimal (e.g., 0.15 for 15%)
 *
 * @example
 * ```typescript
 * const modifier = getClimateModifier('77001'); // 0.15
 * const adjustedUsage = baseUsage * (1 + modifier); // Increase by 15%
 * ```
 */
export function getClimateModifier(zipCode: string): number {
  return getClimateZone(zipCode).modifier;
}

/**
 * Check if a ZIP code is in a specific climate zone
 *
 * @param zipCode - 5-digit ZIP code string
 * @param zone - Climate zone type to check
 * @returns True if ZIP code is in the specified zone
 *
 * @example
 * ```typescript
 * if (isInClimateZone('77001', 'houston')) {
 *   console.log('This is in the Houston area');
 * }
 * ```
 */
export function isInClimateZone(zipCode: string, zone: ClimateZoneType): boolean {
  return getClimateZone(zipCode).zone === zone;
}

/**
 * Get a list of all available climate zones
 *
 * @returns Array of all ClimateZone objects
 */
export function getAllClimateZones(): ClimateZone[] {
  return Object.values(CLIMATE_ZONES);
}

/**
 * Get climate zone display name for a ZIP code
 *
 * @param zipCode - 5-digit ZIP code string
 * @returns Display name (e.g., "Houston Area")
 */
export function getClimateZoneName(zipCode: string): string {
  return getClimateZone(zipCode).name;
}

// Export constants for testing and reference
export const HOUSTON_ZIP_PREFIXES = ['770', '771', '772', '773', '774', '775'];
export const DALLAS_ZIP_PREFIXES = ['750', '751', '752', '753'];
export const AUSTIN_ZIP_PREFIXES = ['786', '787'];
export const SAN_ANTONIO_ZIP_PREFIXES = ['780', '781', '782'];
export const FORT_WORTH_ZIP_PREFIXES = ['760', '761', '762', '763'];

/**
 * Example usage calculations
 *
 * Base usage: 1000 kWh/month
 * Houston ZIP: 77001
 * Climate modifier: 0.15 (15%)
 *
 * Calculation:
 * climateAdjustment = baseUsage * modifier = 1000 * 0.15 = 150 kWh
 * totalUsage = baseUsage + climateAdjustment = 1000 + 150 = 1150 kWh
 *
 * Or more simply:
 * totalUsage = baseUsage * (1 + modifier) = 1000 * 1.15 = 1150 kWh
 */
