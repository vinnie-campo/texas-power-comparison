import puppeteer from 'puppeteer';
import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TDSP_REGIONS = [
  { name: 'CenterPoint Energy', slug: 'centerpoint', zipCode: '77007' },
  { name: 'Oncor Electric Delivery', slug: 'oncor', zipCode: '75201' },
  { name: 'AEP Texas Central', slug: 'aep-central', zipCode: '78401' },
  { name: 'AEP Texas North', slug: 'aep-north', zipCode: '76903' },
];

const DOWNLOAD_DIR = path.join(process.cwd(), 'tmp', 'ptc-downloads');

interface PlanRow {
  ZipCode: number; TduCompany: string; RepCompany: string; 'Plan Name': string;
  'Price/kWh 500': number; 'Price/kWh 1000': number; 'Price/kWh 2000': number;
  'Rate Type': string; 'Term Value': number; Prepaid: boolean; 'Pricing Details': string;
  'Renewable Perc': number; 'Enroll Phone': string; 'Fact Sheet': string;
  'Terms of Service': string; YRAC: string; 'Ordering Info': string; Rating: number;
}

function ensureDownloadDir() {
  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function clearDownloads() {
  if (fs.existsSync(DOWNLOAD_DIR)) {
    fs.readdirSync(DOWNLOAD_DIR).forEach(f => fs.unlinkSync(path.join(DOWNLOAD_DIR, f)));
  }
}

async function waitForDownload(timeout = 60000): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const files = fs.readdirSync(DOWNLOAD_DIR).filter(f => f.endsWith('.xlsx') && !f.includes('.crdownload'));
    if (files.length > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return path.join(DOWNLOAD_DIR, files[0]);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  return null;
}

async function exportPlansForZip(page: any, zipCode: string): Promise<PlanRow[]> {
  console.log('  Going to powertochoose.org...');
  await page.goto('https://www.powertochoose.org/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  // Type ZIP code
  console.log('  Entering ZIP:', zipCode);
  await page.type('input[type="text"]', zipCode, { delay: 100 });
  await new Promise(r => setTimeout(r, 1000));

  // Click VIEW RESULTS
  console.log('  Clicking VIEW RESULTS...');
  await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    for (const link of links) {
      if (link.innerText?.toUpperCase().includes('VIEW RESULTS')) {
        link.click();
        return;
      }
    }
  });

  // Wait for results page
  console.log('  Waiting for results...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 5000));

  // Click the Excel export button using the exact selector we found
  console.log('  Clicking Excel export (a.export-excel)...');
  await page.click('a.export-excel');

  // Wait for download
  console.log('  Waiting for download...');
  const filePath = await waitForDownload();
  if (!filePath) throw new Error('Download failed');

  console.log('  Parsing Excel...');
  const wb = XLSX.readFile(filePath);
  const data = XLSX.utils.sheet_to_json<PlanRow>(wb.Sheets[wb.SheetNames[0]]);
  fs.unlinkSync(filePath);
  return data;
}

function parseCancellationFee(s: string | null): number | null {
  if (!s) return null;
  const m = s.match(/\$(\d+)/);
  return m ? parseFloat(m[1]) : null;
}

function getTdspSlug(tdu: string): string {
  const t = (tdu || '').toLowerCase();
  if (t.includes('centerpoint')) return 'centerpoint';
  if (t.includes('oncor')) return 'oncor';
  if (t.includes('aep') && t.includes('central')) return 'aep-central';
  if (t.includes('aep') && t.includes('north')) return 'aep-north';
  return 'unknown';
}

async function updateProviders(plans: PlanRow[]): Promise<Map<string, string>> {
  console.log('\nUpdating providers...');
  const map = new Map<string, string>();
  const unique = [...new Set(plans.map(p => p.RepCompany))];
  for (const name of unique) {
    if (!name) continue;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const phone = plans.find(p => p.RepCompany === name)?.['Enroll Phone'] || null;
    const { data, error } = await supabase.from('providers')
      .upsert({ name, slug, phone, description: name + ' - Texas electricity provider' }, { onConflict: 'slug' })
      .select('id').single();
    if (data) { map.set(name, data.id); console.log('  ✓', name); }
    else if (error) console.log('  ✗', name, error.message);
  }
  return map;
}

async function updatePlans(plans: PlanRow[], providerMap: Map<string, string>): Promise<void> {
  console.log('\nInserting plans...');
  let ok = 0, fail = 0;
  for (const p of plans) {
    const pid = providerMap.get(p.RepCompany);
    if (!pid) continue;
    let planType = 'Fixed';
    if (p['Rate Type']?.toLowerCase() === 'variable') planType = 'Variable';
    if (p.Prepaid === true) planType = 'Prepaid';
    const { error } = await supabase.from('plans').insert({
      provider_id: pid, plan_name: p['Plan Name'], plan_type: planType,
      contract_length_months: p['Term Value'] || 1, renewable_percentage: p['Renewable Perc'] || 0,
      rate_500kwh: p['Price/kWh 500'], rate_1000kwh: p['Price/kWh 1000'], rate_2000kwh: p['Price/kWh 2000'],
      early_termination_fee: parseCancellationFee(p['Pricing Details']), is_active: true,
      features: { source: 'powertochoose', tdspRegion: getTdspSlug(p.TduCompany), 
        eflUrl: p['Fact Sheet'], tosUrl: p['Terms of Service'], yracUrl: p.YRAC,
        orderUrl: p['Ordering Info'], enrollPhone: p['Enroll Phone'], scrapedAt: new Date().toISOString() }
    });
    if (error) fail++; else ok++;
  }
  console.log('  ✓ Inserted', ok, 'plans');
  if (fail) console.log('  ✗', fail, 'errors');
}

async function main() {
  console.log('⚡ Power to Choose Scraper\n');
  ensureDownloadDir();
  clearDownloads();

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const allPlans: PlanRow[] = [];

  try {
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR });

    for (const tdsp of TDSP_REGIONS) {
      console.log('\n📍 ' + tdsp.name + ' (' + tdsp.zipCode + ')');
      try {
        clearDownloads();
        const plans = await exportPlansForZip(page, tdsp.zipCode);
        allPlans.push(...plans);
        console.log('  ✅', plans.length, 'plans');
      } catch (e) {
        console.log('  ❌ Error:', e);
      }
      await new Promise(r => setTimeout(r, 3000));
    }

    console.log('\nTotal plans:', allPlans.length);

    if (allPlans.length > 0) {
      await supabase.from('plans').update({ is_active: false }).eq('is_active', true);
      const providerMap = await updateProviders(allPlans);
      await updatePlans(allPlans, providerMap);
    }
  } finally {
    await browser.close();
  }

  if (fs.existsSync(DOWNLOAD_DIR)) fs.rmSync(DOWNLOAD_DIR, { recursive: true });
  console.log('\n✅ Done!');
}

main().catch(console.error);
