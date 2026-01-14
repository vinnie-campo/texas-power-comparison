/**
 * Scraper Service
 * Coordinates scraping across multiple ZIP codes and manages plan updates
 */

import { createStaticClient } from '@/lib/supabase';
import {
  scrapePlansFromZip,
  getProviderIdBySlug,
  ScrapedPlan,
  ScrapeResult,
} from './power-to-choose';

// Major ZIP codes representing different utility areas in Texas
export const TARGET_ZIP_CODES = [
  { zip: '77001', city: 'Houston', utility: 'CenterPoint Energy' },
  { zip: '75201', city: 'Dallas', utility: 'Oncor' },
  { zip: '78701', city: 'Austin', utility: 'Austin Energy' },
  { zip: '76101', city: 'Fort Worth', utility: 'Oncor' },
  { zip: '78201', city: 'San Antonio', utility: 'CPS Energy' },
  { zip: '79901', city: 'El Paso', utility: 'El Paso Electric' },
];

export interface PlanChange {
  type: 'new' | 'updated' | 'removed';
  planId?: string;
  planName: string;
  providerName: string;
  oldRate?: number;
  newRate?: number;
  changes?: string[];
}

export interface ScrapeSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  zipCodesScraped: string[];
  totalPlansFound: number;
  uniquePlans: number;
  newPlans: PlanChange[];
  updatedPlans: PlanChange[];
  removedPlans: PlanChange[];
  errors: string[];
  warnings: string[];
  dataSource: 'api' | 'estimated' | 'mixed';
}

/**
 * Run a complete scrape across all target ZIP codes
 */
export async function runFullScrape(
  autoApply: boolean = false
): Promise<ScrapeSession> {
  const session: ScrapeSession = {
    sessionId: generateSessionId(),
    startTime: new Date().toISOString(),
    status: 'running',
    zipCodesScraped: [],
    totalPlansFound: 0,
    uniquePlans: 0,
    newPlans: [],
    updatedPlans: [],
    removedPlans: [],
    errors: [],
    warnings: [],
    dataSource: 'api',
  };

  console.log(`🚀 Starting scrape session: ${session.sessionId}`);

  try {
    // Step 1: Scrape all ZIP codes
    const allScrapedPlans: ScrapedPlan[] = [];
    const scrapeResults: ScrapeResult[] = [];
    const dataSources = new Set<string>();

    for (const target of TARGET_ZIP_CODES) {
      console.log(`📍 Scraping ${target.city} (${target.zip})...`);

      const result = await scrapePlansFromZip(target.zip, 2000); // 2 second delay between requests
      scrapeResults.push(result);

      if (result.success) {
        session.zipCodesScraped.push(target.zip);
        allScrapedPlans.push(...result.plans);
        session.totalPlansFound += result.plansFound;
        dataSources.add(result.dataSource);
      }

      if (result.errors.length > 0) {
        session.errors.push(...result.errors.map(e => `${target.zip}: ${e}`));
      }

      if (result.warnings && result.warnings.length > 0) {
        // Only add unique warnings
        result.warnings.forEach(warning => {
          if (!session.warnings.includes(warning)) {
            session.warnings.push(warning);
          }
        });
      }
    }

    // Determine overall data source
    if (dataSources.size > 1) {
      session.dataSource = 'mixed';
    } else if (dataSources.has('estimated')) {
      session.dataSource = 'estimated';
    } else if (dataSources.has('api')) {
      session.dataSource = 'api';
    }

    // Step 2: Deduplicate plans (same plan appears in multiple ZIPs)
    const uniquePlans = deduplicatePlans(allScrapedPlans);
    session.uniquePlans = uniquePlans.length;

    console.log(`📊 Found ${session.totalPlansFound} total plans, ${session.uniquePlans} unique`);

    // Step 3: Compare with existing database plans
    const comparison = await comparePlansWithDatabase(uniquePlans);
    session.newPlans = comparison.newPlans;
    session.updatedPlans = comparison.updatedPlans;
    session.removedPlans = comparison.removedPlans;

    console.log(`📈 Changes: ${session.newPlans.length} new, ${session.updatedPlans.length} updated, ${session.removedPlans.length} removed`);

    // Step 4: Apply changes if auto-apply is enabled
    if (autoApply) {
      await applyChanges(session);
    }

    session.status = 'completed';
    session.endTime = new Date().toISOString();

    console.log(`✅ Scrape session completed: ${session.sessionId}`);
  } catch (error) {
    session.status = 'failed';
    session.endTime = new Date().toISOString();
    session.errors.push(error instanceof Error ? error.message : 'Unknown error');
    console.error(`❌ Scrape session failed:`, error);
  }

  return session;
}

/**
 * Deduplicate plans by provider + plan name
 */
function deduplicatePlans(plans: ScrapedPlan[]): ScrapedPlan[] {
  const seen = new Map<string, ScrapedPlan>();

  for (const plan of plans) {
    const key = `${plan.providerName}::${plan.planName}`;

    if (!seen.has(key)) {
      seen.set(key, plan);
    } else {
      // If we see the same plan again, keep the one with the best data
      const existing = seen.get(key)!;
      if (plan.eflUrl && !existing.eflUrl) {
        seen.set(key, plan);
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Compare scraped plans with existing database plans
 */
async function comparePlansWithDatabase(
  scrapedPlans: ScrapedPlan[]
): Promise<{
  newPlans: PlanChange[];
  updatedPlans: PlanChange[];
  removedPlans: PlanChange[];
}> {
  const supabase = createStaticClient();

  // Fetch all existing active plans from database
  const { data: existingPlans, error } = await supabase
    .from('plans')
    .select(`
      id,
      plan_name,
      rate_1000kwh,
      provider:providers(name, slug)
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching existing plans:', error);
    return { newPlans: [], updatedPlans: [], removedPlans: [] };
  }

  const newPlans: PlanChange[] = [];
  const updatedPlans: PlanChange[] = [];
  const removedPlans: PlanChange[] = [];

  // Create a map of existing plans
  const existingPlanMap = new Map<string, any>();
  for (const plan of existingPlans || []) {
    const key = `${plan.provider?.name}::${plan.plan_name}`;
    existingPlanMap.set(key, plan);
  }

  // Check scraped plans against existing
  for (const scrapedPlan of scrapedPlans) {
    // Skip plans from providers not in our database
    if (!scrapedPlan.providerSlug) {
      continue;
    }

    const key = `${scrapedPlan.providerName}::${scrapedPlan.planName}`;
    const existingPlan = existingPlanMap.get(key);

    if (!existingPlan) {
      // New plan
      newPlans.push({
        type: 'new',
        planName: scrapedPlan.planName,
        providerName: scrapedPlan.providerName,
        newRate: scrapedPlan.rate1000kwh,
      });
    } else {
      // Check for rate changes
      const oldRate = existingPlan.rate_1000kwh;
      const newRate = scrapedPlan.rate1000kwh;
      const rateDiff = Math.abs(oldRate - newRate);

      if (rateDiff > 0.1) {
        // Rate changed by more than 0.1 cents
        updatedPlans.push({
          type: 'updated',
          planId: existingPlan.id,
          planName: scrapedPlan.planName,
          providerName: scrapedPlan.providerName,
          oldRate,
          newRate,
          changes: [`Rate changed from ${oldRate.toFixed(1)}¢ to ${newRate.toFixed(1)}¢`],
        });
      }

      // Mark as seen
      existingPlanMap.delete(key);
    }
  }

  // Remaining plans in existingPlanMap are no longer available
  for (const [key, plan] of existingPlanMap.entries()) {
    removedPlans.push({
      type: 'removed',
      planId: plan.id,
      planName: plan.plan_name,
      providerName: plan.provider?.name || 'Unknown',
      oldRate: plan.rate_1000kwh,
    });
  }

  return { newPlans, updatedPlans, removedPlans };
}

/**
 * Apply changes to database
 */
async function applyChanges(session: ScrapeSession): Promise<void> {
  const supabase = createStaticClient();

  console.log('🔄 Applying changes to database...');

  // Mark removed plans as inactive
  for (const change of session.removedPlans) {
    if (change.planId) {
      await supabase
        .from('plans')
        .update({ is_active: false })
        .eq('id', change.planId);
    }
  }

  // Update rates for changed plans
  for (const change of session.updatedPlans) {
    if (change.planId && change.newRate) {
      await supabase
        .from('plans')
        .update({
          rate_1000kwh: change.newRate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', change.planId);
    }
  }

  console.log(`✅ Applied ${session.removedPlans.length} removals and ${session.updatedPlans.length} updates`);
  console.log(`ℹ️  ${session.newPlans.length} new plans found (not auto-inserted)`);
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `scrape_${timestamp}_${random}`;
}

/**
 * Convert scraped plan to database format
 */
export async function convertScrapedPlanToDbFormat(
  scrapedPlan: ScrapedPlan
): Promise<any | null> {
  if (!scrapedPlan.providerSlug) {
    return null;
  }

  const providerId = await getProviderIdBySlug(scrapedPlan.providerSlug);
  if (!providerId) {
    console.warn(`Provider not found for slug: ${scrapedPlan.providerSlug}`);
    return null;
  }

  return {
    provider_id: providerId,
    plan_name: scrapedPlan.planName,
    plan_type: scrapedPlan.planType,
    contract_length_months: scrapedPlan.contractLengthMonths,
    rate_500kwh: scrapedPlan.rate500kwh,
    rate_1000kwh: scrapedPlan.rate1000kwh,
    rate_2000kwh: scrapedPlan.rate2000kwh,
    renewable_percentage: scrapedPlan.renewablePercentage,
    base_charge: scrapedPlan.baseCharge,
    early_termination_fee: scrapedPlan.earlyTerminationFee,
    features: scrapedPlan.features,
    efl_url: scrapedPlan.eflUrl,
    tos_url: scrapedPlan.tosUrl,
    yrac_url: scrapedPlan.yracUrl,
    is_active: true,
  };
}
