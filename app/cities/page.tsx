import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, MapPin, Search } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Texas Cities Electricity Rates | Compare by City',
  description:
    'Compare electricity rates in Texas cities. Find the best electricity plans and providers for Houston, Dallas, Austin, San Antonio, and 200+ other Texas cities.',
};

export default async function CitiesPage() {
  const supabase = await createServerClient();

  // Fetch all cities ordered by population
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('population', { ascending: false });

  if (!cities) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Unable to load cities data.</p>
      </div>
    );
  }

  // Group cities by population size
  const majorCities = cities.filter((city) => city.population >= 100000);
  const mediumCities = cities.filter(
    (city) => city.population >= 25000 && city.population < 100000
  );
  const smallCities = cities.filter((city) => city.population < 25000);

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: 'https://texaspowercompare.com/' },
          { name: 'Cities', url: 'https://texaspowercompare.com/cities' },
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
            <span className="text-gray-900 font-medium">Cities</span>
          </nav>

          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Electricity Rates by Texas City
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Compare electricity rates and find the best energy plans in over 200
              Texas cities. Click on any city to see detailed rate information,
              available providers, and personalized plan recommendations.
            </p>

            {/* Search prompt */}
            <div className="max-w-xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Search className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 text-left">
                Looking for a specific city? Use your browser's search (Ctrl+F or
                Cmd+F) to quickly find it on this page.
              </p>
            </div>
          </div>

          {/* Major Cities Section */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Major Cities
              </h2>
              <p className="text-gray-600">
                Population over 100,000 ({majorCities.length} cities)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {majorCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-600">{city.county} County</p>
                    </div>
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-gray-600">Avg. Rate:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {city.average_rate_1000.toFixed(1)}¢
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-gray-500">Population:</span>
                      <span className="text-sm font-medium text-gray-700">
                        {(city.population / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Medium Cities Section */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Medium-Sized Cities
              </h2>
              <p className="text-gray-600">
                Population 25,000 - 100,000 ({mediumCities.length} cities)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediumCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {city.name}
                      </h3>
                      <p className="text-xs text-gray-600">{city.county} County</p>
                    </div>
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-600">Avg. Rate:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {city.average_rate_1000.toFixed(1)}¢
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Small Cities Section */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Smaller Cities & Towns
              </h2>
              <p className="text-gray-600">
                Population under 25,000 ({smallCities.length} cities)
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {smallCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-200 hover:border-blue-300 text-center"
                >
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {city.name}
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    {city.average_rate_1000.toFixed(1)}¢
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Can't Find Your City?
            </h2>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Enter your ZIP code to compare electricity rates and plans available
              in your area.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Compare by ZIP Code
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
