/**
 * Database Seed Script
 * Populates the database with realistic sample data for Texas electricity providers
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to generate slug from name
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// ============================================================================
// PROVIDERS DATA
// ============================================================================
const providersData = [
  {
    name: 'TXU Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=TXU+Energy',
    description: 'One of the largest electricity providers in Texas, serving customers since 1882. Offering competitive rates and excellent customer service.',
    website: 'https://www.txu.com',
    phone: '1-800-818-6132',
    rating: 4.2,
  },
  {
    name: 'Reliant Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=Reliant',
    description: 'A trusted name in Texas electricity with innovative plans and renewable energy options.',
    website: 'https://www.reliant.com',
    phone: '1-866-222-7100',
    rating: 4.0,
  },
  {
    name: 'Direct Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=Direct+Energy',
    description: 'Providing straightforward electricity plans with no hidden fees and 24/7 customer support.',
    website: 'https://www.directenergy.com',
    phone: '1-844-258-8030',
    rating: 3.9,
  },
  {
    name: 'Gexa Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=Gexa+Energy',
    description: 'Texas-based provider offering affordable rates and 100% renewable energy options.',
    website: 'https://www.gexaenergy.com',
    phone: '1-866-961-9399',
    rating: 4.1,
  },
  {
    name: 'Green Mountain Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=Green+Mountain',
    description: 'Leading provider of renewable energy plans with a commitment to sustainability.',
    website: 'https://www.greenmountainenergy.com',
    phone: '1-888-693-4449',
    rating: 4.3,
  },
  {
    name: '4Change Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=4Change+Energy',
    description: 'Innovative electricity provider focused on giving back to the community.',
    website: 'https://www.4changeenergy.com',
    phone: '1-844-342-4264',
    rating: 4.0,
  },
  {
    name: 'Frontier Utilities',
    logo_url: 'https://via.placeholder.com/200x80?text=Frontier+Utilities',
    description: 'Texas-owned provider offering competitive rates and exceptional customer service.',
    website: 'https://www.frontierutilities.com',
    phone: '1-866-288-3837',
    rating: 3.8,
  },
  {
    name: 'Express Energy',
    logo_url: 'https://via.placeholder.com/200x80?text=Express+Energy',
    description: 'Simple, affordable electricity plans with no surprises or gimmicks.',
    website: 'https://www.expressenergy.com',
    phone: '1-888-397-7377',
    rating: 3.9,
  },
];

// ============================================================================
// PLANS DATA (3-4 plans per provider)
// ============================================================================
const plansTemplate = [
  {
    plan_name: 'Value Fixed 12',
    plan_type: 'Fixed' as const,
    contract_length_months: 12,
    renewable_percentage: 25,
    rate_500kwh: 13.5,
    rate_1000kwh: 11.2,
    rate_2000kwh: 10.1,
    base_charge: 9.95,
    early_termination_fee: 150,
    features: {
      billCredit: false,
      freeNights: false,
      freeWeekends: false,
      paperlessBilling: true,
    },
  },
  {
    plan_name: 'Power Plus 24',
    plan_type: 'Fixed' as const,
    contract_length_months: 24,
    renewable_percentage: 50,
    rate_500kwh: 12.8,
    rate_1000kwh: 10.5,
    rate_2000kwh: 9.3,
    base_charge: 9.95,
    early_termination_fee: 200,
    features: {
      billCredit: true,
      freeNights: false,
      freeWeekends: false,
      paperlessBilling: true,
    },
  },
  {
    plan_name: 'Green Choice 12',
    plan_type: 'Fixed' as const,
    contract_length_months: 12,
    renewable_percentage: 100,
    rate_500kwh: 14.9,
    rate_1000kwh: 12.1,
    rate_2000kwh: 10.8,
    base_charge: 9.95,
    early_termination_fee: 150,
    features: {
      billCredit: false,
      freeNights: false,
      freeWeekends: false,
      paperlessBilling: true,
      renewable100: true,
    },
  },
  {
    plan_name: 'Flexible Month-to-Month',
    plan_type: 'Variable' as const,
    contract_length_months: 0,
    renewable_percentage: 10,
    rate_500kwh: 15.9,
    rate_1000kwh: 13.5,
    rate_2000kwh: 12.2,
    base_charge: 9.95,
    early_termination_fee: 0,
    features: {
      billCredit: false,
      freeNights: false,
      freeWeekends: false,
      paperlessBilling: true,
      noContract: true,
    },
  },
  {
    plan_name: 'Super Saver 36',
    plan_type: 'Fixed' as const,
    contract_length_months: 36,
    renewable_percentage: 30,
    rate_500kwh: 11.9,
    rate_1000kwh: 9.8,
    rate_2000kwh: 8.5,
    base_charge: 9.95,
    early_termination_fee: 250,
    features: {
      billCredit: true,
      freeNights: false,
      freeWeekends: false,
      paperlessBilling: true,
      lowRate: true,
    },
  },
  {
    plan_name: 'Free Nights 12',
    plan_type: 'Fixed' as const,
    contract_length_months: 12,
    renewable_percentage: 15,
    rate_500kwh: 16.2,
    rate_1000kwh: 13.8,
    rate_2000kwh: 11.9,
    base_charge: 9.95,
    early_termination_fee: 150,
    features: {
      billCredit: false,
      freeNights: true,
      freeWeekends: false,
      paperlessBilling: true,
    },
  },
  {
    plan_name: 'Weekend Saver 24',
    plan_type: 'Fixed' as const,
    contract_length_months: 24,
    renewable_percentage: 40,
    rate_500kwh: 14.5,
    rate_1000kwh: 12.3,
    rate_2000kwh: 10.7,
    base_charge: 9.95,
    early_termination_fee: 200,
    features: {
      billCredit: false,
      freeNights: false,
      freeWeekends: true,
      paperlessBilling: true,
    },
  },
];

// ============================================================================
// ZIP CODES BY METRO AREA
// ============================================================================
const zipCodesByMetro = {
  Houston: ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010', '77025', '77030', '77042', '77056', '77057', '77019', '77098'],
  Dallas: ['75001', '75002', '75006', '75019', '75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75219', '75220', '75225'],
  Austin: ['78701', '78702', '78703', '78704', '78705', '78712', '78719', '78721', '78722', '78723', '78724', '78725', '78731', '78739', '78741', '78745'],
  'San Antonio': ['78201', '78202', '78203', '78204', '78205', '78207', '78208', '78209', '78210', '78211', '78212', '78213', '78214', '78215', '78216'],
  'Fort Worth': ['76101', '76102', '76103', '76104', '76105', '76106', '76107', '76108', '76109', '76110', '76111', '76112', '76116', '76120', '76123'],
};

// ============================================================================
// CITIES DATA
// ============================================================================
const citiesData = [
  {
    name: 'Houston',
    county: 'Harris',
    population: 2304580,
    average_rate_500: 13.8,
    average_rate_1000: 11.5,
    average_rate_2000: 10.2,
    meta_title: 'Compare Houston Electricity Rates | Best Energy Plans in Houston, TX',
    meta_description: 'Find the best electricity rates in Houston, TX. Compare plans from top providers and save on your energy bill.',
  },
  {
    name: 'Dallas',
    county: 'Dallas',
    population: 1304379,
    average_rate_500: 14.2,
    average_rate_1000: 11.8,
    average_rate_2000: 10.5,
    meta_title: 'Compare Dallas Electricity Rates | Best Energy Plans in Dallas, TX',
    meta_description: 'Compare electricity rates in Dallas, TX. Find affordable energy plans from trusted providers.',
  },
  {
    name: 'Austin',
    county: 'Travis',
    population: 961855,
    average_rate_500: 13.5,
    average_rate_1000: 11.2,
    average_rate_2000: 9.9,
    meta_title: 'Compare Austin Electricity Rates | Best Energy Plans in Austin, TX',
    meta_description: 'Find the best electricity rates in Austin, TX. Compare renewable and traditional energy plans.',
  },
  {
    name: 'San Antonio',
    county: 'Bexar',
    population: 1434625,
    average_rate_500: 13.9,
    average_rate_1000: 11.6,
    average_rate_2000: 10.3,
    meta_title: 'Compare San Antonio Electricity Rates | Best Energy Plans in San Antonio, TX',
    meta_description: 'Compare electricity providers in San Antonio, TX. Find the best energy rates for your home.',
  },
  {
    name: 'Fort Worth',
    county: 'Tarrant',
    population: 918915,
    average_rate_500: 14.1,
    average_rate_1000: 11.7,
    average_rate_2000: 10.4,
    meta_title: 'Compare Fort Worth Electricity Rates | Best Energy Plans in Fort Worth, TX',
    meta_description: 'Find affordable electricity rates in Fort Worth, TX. Compare plans and switch providers easily.',
  },
  {
    name: 'El Paso',
    county: 'El Paso',
    population: 678815,
    average_rate_500: 12.8,
    average_rate_1000: 10.5,
    average_rate_2000: 9.2,
    meta_title: 'Compare El Paso Electricity Rates | Best Energy Plans in El Paso, TX',
    meta_description: 'Compare electricity rates in El Paso, TX. Find the best energy plans for your budget.',
  },
  {
    name: 'Arlington',
    county: 'Tarrant',
    population: 394602,
    average_rate_500: 14.0,
    average_rate_1000: 11.6,
    average_rate_2000: 10.3,
    meta_title: 'Compare Arlington Electricity Rates | Best Energy Plans in Arlington, TX',
    meta_description: 'Find the best electricity rates in Arlington, TX. Compare providers and save on energy.',
  },
  {
    name: 'Plano',
    county: 'Collin',
    population: 285494,
    average_rate_500: 14.3,
    average_rate_1000: 11.9,
    average_rate_2000: 10.6,
    meta_title: 'Compare Plano Electricity Rates | Best Energy Plans in Plano, TX',
    meta_description: 'Compare electricity plans in Plano, TX. Find competitive rates from top providers.',
  },
  {
    name: 'Irving',
    county: 'Dallas',
    population: 239842,
    average_rate_500: 14.1,
    average_rate_1000: 11.7,
    average_rate_2000: 10.4,
    meta_title: 'Compare Irving Electricity Rates | Best Energy Plans in Irving, TX',
    meta_description: 'Find affordable electricity in Irving, TX. Compare energy plans and switch providers.',
  },
  {
    name: 'Frisco',
    county: 'Collin',
    population: 200509,
    average_rate_500: 14.4,
    average_rate_1000: 12.0,
    average_rate_2000: 10.7,
    meta_title: 'Compare Frisco Electricity Rates | Best Energy Plans in Frisco, TX',
    meta_description: 'Compare electricity rates in Frisco, TX. Find the best energy deals for your home.',
  },
  {
    name: 'McKinney',
    county: 'Collin',
    population: 195308,
    average_rate_500: 14.3,
    average_rate_1000: 11.9,
    average_rate_2000: 10.6,
    meta_title: 'Compare McKinney Electricity Rates | Best Energy Plans in McKinney, TX',
    meta_description: 'Find competitive electricity rates in McKinney, TX. Compare providers and save.',
  },
  {
    name: 'Grand Prairie',
    county: 'Dallas',
    population: 194543,
    average_rate_500: 14.2,
    average_rate_1000: 11.8,
    average_rate_2000: 10.5,
    meta_title: 'Compare Grand Prairie Electricity Rates | Best Energy Plans in Grand Prairie, TX',
    meta_description: 'Compare electricity plans in Grand Prairie, TX. Find the best rates for your home.',
  },
  {
    name: 'Sugar Land',
    county: 'Fort Bend',
    population: 111026,
    average_rate_500: 13.7,
    average_rate_1000: 11.4,
    average_rate_2000: 10.1,
    meta_title: 'Compare Sugar Land Electricity Rates | Best Energy Plans in Sugar Land, TX',
    meta_description: 'Find the best electricity rates in Sugar Land, TX. Compare energy providers.',
  },
  {
    name: 'The Woodlands',
    county: 'Montgomery',
    population: 114436,
    average_rate_500: 13.9,
    average_rate_1000: 11.6,
    average_rate_2000: 10.3,
    meta_title: 'Compare The Woodlands Electricity Rates | Best Energy Plans in The Woodlands, TX',
    meta_description: 'Compare electricity rates in The Woodlands, TX. Find affordable energy plans.',
  },
  {
    name: 'Pearland',
    county: 'Brazoria',
    population: 125817,
    average_rate_500: 13.8,
    average_rate_1000: 11.5,
    average_rate_2000: 10.2,
    meta_title: 'Compare Pearland Electricity Rates | Best Energy Plans in Pearland, TX',
    meta_description: 'Find competitive electricity rates in Pearland, TX. Compare providers and save.',
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedProviders() {
  console.log('🏢 Seeding providers...');

  const providersToInsert = providersData.map(provider => ({
    ...provider,
    slug: slugify(provider.name),
  }));

  const { data, error } = await supabase
    .from('providers')
    .insert(providersToInsert)
    .select();

  if (error) {
    console.error('Error seeding providers:', error);
    throw error;
  }

  console.log(`✅ Created ${data.length} providers`);
  return data;
}

async function seedPlans(providers: any[]) {
  console.log('📋 Seeding plans...');

  const plansToInsert = [];

  for (const provider of providers) {
    // Each provider gets 3-4 plans
    const numPlans = Math.floor(Math.random() * 2) + 3; // 3 or 4 plans

    for (let i = 0; i < numPlans; i++) {
      const template = plansTemplate[i % plansTemplate.length];

      // Add some variation to rates
      const rateVariation = (Math.random() * 2) - 1; // -1 to +1

      plansToInsert.push({
        provider_id: provider.id,
        plan_name: `${provider.name.split(' ')[0]} ${template.plan_name}`,
        plan_type: template.plan_type,
        contract_length_months: template.contract_length_months,
        renewable_percentage: template.renewable_percentage,
        rate_500kwh: Number((template.rate_500kwh + rateVariation).toFixed(2)),
        rate_1000kwh: Number((template.rate_1000kwh + rateVariation).toFixed(2)),
        rate_2000kwh: Number((template.rate_2000kwh + rateVariation).toFixed(2)),
        base_charge: template.base_charge,
        early_termination_fee: template.early_termination_fee,
        features: template.features,
        is_active: true,
      });
    }
  }

  const { data, error } = await supabase
    .from('plans')
    .insert(plansToInsert)
    .select();

  if (error) {
    console.error('Error seeding plans:', error);
    throw error;
  }

  console.log(`✅ Created ${data.length} plans`);
  return data;
}

async function seedZipCoverage(plans: any[]) {
  console.log('📍 Seeding ZIP code coverage...');

  const coverageToInsert = [];

  for (const [city, zipCodes] of Object.entries(zipCodesByMetro)) {
    // Each plan is available in 2-3 random metro areas
    for (const plan of plans) {
      // 60% chance this plan is available in this metro
      if (Math.random() > 0.4) {
        // Pick 8-12 random ZIP codes from this metro
        const numZips = Math.floor(Math.random() * 5) + 8;
        const selectedZips = zipCodes
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(numZips, zipCodes.length));

        for (const zipCode of selectedZips) {
          coverageToInsert.push({
            plan_id: plan.id,
            zip_code: zipCode,
            utility_provider: getUtilityProvider(city),
            city: city,
          });
        }
      }
    }
  }

  const { data, error } = await supabase
    .from('zip_coverage')
    .insert(coverageToInsert)
    .select();

  if (error) {
    console.error('Error seeding ZIP coverage:', error);
    throw error;
  }

  console.log(`✅ Created ${data.length} ZIP coverage records`);
  return data;
}

async function seedCities() {
  console.log('🏙️  Seeding cities...');

  const citiesToInsert = citiesData.map(city => ({
    ...city,
    slug: slugify(city.name),
  }));

  const { data, error } = await supabase
    .from('cities')
    .insert(citiesToInsert)
    .select();

  if (error) {
    console.error('Error seeding cities:', error);
    throw error;
  }

  console.log(`✅ Created ${data.length} cities`);
  return data;
}

// Helper to get utility provider by city
function getUtilityProvider(city: string): string {
  const utilityMap: { [key: string]: string } = {
    Houston: 'CenterPoint Energy',
    Dallas: 'Oncor',
    Austin: 'Austin Energy',
    'San Antonio': 'CPS Energy',
    'Fort Worth': 'Oncor',
  };
  return utilityMap[city] || 'Oncor';
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Seed in order due to foreign key constraints
    const providers = await seedProviders();
    const plans = await seedPlans(providers);
    await seedZipCoverage(plans);
    await seedCities();

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${providers.length} providers`);
    console.log(`   • ${plans.length} plans`);
    console.log(`   • ZIP coverage for 5 major metro areas`);
    console.log(`   • ${citiesData.length} cities`);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed script
main();
