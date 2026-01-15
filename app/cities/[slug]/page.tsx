import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, MapPin, Users, TrendingDown } from 'lucide-react';
import { createServerClient, createStaticClient } from '@/lib/supabase';
import StructuredData from '@/components/seo/StructuredData';
import FAQSection from '@/components/content/FAQSection';
import KeyFacts from '@/components/content/KeyFacts';
import { generateCityFAQs } from '@/lib/data/faq-data';

// Type for city data
interface City {
  id: string;
  name: string;
  slug: string;
  county: string;
  population: number;
  average_rate_500: number;
  average_rate_1000: number;
  average_rate_2000: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string | null;
}

// Generate static params for all cities
export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: cities } = await supabase
    .from('cities')
    .select('slug')
    .order('population', { ascending: false })
    .limit(100); // Generate static pages for top 100 cities

  return cities?.map((city) => ({ slug: city.slug })) || [];
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!city) {
    return {
      title: 'City Not Found | Texas Power Compare',
      description: 'The requested city page could not be found.',
    };
  }

  return {
    title: city.meta_title,
    description: city.meta_description,
    openGraph: {
      title: city.meta_title,
      description: city.meta_description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: city.meta_title,
      description: city.meta_description,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerClient();

  // Fetch city data
  const { data: city, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !city) {
    notFound();
  }

  // Generate city-specific FAQs
  const cityFAQs = generateCityFAQs(
    city.name,
    city.county,
    city.average_rate_500,
    city.average_rate_1000,
    city.average_rate_2000
  );

  // Prepare key facts
  const keyFacts = [
    {
      label: `Average Rate in ${city.name}`,
      value: city.average_rate_1000.toFixed(1),
      unit: '¢/kWh',
      description: `For typical residential usage of 1000 kWh per month`,
    },
    {
      label: 'County',
      value: city.county,
      description: `${city.name} is located in ${city.county} County`,
    },
    {
      label: 'Population',
      value: city.population.toLocaleString(),
      description: `Estimated population as of 2024`,
    },
    {
      label: 'Low Usage Rate',
      value: city.average_rate_500.toFixed(1),
      unit: '¢/kWh',
      description: 'Average rate for 500 kWh monthly usage',
    },
    {
      label: 'High Usage Rate',
      value: city.average_rate_2000.toFixed(1),
      unit: '¢/kWh',
      description: 'Average rate for 2000 kWh monthly usage',
    },
    {
      label: 'Market Type',
      value: 'Deregulated',
      description: 'Residents can choose their electricity provider',
    },
  ];

  // Calculate estimated monthly costs
  const estimatedCost500 = (city.average_rate_500 * 500) / 100;
  const estimatedCost1000 = (city.average_rate_1000 * 1000) / 100;
  const estimatedCost2000 = (city.average_rate_2000 * 2000) / 100;

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData
        type="localBusiness"
        localBusiness={{
          name: `${city.name} Electricity Rates`,
          address: {
            addressLocality: city.name,
            addressRegion: 'TX',
            addressCountry: 'US',
          },
          priceRange: `$${estimatedCost500.toFixed(0)}-$${estimatedCost2000.toFixed(0)}`,
        }}
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: 'https://texaspowercompare.com/' },
          { name: 'Cities', url: 'https://texaspowercompare.com/cities' },
          {
            name: city.name,
            url: `https://texaspowercompare.com/cities/${city.slug}`,
          },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 text-sm mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/cities"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Cities
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{city.name}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {city.name} Electricity Rates
                </h1>
                <p className="text-lg text-gray-600">
                  Compare the best electricity plans in {city.name}, Texas
                </p>
              </div>
            </div>

            {/* Quick Answer Box */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Quick Answer
              </h2>
              <p className="text-blue-800 leading-relaxed">
                The average electricity rate in {city.name}, Texas is{' '}
                <strong>{(city.average_rate_1000 * 100).toFixed(1)}¢ per kWh</strong> for typical residential
                usage of 1000 kWh per month. This translates to an estimated
                monthly cost of approximately{' '}
                <strong>${estimatedCost1000.toFixed(2)}</strong> for energy charges.
                Residents of {city.name} can choose from multiple competing
                electricity providers to find the best rates and plans for their
                needs.
              </p>
            </div>
          </div>

          {/* Key Facts Section */}
          <div className="mb-8">
            <KeyFacts
              title={`${city.name} Electricity Statistics`}
              description={`Current electricity rate data for ${city.name}, ${city.county} County`}
              facts={keyFacts}
              lastUpdated={city.updated_at || city.created_at}
              source="Texas Power Compare Market Data"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Rate Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Understanding Your Rate Section */}
              <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Understanding Electricity Rates in {city.name}
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {city.name} is part of Texas's deregulated electricity
                    market, which means you have the power to choose your
                    electricity provider. This competition among providers helps
                    keep rates competitive and gives you options to find the best
                    plan for your usage patterns and preferences.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Electricity rates in {city.name} vary based on several
                    factors including your monthly usage, contract length, plan
                    type (fixed or variable), and seasonal demand. The rates shown
                    represent averages across available plans from major providers
                    serving the area.
                  </p>
                </div>
              </section>

              {/* Rate Tiers Section */}
              <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Electricity Rates by Usage Level
                </h2>
                <div className="space-y-4">
                  {/* 500 kWh Tier */}
                  <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Low Usage (500 kWh/month)
                      </h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {(city.average_rate_500 * 100).toFixed(1)}¢/kWh
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Typical for small apartments, efficient homes, or minimal
                      AC usage
                    </p>
                    <p className="text-gray-700 font-medium">
                      Estimated monthly cost:{' '}
                      <span className="text-green-600">
                        ${estimatedCost500.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  {/* 1000 kWh Tier */}
                  <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded">
                        MOST COMMON
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Average Usage (1000 kWh/month)
                      </h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {(city.average_rate_1000 * 100).toFixed(1)}¢/kWh
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Typical for average residential homes with moderate AC usage
                    </p>
                    <p className="text-gray-700 font-medium">
                      Estimated monthly cost:{' '}
                      <span className="text-green-600">
                        ${estimatedCost1000.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  {/* 2000 kWh Tier */}
                  <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        High Usage (2000 kWh/month)
                      </h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {(city.average_rate_2000 * 100).toFixed(1)}¢/kWh
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Typical for large homes, high AC usage, or electric heating
                    </p>
                    <p className="text-gray-700 font-medium">
                      Estimated monthly cost:{' '}
                      <span className="text-green-600">
                        ${estimatedCost2000.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* How to Choose Section */}
              <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How to Choose the Best Electricity Plan in {city.name}
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Know Your Usage
                      </h3>
                      <p className="text-gray-600">
                        Check your recent electricity bills to understand your
                        average monthly usage in kWh. This is the most important
                        factor in comparing plans accurately.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Compare at Your Usage Level
                      </h3>
                      <p className="text-gray-600">
                        Don't be fooled by advertised rates at usage levels you
                        won't reach. Always compare the rate and total cost at your
                        actual usage.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Consider Contract Length
                      </h3>
                      <p className="text-gray-600">
                        Longer contracts (24-36 months) can lock in rates but may
                        have early termination fees. Short-term contracts (6-12
                        months) offer more flexibility.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Review the Fine Print
                      </h3>
                      <p className="text-gray-600">
                        Read the Electricity Facts Label (EFL) for details on fees,
                        renewable energy content, and any usage requirements or
                        penalties.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - CTA & Info */}
            <div className="space-y-6">
              {/* Compare Plans CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white sticky top-6">
                <h3 className="text-xl font-bold mb-3">
                  Ready to Save on Electricity?
                </h3>
                <p className="mb-6 text-blue-50">
                  Compare personalized rates from providers serving {city.name}{' '}
                  and switch in minutes.
                </p>
                <Link
                  href={`/compare?zip=${city.slug}`}
                  className="block w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Compare Plans Now
                </Link>
                <p className="text-xs text-blue-100 mt-4 text-center">
                  Free comparison • No obligation • Takes 2 minutes
                </p>
              </div>

              {/* City Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  About {city.name}
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-600">Location</dt>
                    <dd className="text-gray-900 font-medium">
                      {city.county} County, Texas
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Population</dt>
                    <dd className="text-gray-900 font-medium">
                      {city.population.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Market</dt>
                    <dd className="text-gray-900 font-medium">
                      Deregulated (Choice)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Grid Operator</dt>
                    <dd className="text-gray-900 font-medium">ERCOT</dd>
                  </div>
                </dl>
              </div>

              {/* API Access Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Developer Access
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Access structured rate data via our API
                </p>
                <code className="block bg-gray-900 text-green-400 text-xs p-3 rounded overflow-x-auto">
                  GET /api/rates/{city.slug}
                </code>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <FAQSection
              title={`Frequently Asked Questions About ${city.name} Electricity`}
              description={`Get answers to common questions about electricity rates and providers in ${city.name}, Texas`}
              faqs={cityFAQs}
              includeSchema={true}
            />
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Start Saving on Your Electricity Bill Today
            </h2>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of {city.name} residents who have saved money by
              comparing electricity plans. It's free, fast, and easy.
            </p>
            <Link
              href={`/compare?zip=${city.slug}`}
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Compare {city.name} Electricity Rates
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
