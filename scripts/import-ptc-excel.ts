/**
 * Power to Choose Excel Importer
 * 
 * This script imports a pre-downloaded Excel export from powertochoose.org
 * into your Supabase database. Use this for testing or manual imports.
 * 
 * Usage:
 *   npx ts-node scripts/import-ptc-excel.ts ./path/to/power-to-choose.xlsx [tdsp-slug]
 * 
 * Example:
 *   npx ts-node scripts/import-ptc-excel.ts ./downloads/centerpoint.xlsx centerpoint
 *   npx ts-node scripts/import-ptc-excel.ts ./downloads/oncor.xlsx oncor
 *   npx ts-node scripts/import-ptc-excel.ts ./downloads/aep-central.xlsx aep-central
 *   npx ts-node scripts/import-ptc-excel.ts ./downloads/aep-north.xlsx aep-north
 * 
 * Required packages:
 *   npm install xlsx @supabase/supabase-js
 */

import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Plan data structure matching the Excel export
interface PlanRow {
  ZipCode: number;
  TduCompany: string;
  RepCompany: string;
  'Plan Name': string;
  'Price/kWh 500': number;
  'Price/kWh 1000': number;
  'Price/kWh 2000': number;
  'Plan Type': number;
  'Rate Type': string;
  'Term Value': number;
  Prepaid: boolean;
  'Time Of Use': boolean;
  'Plan Details': string | null;
  'Pricing Details': string;
  'Renewable Perc': number;
  'Enroll Phone': string;
  'Fact Sheet': string;
  'Terms of Service': string;
  YRAC: string;
  'Ordering Info': string;
  'New Customer': boolean;
  'Min Usage Fees/Credits': boolean;
  Rating: number;
}

/**
 * Parse cancellation fee from Pricing Details string
 */
function parseCancellationFee(pricingDetails: string | null): number | null {
  if (!pricingDetails) return null;
  
  const match = pricingDetails.match(/\$(\d+(?:\.\d{2})?)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  // Handle "per remaining month" fees
  const perMonthMatch = pricingDetails.match(/\$(\d+)\s*per\s*remaining\s*month/i);
  if (perMonthMatch) {
    return parseFloat(perMonthMatch[1]);
  }
  
  return null;
}

/**
 * Determine TDSP slug from TduCompany name
 */
function getTdspSlug(tduCompany: string): string {
  const tduLower = (tduCompany || '').toLowerCase();
  if (tduLower.includes('centerpoint')) return 'centerpoint';
  if (tduLower.includes('oncor')) return 'oncor';
  if (tduLower.includes('aep') && tduLower.includes('central')) return 'aep-central';
  if (tduLower.includes('aep') && tduLower.includes('north')) return 'aep-north';
  if (tduLower.includes('texas-new mexico') || tduLower.includes('tnmp')) return 'tnmp';
  return 'unknown';
}

/**
 * Load and parse Excel file
 */
function loadExcelFile(filePath: string): PlanRow[] {
  console.log(`📂 Loading Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<PlanRow>(worksheet);
  
  console.log(`   Found ${data.length} plans`);
  return data;
}

/**
 * Update providers in Supabase
 */
async function updateProviders(plans: PlanRow[]): Promise<Map<string, string>> {
  console.log('\n📦 Updating providers...');
  
  const providerIdMap = new Map<string, string>();
  const uniqueProviders = [...new Set(plans.map(p => p.RepCompany))];
  
  for (const providerName of uniqueProviders) {
    if (!providerName) continue;
    
    const slug = providerName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Find a phone number for this provider
    const providerPlan = plans.find(p => p.RepCompany === providerName);
    const phone = providerPlan?.['Enroll Phone'] || null;
    
    // Calculate average rating for this provider
    const providerPlans = plans.filter(p => p.RepCompany === providerName);
    const avgRating = providerPlans.reduce((sum, p) => sum + (p.Rating || 0), 0) / providerPlans.length;
    
    const { data, error } = await supabase
      .from('providers')
      .upsert({
        name: providerName,
        slug,
        phone,
        rating: null,  // Skip rating for now
        description: `${providerName} - Texas electricity provider`,
      }, { onConflict: 'slug' })
      .select('id')
      .single();
    
    if (error) {
      console.error(`   ✗ ${providerName}: ${error.message}`);
    } else if (data) {
      providerIdMap.set(providerName, data.id);
      console.log(`   ✓ ${providerName} (${providerPlans.length} plans, rating: ${avgRating.toFixed(1)})`);
    }
  }
  
  return providerIdMap;
}

/**
 * Update plans in Supabase
 */
async function updatePlans(
  plans: PlanRow[], 
  providerIdMap: Map<string, string>,
  tdspSlugOverride?: string
): Promise<void> {
  console.log('\n📋 Updating plans...');
  
  let successCount = 0;
  let errorCount = 0;
  let skipCount = 0;
  
  for (const plan of plans) {
    const providerId = providerIdMap.get(plan.RepCompany);
    if (!providerId) {
      skipCount++;
      continue;
    }
    
    // Determine TDSP slug
    const tdspSlug = tdspSlugOverride || getTdspSlug(plan.TduCompany);
    
    // Parse rate type
    let planType = 'Fixed';
    if (plan['Rate Type']?.toLowerCase() === 'variable') planType = 'Variable';
    else if (plan['Rate Type']?.toLowerCase() === 'indexed') planType = 'Indexed';
    if (plan.Prepaid) planType = 'Prepaid';
    
    const { error } = await supabase
      .from('plans')
      .insert({
        provider_id: providerId,
        plan_name: plan['Plan Name'],
        plan_type: planType,
        contract_length_months: plan['Term Value'] || 1,
        renewable_percentage: plan['Renewable Perc'] || 0,
        rate_500kwh: plan['Price/kWh 500'],
        rate_1000kwh: plan['Price/kWh 1000'],
        rate_2000kwh: plan['Price/kWh 2000'],
        early_termination_fee: parseCancellationFee(plan['Pricing Details']),
        is_active: true,
        features: {
          source: 'powertochoose',
          tdspRegion: tdspSlug,
          tdspName: plan.TduCompany,
          zipCode: plan.ZipCode,
          eflUrl: plan['Fact Sheet'],
          tosUrl: plan['Terms of Service'],
          yracUrl: plan.YRAC,
          orderUrl: plan['Ordering Info'],
          enrollPhone: plan['Enroll Phone'],
          timeOfUse: plan['Time Of Use'] || false,
          prepaid: plan.Prepaid || false,
          newCustomerOnly: plan['New Customer'] || false,
          hasMinUsageFees: plan['Min Usage Fees/Credits'] || false,
          complaintRating: plan.Rating,
          scrapedAt: new Date().toISOString()
        }
      });
    
    if (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`   ✗ ${plan['Plan Name']}: ${error.message}`);
      }
    } else {
      successCount++;
    }
  }
  
  console.log(`   ✓ Inserted ${successCount} plans`);
  if (skipCount > 0) console.log(`   ⚠️ Skipped ${skipCount} (no provider ID)`);
  if (errorCount > 0) console.log(`   ✗ ${errorCount} errors`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: npx ts-node scripts/import-ptc-excel.ts <excel-file> [tdsp-slug]');
    console.log('');
    console.log('Examples:');
    console.log('  npx ts-node scripts/import-ptc-excel.ts ./centerpoint.xlsx centerpoint');
    console.log('  npx ts-node scripts/import-ptc-excel.ts ./oncor.xlsx oncor');
    console.log('  npx ts-node scripts/import-ptc-excel.ts ./aep-central.xlsx aep-central');
    console.log('  npx ts-node scripts/import-ptc-excel.ts ./aep-north.xlsx aep-north');
    process.exit(1);
  }
  
  const filePath = args[0];
  const tdspSlug = args[1];  // Optional override
  
  console.log('⚡ Power to Choose Excel Importer\n');
  console.log('='.repeat(40) + '\n');
  
  // Load Excel file
  const plans = loadExcelFile(filePath);
  
  if (plans.length === 0) {
    console.log('❌ No plans found in Excel file');
    process.exit(1);
  }
  
  // Show summary
  const tdspName = plans[0].TduCompany;
  const zipCode = plans[0].ZipCode;
  const detectedSlug = getTdspSlug(tdspName);
  
  console.log(`\n📊 Summary:`);
  console.log(`   TDSP: ${tdspName}`);
  console.log(`   ZIP Code: ${zipCode}`);
  console.log(`   Detected Slug: ${detectedSlug}`);
  console.log(`   Override Slug: ${tdspSlug || '(none)'}`);
  console.log(`   Total Plans: ${plans.length}`);
  
  // Update database
  const providerIdMap = await updateProviders(plans);
  await updatePlans(plans, providerIdMap, tdspSlug);
  
  console.log('\n✅ Import complete!');
}

// Run
main().catch(console.error);
