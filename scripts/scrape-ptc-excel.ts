/**
 * Power to Choose Excel Export Scraper
 * 
 * This script automates the process of:
 * 1. Going to powertochoose.org
 * 2. Entering a ZIP code for each TDSP region
 * 3. Clicking the Excel export button
 * 4. Parsing the downloaded Excel file
 * 5. Storing the data in Supabase
 * 
 * Usage:
 *   npx ts-node scripts/scrape-ptc-excel.ts
 * 
 * Required packages:
 *   npm install puppeteer xlsx @supabase/supabase-js
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// TDSP regions with representative ZIP codes
const TDSP_REGIONS = [
  { 
    name: 'CenterPoint Energy',
    slug: 'centerpoint',
    zipCode: '77007',  // Houston
    tduName: 'CENTERPOINT ENERGY HOUSTON ELECTRIC LLC'
  },
  { 
    name: 'Oncor Electric Delivery',
    slug: 'oncor',
    zipCode: '75201',  // Dallas
    tduName: 'ONCOR ELECTRIC DELIVERY'
  },
  { 
    name: 'AEP Texas Central',
    slug: 'aep-central',
    zipCode: '78401',  // Corpus Christi
    tduName: 'AEP TEXAS CENTRAL'
  },
  { 
    name: 'AEP Texas North',
    slug: 'aep-north',
    zipCode: '76903',  // San Angelo
    tduName: 'AEP TEXAS NORTH'
  },
];

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

// Download directory
const DOWNLOAD_DIR = path.join(process.cwd(), 'tmp', 'ptc-downloads');

/**
 * Ensure download directory exists
 */
function ensureDownloadDir(): void {
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }
}

/**
 * Clear old downloads
 */
function clearDownloads(): void {
  if (fs.existsSync(DOWNLOAD_DIR)) {
    const files = fs.readdirSync(DOWNLOAD_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(DOWNLOAD_DIR, file));
    }
  }
}

/**
 * Wait for a file to appear in the download directory
 */
async function waitForDownload(timeout: number = 30000): Promise<string | null> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const files = fs.readdirSync(DOWNLOAD_DIR);
    const xlsxFiles = files.filter(f => f.endsWith('.xlsx') && !f.includes('.crdownload'));
    
    if (xlsxFiles.length > 0) {
      return path.join(DOWNLOAD_DIR, xlsxFiles[0]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return null;
}

/**
 * Export plans for a specific ZIP code
 */
async function exportPlansForZip(page: Page, zipCode: string): Promise<PlanRow[]> {
  console.log(`  Navigating to Power to Choose...`);
  
  // Go to the site
  await page.goto('https://www.powertochoose.org/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Find and fill the ZIP code input
  console.log(`  Entering ZIP code: ${zipCode}`);
  
  // Try different selectors for the ZIP input
  const zipSelectors = [
    'input[type="text"]',
    'input[name*="zip"]',
    'input[id*="zip"]',
    'input[placeholder*="ZIP"]',
    '#txtZipCode',
    '.zip-input input'
  ];
  
  let zipInput = null;
  for (const selector of zipSelectors) {
    zipInput = await page.$(selector);
    if (zipInput) break;
  }
  
  if (!zipInput) {
    throw new Error('Could not find ZIP code input');
  }
  
  // Clear and enter ZIP
  await zipInput.click({ clickCount: 3 });
  await zipInput.type(zipCode, { delay: 50 });
  
  // Find and click the search button
  const searchSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Search")',
    'button:has-text("Go")',
    '.search-btn',
    '#btnSearch'
  ];
  
  let searchBtn = null;
  for (const selector of searchSelectors) {
    try {
      searchBtn = await page.$(selector);
      if (searchBtn) break;
    } catch {}
  }
  
  if (searchBtn) {
    await searchBtn.click();
  } else {
    // Try pressing Enter
    await page.keyboard.press('Enter');
  }
  
  // Wait for results page to load
  console.log(`  Waiting for results...`);
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Make sure we're filtering for plans without minimum usage fees
  // The default should already be set based on your screenshot
  
  // Find and click the Excel export button (middle button in top-right)
  console.log(`  Looking for Excel export button...`);
  
  // The export button is typically an icon button near the top
  const exportSelectors = [
    'a[href*="excel"]',
    'a[href*="export"]',
    'button[title*="Excel"]',
    'button[title*="Export"]',
    '.export-excel',
    '.excel-export',
    // Based on your screenshot, it's the middle of 3 buttons near SORT BY
    'a[title*="Excel"]',
    'img[alt*="Excel"]',
    // Try finding by position - middle button of icon group
    '.icon-group button:nth-child(2)',
    '.toolbar button:nth-child(2)'
  ];
  
  let exportBtn = null;
  for (const selector of exportSelectors) {
    try {
      exportBtn = await page.$(selector);
      if (exportBtn) {
        console.log(`  Found export button with selector: ${selector}`);
        break;
      }
    } catch {}
  }
  
  // If we couldn't find by selector, try to find the button by its visual position
  if (!exportBtn) {
    // Look for buttons/links in the header area that might be the export
    const buttons = await page.$$('a, button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.getAttribute('title') || el.innerText || '', btn);
      if (text.toLowerCase().includes('excel') || text.toLowerCase().includes('export')) {
        exportBtn = btn;
        console.log(`  Found export button by title/text: ${text}`);
        break;
      }
    }
  }
  
  if (!exportBtn) {
    // As a last resort, try clicking by coordinates based on your screenshot
    // The button appears to be in the top-right area
    console.log(`  Trying to find export button by evaluating page...`);
    
    const clicked = await page.evaluate(() => {
      // Look for any element that might trigger Excel download
      const links = document.querySelectorAll('a');
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        const onclick = link.getAttribute('onclick') || '';
        if (href.includes('excel') || href.includes('xls') || 
            onclick.includes('excel') || onclick.includes('export')) {
          (link as HTMLElement).click();
          return true;
        }
      }
      
      // Try buttons
      const buttons = document.querySelectorAll('button, input[type="button"]');
      for (const btn of buttons) {
        const title = btn.getAttribute('title') || '';
        const onclick = btn.getAttribute('onclick') || '';
        if (title.includes('Excel') || onclick.includes('excel')) {
          (btn as HTMLElement).click();
          return true;
        }
      }
      
      return false;
    });
    
    if (!clicked) {
      console.log(`  ⚠️ Could not find Excel export button. Taking screenshot for debugging...`);
      await page.screenshot({ path: path.join(DOWNLOAD_DIR, `debug-${zipCode}.png`), fullPage: true });
      throw new Error('Excel export button not found');
    }
  } else {
    await exportBtn.click();
  }
  
  // Wait for download
  console.log(`  Waiting for Excel download...`);
  const downloadPath = await waitForDownload();
  
  if (!downloadPath) {
    throw new Error('Excel file did not download');
  }
  
  console.log(`  Downloaded: ${downloadPath}`);
  
  // Parse the Excel file
  const workbook = XLSX.readFile(downloadPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<PlanRow>(worksheet);
  
  console.log(`  Parsed ${data.length} plans`);
  
  // Clean up the download
  fs.unlinkSync(downloadPath);
  
  return data;
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
    // Return the per-month fee (actual fee depends on months remaining)
    return parseFloat(perMonthMatch[1]);
  }
  
  return null;
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
    
    const { data, error } = await supabase
      .from('providers')
      .upsert({
        name: providerName,
        slug,
        phone,
        description: `${providerName} - Texas electricity provider`,
      }, { onConflict: 'slug' })
      .select('id')
      .single();
    
    if (error) {
      console.error(`  ✗ Error: ${providerName}: ${error.message}`);
    } else if (data) {
      providerIdMap.set(providerName, data.id);
      console.log(`  ✓ ${providerName}`);
    }
  }
  
  return providerIdMap;
}

/**
 * Update plans in Supabase
 */
async function updatePlans(plans: PlanRow[], providerIdMap: Map<string, string>): Promise<void> {
  console.log('\n📋 Updating plans...');
  
  // Deactivate all existing plans
  const { error: deactivateError } = await supabase
    .from('plans')
    .update({ is_active: false })
    .eq('is_active', true);
  
  if (deactivateError) {
    console.error('  Error deactivating old plans:', deactivateError.message);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const plan of plans) {
    const providerId = providerIdMap.get(plan.RepCompany);
    if (!providerId) {
      console.log(`  ⚠️ No provider ID for: ${plan.RepCompany}`);
      continue;
    }
    
    // Determine TDSP slug from TduCompany name
    let tdspSlug = 'unknown';
    const tduLower = (plan.TduCompany || '').toLowerCase();
    if (tduLower.includes('centerpoint')) tdspSlug = 'centerpoint';
    else if (tduLower.includes('oncor')) tdspSlug = 'oncor';
    else if (tduLower.includes('aep') && tduLower.includes('central')) tdspSlug = 'aep-central';
    else if (tduLower.includes('aep') && tduLower.includes('north')) tdspSlug = 'aep-north';
    
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
          timeOfUse: plan['Time Of Use'],
          prepaid: plan.Prepaid,
          newCustomerOnly: plan['New Customer'],
          hasMinUsageFees: plan['Min Usage Fees/Credits'],
          complaintRating: plan.Rating,
          scrapedAt: new Date().toISOString()
        }
      });
    
    if (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`  ✗ ${plan['Plan Name']}: ${error.message}`);
      }
    } else {
      successCount++;
    }
  }
  
  console.log(`  ✓ Inserted ${successCount} plans`);
  if (errorCount > 0) {
    console.log(`  ✗ ${errorCount} errors`);
  }
}

/**
 * Update ZIP coverage in Supabase
 */
async function updateZipCoverage(plans: PlanRow[], providerIdMap: Map<string, string>): Promise<void> {
  console.log('\n📍 Updating ZIP coverage...');
  
  // This is simplified - in production you'd want a full ZIP code database
  // For now, we'll just record the ZIP codes we scraped
  
  // Get plan IDs from the database
  const { data: dbPlans } = await supabase
    .from('plans')
    .select('id, plan_name, provider_id, features')
    .eq('is_active', true);
  
  if (!dbPlans) return;
  
  let insertCount = 0;
  
  for (const dbPlan of dbPlans) {
    const features = dbPlan.features as any;
    const zipCode = features?.zipCode;
    const tdspName = features?.tdspName;
    
    if (!zipCode) continue;
    
    const { error } = await supabase
      .from('zip_coverage')
      .upsert({
        plan_id: dbPlan.id,
        zip_code: String(zipCode),
        utility_provider: tdspName,
      }, { 
        onConflict: 'plan_id,zip_code',
        ignoreDuplicates: true 
      });
    
    if (!error) insertCount++;
  }
  
  console.log(`  ✓ Updated ${insertCount} ZIP coverage records`);
}

/**
 * Main function
 */
async function main() {
  console.log('⚡ Power to Choose Excel Export Scraper\n');
  console.log('='.repeat(45) + '\n');
  
  // Setup
  ensureDownloadDir();
  clearDownloads();
  
  console.log('🌐 Launching browser...\n');
  
  const browser = await puppeteer.launch({
    headless: false,  // Set to true for production, false for debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const allPlans: PlanRow[] = [];
  
  try {
    const page = await browser.newPage();
    
    // Set up download behavior
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_DIR
    });
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Scrape each TDSP region
    for (const tdsp of TDSP_REGIONS) {
      console.log(`\n📍 Scraping ${tdsp.name} (ZIP: ${tdsp.zipCode})...\n`);
      
      try {
        clearDownloads();  // Clear before each download
        
        const plans = await exportPlansForZip(page, tdsp.zipCode);
        allPlans.push(...plans);
        
        console.log(`  ✓ Got ${plans.length} plans for ${tdsp.name}`);
        
        // Rate limiting between regions
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`  ✗ Error scraping ${tdsp.name}:`, error);
      }
    }
    
    console.log(`\n📊 Total plans scraped: ${allPlans.length}`);
    
    // Update database
    if (allPlans.length > 0) {
      const providerIdMap = await updateProviders(allPlans);
      await updatePlans(allPlans, providerIdMap);
      await updateZipCoverage(allPlans, providerIdMap);
    } else {
      console.log('\n⚠️ No plans found. Check debug screenshots in tmp/ptc-downloads/');
    }
    
  } finally {
    await browser.close();
  }
  
  // Cleanup
  if (fs.existsSync(DOWNLOAD_DIR)) {
    fs.rmSync(DOWNLOAD_DIR, { recursive: true });
  }
  
  console.log('\n✅ Scraping complete!');
}

// Run
main().catch(console.error);
