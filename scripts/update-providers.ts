/**
 * Update Texas electricity providers with real company data
 *
 * Run with: npm run update:providers
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to generate logo URL
function generateLogoUrl(initials: string, bgColor: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor.replace('#', '')}&color=fff&size=128&bold=true`;
}

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Real Texas electricity provider data
const providers = [
  {
    name: 'TXU Energy',
    slug: 'txu-energy',
    website: 'https://www.txu.com',
    phone: '1-800-818-6132',
    description: "One of Texas' largest and oldest electricity providers, serving over 2 million customers",
    logo_url: generateLogoUrl('TXU', '0066CC'),
    rating: 4.2,
  },
  {
    name: 'Reliant Energy',
    slug: 'reliant-energy',
    website: 'https://www.reliant.com',
    phone: '1-866-222-7100',
    description: 'A leading Texas electricity provider owned by NRG Energy, known for innovative plans',
    logo_url: generateLogoUrl('RE', 'FF6B35'),
    rating: 4.1,
  },
  {
    name: 'Direct Energy',
    slug: 'direct-energy',
    website: 'https://www.directenergy.com',
    phone: '1-888-305-3828',
    description: 'Offers electricity, natural gas, and home services to millions of customers',
    logo_url: generateLogoUrl('DE', '00A651'),
    rating: 4.0,
  },
  {
    name: 'Gexa Energy',
    slug: 'gexa-energy',
    website: 'https://www.gexaenergy.com',
    phone: '1-866-961-9399',
    description: 'Specializes in renewable energy plans, owned by NextEra Energy',
    logo_url: generateLogoUrl('GE', '7C3AED'),
    rating: 4.3,
  },
  {
    name: 'Green Mountain Energy',
    slug: 'green-mountain-energy',
    website: 'https://www.greenmountain.com',
    phone: '1-866-785-4668',
    description: "America's longest-serving renewable energy retailer, 100% clean energy",
    logo_url: generateLogoUrl('GM', '10B981'),
    rating: 4.4,
  },
  {
    name: '4Change Energy',
    slug: '4change-energy',
    website: 'https://www.4changeenergy.com',
    phone: '1-888-250-2215',
    description: 'Affordable electricity with 4% of profits donated to Texas charities',
    logo_url: generateLogoUrl('4C', 'F59E0B'),
    rating: 4.2,
  },
  {
    name: 'Frontier Utilities',
    slug: 'frontier-utilities',
    website: 'https://www.frontierutilities.com',
    phone: '1-888-687-4659',
    description: 'Value-focused provider owned by NextEra Energy',
    logo_url: generateLogoUrl('FU', '3B82F6'),
    rating: 4.0,
  },
  {
    name: 'Constellation',
    slug: 'constellation',
    website: 'https://www.constellation.com',
    phone: '1-844-805-3589',
    description: "Nation's leading competitive energy company with carbon-free commitment",
    logo_url: generateLogoUrl('CO', '1E40AF'),
    rating: 4.1,
  },
  {
    name: 'Discount Power',
    slug: 'discount-power',
    website: 'https://www.discountpowertx.com',
    phone: '1-888-545-7075',
    description: 'Straightforward, affordable energy solutions owned by NRG',
    logo_url: generateLogoUrl('DP', 'DC2626'),
    rating: 3.9,
  },
  {
    name: 'Chariot Energy',
    slug: 'chariot-energy',
    website: 'https://www.chariotenergy.com',
    phone: '1-855-292-3303',
    description: '100% Texas solar energy plans with solar buyback options',
    logo_url: generateLogoUrl('CE', 'F97316'),
    rating: 4.5,
  },
  {
    name: 'Champion Energy',
    slug: 'champion-energy',
    website: 'https://www.championenergyservices.com',
    phone: '1-877-653-5090',
    description: 'Multi-year JD Power Award winner for customer satisfaction',
    logo_url: generateLogoUrl('CH', '059669'),
    rating: 4.3,
  },
  {
    name: 'Cirro Energy',
    slug: 'cirro-energy',
    website: 'https://www.cirroenergy.com',
    phone: '1-800-692-4776',
    description: 'Dallas-based provider known for simple, reliable fixed-rate plans',
    logo_url: generateLogoUrl('CI', '0891B2'),
    rating: 4.0,
  },
  {
    name: 'Rhythm Energy',
    slug: 'rhythm-energy',
    website: 'https://www.gotrhythm.com',
    phone: '1-888-408-2836',
    description: '100% renewable energy from Texas wind farms, no hidden fees',
    logo_url: generateLogoUrl('RH', '8B5CF6'),
    rating: 4.4,
  },
  {
    name: 'TriEagle Energy',
    slug: 'trieagle-energy',
    website: 'https://www.trieagleenergy.com',
    phone: '1-877-933-2453',
    description: '20+ years serving Texas with value-focused electricity plans',
    logo_url: generateLogoUrl('TE', 'B91C1C'),
    rating: 4.1,
  },
  {
    name: 'Payless Power',
    slug: 'payless-power',
    website: 'https://www.paylesspower.com',
    phone: '1-888-963-9363',
    description: 'Leading prepaid, no-deposit electricity provider in Texas',
    logo_url: generateLogoUrl('PP', '15803D'),
    rating: 3.8,
  },
  {
    name: 'APG&E',
    slug: 'apge',
    website: 'https://www.apge.com',
    phone: '1-844-707-2743',
    description: 'Competitive rates and straightforward plans since 2004',
    logo_url: generateLogoUrl('APG', '4338CA'),
    rating: 4.0,
  },
  {
    name: 'Amigo Energy',
    slug: 'amigo-energy',
    website: 'https://www.amigoenergy.com',
    phone: '1-866-993-4445',
    description: 'Affordable prices with bilingual customer service',
    logo_url: generateLogoUrl('AM', 'EA580C'),
    rating: 4.2,
  },
  {
    name: 'Pulse Power',
    slug: 'pulse-power',
    website: 'https://www.pulsepower.com',
    phone: '1-855-979-1095',
    description: 'Simple electricity plans with competitive pricing',
    logo_url: generateLogoUrl('PU', '0E7490'),
    rating: 3.9,
  },
  {
    name: 'Veteran Energy',
    slug: 'veteran-energy',
    website: 'https://www.veteranenergy.us',
    phone: '1-855-423-5431',
    description: 'Veteran-owned company supporting military families',
    logo_url: generateLogoUrl('VE', '991B1B'),
    rating: 4.3,
  },
  {
    name: 'GoodCharlie',
    slug: 'goodcharlie',
    website: 'https://www.goodcharlie.com',
    phone: '1-888-962-1238',
    description: 'Electricity plans with perks for dog owners and pet rescue support',
    logo_url: generateLogoUrl('GC', 'A855F7'),
    rating: 4.2,
  },
  {
    name: 'Express Energy',
    slug: 'express-energy',
    website: 'https://www.expressenergy.com',
    phone: '1-888-338-5230',
    description: 'Low-cost electricity with simple, transparent pricing',
    logo_url: generateLogoUrl('EE', 'EF4444'),
    rating: 4.0,
  },
  {
    name: 'Texpo Energy',
    slug: 'texpo-energy',
    website: 'https://www.texpoenergy.com',
    phone: '1-888-839-7686',
    description: 'Competitive rates with online account management tools',
    logo_url: generateLogoUrl('TX', '0369A1'),
    rating: 3.9,
  },
  {
    name: 'Pennywise Power',
    slug: 'pennywise-power',
    website: 'https://www.pennywisepower.com',
    phone: '1-866-963-9353',
    description: 'Budget-friendly electricity plans with no surprises',
    logo_url: generateLogoUrl('PW', '65A30D'),
    rating: 3.8,
  },
  {
    name: 'Tomorrow Energy',
    slug: 'tomorrow-energy',
    website: 'https://www.tomorrow.energy',
    phone: '1-888-636-4858',
    description: '100% renewable energy plans supporting clean power',
    logo_url: generateLogoUrl('TM', '16A34A'),
    rating: 4.4,
  },
];

async function updateProviders() {
  console.log('🔄 Starting provider data update...\n');

  try {
    // Delete existing providers
    console.log('🗑️  Deleting existing providers...');
    const { error: deleteError } = await supabase
      .from('providers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error deleting providers:', deleteError);
      throw deleteError;
    }

    console.log('✅ Deleted existing providers\n');

    // Insert new providers
    console.log('📝 Inserting 25 real Texas electricity providers...');
    const { data: insertedProviders, error: insertError } = await supabase
      .from('providers')
      .insert(providers)
      .select();

    if (insertError) {
      console.error('Error inserting providers:', insertError);
      throw insertError;
    }

    console.log(`✅ Successfully inserted ${insertedProviders?.length || 0} providers\n`);

    // Display inserted providers
    console.log('📋 Inserted Providers:');
    console.log('━'.repeat(80));
    insertedProviders?.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.name}`);
      console.log(`   Slug: ${provider.slug}`);
      console.log(`   Website: ${provider.website}`);
      console.log(`   Phone: ${provider.phone}`);
      console.log(`   Rating: ${provider.rating}/5.0`);
      console.log('');
    });

    console.log('━'.repeat(80));
    console.log('✨ Provider update completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Update existing plans to reference new provider IDs');
    console.log('   2. Add real electricity plans for each provider');
    console.log('   3. Test the provider pages and comparison tool\n');

  } catch (error) {
    console.error('❌ Error updating providers:', error);
    process.exit(1);
  }
}

// Run the update
updateProviders();
