/**
 * Database types for the Texas Power Comparison application
 */

/**
 * Provider - Electricity provider/company
 */
export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  created_at: Date;
}

/**
 * Plan features - Additional plan details and benefits
 */
export interface PlanFeatures {
  [key: string]: string | number | boolean | null;
}

/**
 * Plan - Electricity plan offered by a provider
 */
export interface Plan {
  id: string;
  provider_id: string;
  plan_name: string;
  plan_type: string;
  contract_length_months: number;
  renewable_percentage: number;
  rate_500kwh: number;
  rate_1000kwh: number;
  rate_2000kwh: number;
  base_charge: number;
  early_termination_fee: number | null;
  features: PlanFeatures | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * ZipCoverage - Geographic coverage for plans
 */
export interface ZipCoverage {
  id: string;
  plan_id: string;
  zip_code: string;
  utility_provider: string;
  city: string;
  created_at: Date;
}

/**
 * City - City information with average rates
 */
export interface City {
  id: string;
  name: string;
  slug: string;
  county: string;
  population: number | null;
  average_rate_500: number | null;
  average_rate_1000: number | null;
  average_rate_2000: number | null;
  meta_title: string | null;
  meta_description: string | null;
}

/**
 * PlanWithProvider - Plan joined with its provider information
 * Useful for displaying complete plan details with provider data
 */
export interface PlanWithProvider extends Plan {
  provider: Provider;
}

/**
 * Database table names as constants
 */
export const TABLE_NAMES = {
  PROVIDERS: 'providers',
  PLANS: 'plans',
  ZIP_COVERAGE: 'zip_coverage',
  CITIES: 'cities',
} as const;

/**
 * Type for table names
 */
export type TableName = typeof TABLE_NAMES[keyof typeof TABLE_NAMES];
