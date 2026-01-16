import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import StructuredData from '@/components/seo/StructuredData';
import { generalElectricityFAQs } from '@/lib/data/faq-data';
import HomepageClient from '@/components/home/HomepageClient';

export const metadata: Metadata = {
  title: 'Compare Texas Electricity Rates | Save Up to 40% on Your Bill',
  description:
    'Compare electricity rates from top Texas providers in seconds. Find the best energy plan for your home and save up to 40% on your monthly bill. Free, fast, and unbiased.',
  openGraph: {
    title: 'Compare Texas Electricity Rates | Save Up to 40% on Your Bill',
    description:
      'Compare electricity rates from top Texas providers in seconds. Find the best energy plan for your home and save up to 40% on your monthly bill.',
    type: 'website',
  },
};

export default async function Home() {
  const supabase = await createServerClient();

  // Fetch top cities by population
  const { data: cities } = await supabase
    .from('cities')
    .select('name, slug, average_rate_1000, population')
    .order('population', { ascending: false })
    .limit(12);

  // Fetch providers
  const { data: providers } = await supabase
    .from('providers')
    .select('id, name, slug, logo_url')
    .order('name');

  // Get counts for stats
  const { count: cityCount } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true });

  const { count: providerCount } = await supabase
    .from('providers')
    .select('*', { count: 'exact', head: true });

  const { count: planCount } = await supabase
    .from('plans')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Select top 6 FAQs for homepage
  const homepageFAQs = generalElectricityFAQs.slice(0, 6);

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData
        type="organization"
        organization={{
          name: 'Texas Power Compare',
          url: 'https://texaspowercompare.com',
          logo: 'https://texaspowercompare.com/logo.png',
          description:
            'Compare electricity rates from top Texas providers and find the best energy plan for your home.',
          contactPoint: {
            telephone: '',
            contactType: 'Customer Service',
          },
        }}
      />
      <StructuredData
        type="website"
        website={{
          name: 'Texas Power Compare',
          url: 'https://texaspowercompare.com',
          potentialAction: {
            target:
              'https://texaspowercompare.com/compare?zip={zip_code}',
            queryInput: 'required name=zip_code',
          },
        }}
      />

      <HomepageClient
        cities={cities}
        providers={providers}
        cityCount={cityCount}
        providerCount={providerCount}
        planCount={planCount}
        faqs={homepageFAQs}
      />
    </>
  );
}
