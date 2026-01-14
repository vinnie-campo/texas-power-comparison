import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, Star, Building2 } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import StructuredData from '@/components/seo/StructuredData';
import ProviderLogo from '@/components/ui/ProviderLogo';

export const metadata: Metadata = {
  title: 'Texas Electricity Providers | Compare All REPs',
  description:
    'Compare electricity providers in Texas. View plans, rates, and reviews from top retail electric providers (REPs) including TXU Energy, Reliant, Direct Energy, and more.',
};

export default async function ProvidersPage() {
  const supabase = await createServerClient();

  // Fetch all providers
  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .order('name');

  // Get plan counts for each provider
  const providersWithCounts = await Promise.all(
    (providers || []).map(async (provider) => {
      const { count } = await supabase
        .from('plans')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', provider.id)
        .eq('is_active', true);

      return {
        ...provider,
        planCount: count || 0,
      };
    })
  );

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: 'https://texaspowercompare.com/' },
          { name: 'Providers', url: 'https://texaspowercompare.com/providers' },
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
            <span className="text-gray-900 font-medium">Providers</span>
          </nav>

          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Texas Electricity Providers
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Compare plans and rates from licensed retail electric providers
              (REPs) serving Texas. All providers listed are regulated by the
              Public Utility Commission of Texas (PUCT).
            </p>
          </div>

          {/* Providers Grid */}
          <div className="max-w-6xl mx-auto mb-12">
            {providersWithCounts && providersWithCounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providersWithCounts.map((provider) => (
                  <Link
                    key={provider.id}
                    href={`/providers/${provider.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                  >
                    {/* Provider Logo */}
                    <div className="flex items-center justify-center mb-4">
                      <ProviderLogo
                        providerSlug={provider.slug}
                        providerName={provider.name}
                        size="lg"
                      />
                    </div>

                    {/* Provider Name */}
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
                      {provider.name}
                    </h2>

                    {/* Rating */}
                    {provider.rating && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(provider.rating!)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {provider.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {provider.description && (
                      <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                        {provider.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {provider.planCount}
                        </div>
                        <div className="text-xs text-gray-600">
                          {provider.planCount === 1 ? 'Plan' : 'Plans'}
                        </div>
                      </div>
                    </div>

                    {/* View Plans Button */}
                    <div className="mt-4">
                      <div className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center">
                        View Plans
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No providers found.</p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Understanding Texas Electricity Providers
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                In Texas's deregulated electricity market, retail electric
                providers (REPs) compete for your business. Unlike traditional
                utilities, REPs don't own power lines or infrastructure—they
                purchase electricity on the wholesale market and sell it to
                consumers with various plan options.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Each provider offers different rates, contract terms, renewable
                energy options, and customer service experiences. Because you can
                choose your provider, it's important to compare plans to find the
                best fit for your usage patterns and preferences.
              </p>
              <p className="text-gray-700 leading-relaxed">
                All providers listed here are licensed by the Public Utility
                Commission of Texas (PUCT) and must comply with state regulations
                designed to protect consumers. You can switch providers at any
                time, though early termination fees may apply if you're under
                contract.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Compare Rates?
            </h2>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Enter your ZIP code to see personalized rates from all available
              providers in your area.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Compare Plans by ZIP Code
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
