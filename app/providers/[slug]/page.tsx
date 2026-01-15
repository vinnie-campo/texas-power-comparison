import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Home,
  Star,
  Phone,
  Globe,
  FileText,
  TrendingUp,
  Calendar,
  Leaf,
  ExternalLink,
} from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import { createServerClient, createStaticClient } from '@/lib/supabase';
import { PlanWithProvider } from '@/types/database';
import StructuredData from '@/components/seo/StructuredData';
import FAQSection, { FAQItem } from '@/components/content/FAQSection';

// Generate static params for all providers
export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: providers } = await supabase
    .from('providers')
    .select('slug')
    .order('name');

  return providers?.map((provider) => ({ slug: provider.slug })) || [];
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: provider } = await supabase
    .from('providers')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!provider) {
    return {
      title: 'Provider Not Found | Texas Power Compare',
      description: 'The requested electricity provider could not be found.',
    };
  }

  return {
    title: `${provider.name} Electricity Plans & Rates | Texas Power Compare`,
    description:
      provider.description ||
      `Compare electricity plans and rates from ${provider.name}. Find the best energy plan for your Texas home with detailed pricing and contract options.`,
    openGraph: {
      title: `${provider.name} Electricity Plans & Rates`,
      description:
        provider.description ||
        `Compare ${provider.name} electricity plans and rates in Texas.`,
      type: 'website',
    },
  };
}

// Generate provider-specific FAQs
function generateProviderFAQs(
  providerName: string,
  hasRenewable: boolean,
  planCount: number
): FAQItem[] {
  return [
    {
      question: `Is ${providerName} a good electricity company?`,
      answer: `${providerName} is one of the established electricity providers serving the Texas deregulated market. They offer ${planCount} different plans with various contract lengths and rate options. Customer satisfaction varies based on individual needs, but ${providerName} is a licensed retail electric provider (REP) regulated by the Public Utility Commission of Texas (PUCT). We recommend comparing their plans against other providers to find the best rate and terms for your specific usage and preferences.`,
    },
    {
      question: `What areas does ${providerName} serve?`,
      answer: `${providerName} serves residential and business customers across the deregulated Texas electricity market, which includes major metropolitan areas like Houston, Dallas-Fort Worth, Austin (outside city limits), Corpus Christi, and surrounding regions. Service availability depends on your specific ZIP code and utility service area. Use our comparison tool to check if ${providerName} offers plans in your location and see all available options.`,
    },
    {
      question: `Does ${providerName} offer renewable energy plans?`,
      answer: hasRenewable
        ? `Yes, ${providerName} offers electricity plans with renewable energy options. Some plans feature a percentage of renewable energy from sources like wind and solar, while others may offer 100% renewable energy through renewable energy credits (RECs). Check the specific plan details for renewable energy content, as it varies by plan. You can filter for renewable plans when comparing ${providerName}'s offerings on our site.`
        : `${providerName} offers various electricity plans in Texas. While renewable energy availability may vary by plan, we recommend reviewing each plan's Electricity Facts Label (EFL) for specific renewable energy percentages. Many Texas providers are increasing their renewable energy offerings due to the state's abundant wind and solar resources. Check our comparison tool to see all ${providerName} plans and their renewable energy content.`,
    },
    {
      question: `What is ${providerName}'s cancellation fee?`,
      answer: `Cancellation fees, also called early termination fees (ETF), vary by plan and contract length with ${providerName}. Fixed-rate plans typically have early termination fees ranging from $150-$300 if you cancel before the contract end date. Variable-rate or month-to-month plans usually have no cancellation fee. The specific ETF amount is listed in each plan's Electricity Facts Label (EFL) and Terms of Service. Most providers waive the cancellation fee if you are moving out of the service area.`,
    },
    {
      question: `How do I sign up for ${providerName}?`,
      answer: `Signing up for ${providerName} is quick and easy. First, compare their plans on our site to find the best rate for your usage level. Click through to view the plan details and Electricity Facts Label (EFL). When ready, you can enroll directly through ${providerName}'s website or by phone. You'll need your service address, desired start date, and payment information. The switch typically takes 1-2 billing cycles, and your electricity service continues uninterrupted during the transition.`,
    },
  ];
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerClient();

  // Fetch provider data
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .single();

  if (providerError || !provider) {
    notFound();
  }

  // Fetch all plans for this provider
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('*')
    .eq('provider_id', provider.id)
    .eq('is_active', true)
    .order('rate_1000kwh', { ascending: true });

  const providerPlans = (plans || []) as PlanWithProvider[];

  // Calculate statistics
  const planCount = providerPlans.length;
  const rates = providerPlans.map((p) => p.rate_1000kwh);
  const lowestRate = rates.length > 0 ? Math.min(...rates) : 0;
  const highestRate = rates.length > 0 ? Math.max(...rates) : 0;

  const contractLengths = [
    ...new Set(providerPlans.map((p) => p.contract_length_months)),
  ].sort((a, b) => a - b);

  const hasRenewable = providerPlans.some((p) => p.renewable_percentage > 0);
  const maxRenewable = Math.max(
    ...providerPlans.map((p) => p.renewable_percentage),
    0
  );

  // Fetch other providers for sidebar
  const { data: otherProviders } = await supabase
    .from('providers')
    .select('id, name, slug')
    .neq('id', provider.id)
    .order('name')
    .limit(6);

  // Generate FAQs
  const providerFAQs = generateProviderFAQs(
    provider.name,
    hasRenewable,
    planCount
  );

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="organization"
        organization={{
          name: provider.name,
          url: provider.website || `https://texaspowercompare.com/providers/${provider.slug}`,
          description: provider.description || `${provider.name} electricity provider`,
          contactPoint: provider.phone
            ? {
                telephone: provider.phone,
                contactType: 'Customer Service',
              }
            : undefined,
        }}
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: 'https://texaspowercompare.com/' },
          { name: 'Providers', url: 'https://texaspowercompare.com/providers' },
          {
            name: provider.name,
            url: `https://texaspowercompare.com/providers/${provider.slug}`,
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
              href="/providers"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Providers
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{provider.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Section */}
              <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="flex items-start gap-6 mb-6">
                  {/* Provider Logo */}
                  <div className="flex-shrink-0">
                    <ProviderLogo
                      providerSlug={provider.slug}
                      providerName={provider.name}
                      size="xl"
                    />
                  </div>

                  {/* Provider Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      {provider.name}
                    </h1>

                    {/* Rating */}
                    {provider.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(provider.rating!)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 font-medium">
                          {provider.rating.toFixed(1)} out of 5
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {provider.description && (
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {provider.description}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4">
                      {provider.phone && (
                        <a
                          href={`tel:${provider.phone}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          {provider.phone}
                        </a>
                      )}
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/compare"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Compare {provider.name} Plans
                </Link>
              </section>

              {/* Key Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-5 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {planCount}
                  </div>
                  <div className="text-sm text-gray-600">Plans Available</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {(lowestRate * 100).toFixed(1)}¢
                  </div>
                  <div className="text-sm text-gray-600">Lowest Rate</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {contractLengths.length}
                  </div>
                  <div className="text-sm text-gray-600">Contract Options</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {maxRenewable}%
                  </div>
                  <div className="text-sm text-gray-600">Max Renewable</div>
                </div>
              </div>

              {/* Plans Table/Grid */}
              <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Available Plans from {provider.name}
                </h2>

                {providerPlans.length > 0 ? (
                  <div className="space-y-4">
                    {providerPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Plan Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {plan.plan_name}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {plan.contract_length_months === 0
                                  ? 'Month-to-Month'
                                  : `${plan.contract_length_months} months`}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {plan.plan_type}
                              </span>
                              {plan.renewable_percentage > 0 && (
                                <span className="flex items-center gap-1">
                                  <Leaf className="w-4 h-4 text-green-600" />
                                  {plan.renewable_percentage}% Renewable
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rate & CTA */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">
                                Rate at 1000 kWh
                              </div>
                              <div className="text-3xl font-bold text-blue-600">
                                {(plan.rate_1000kwh * 100).toFixed(1)}¢
                              </div>
                            </div>
                            <Link
                              href={`/compare?plan=${plan.id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors whitespace-nowrap"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      No active plans currently available from {provider.name}.
                    </p>
                    <Link
                      href="/compare"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Compare Other Providers →
                    </Link>
                  </div>
                )}
              </section>

              {/* About Section */}
              <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {provider.name}
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {provider.description ||
                      `${provider.name} is a licensed retail electricity provider (REP) serving customers across the deregulated Texas electricity market. As part of Texas's competitive energy marketplace, ${provider.name} offers residential and business customers a variety of electricity plans designed to meet different needs and preferences.`}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The company provides electricity plans with various contract
                    lengths, rate structures, and renewable energy options.
                    Customers can choose from fixed-rate plans that lock in pricing
                    for the contract duration, variable-rate plans that fluctuate
                    with market conditions, or other specialized plan types.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {provider.name} serves customers in major Texas metropolitan
                    areas including Houston, Dallas-Fort Worth, and other regions
                    within the ERCOT service territory. Like all Texas REPs, they
                    are regulated by the Public Utility Commission of Texas (PUCT)
                    and must adhere to state consumer protection standards.
                  </p>
                </div>
              </section>

              {/* FAQ Section */}
              <FAQSection
                title={`Frequently Asked Questions About ${provider.name}`}
                description={`Common questions about ${provider.name} electricity plans and service`}
                faqs={providerFAQs}
                includeSchema={true}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Compare CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white sticky top-6">
                <h3 className="text-xl font-bold mb-3">
                  Compare {provider.name} Rates
                </h3>
                <p className="text-blue-100 mb-4 text-sm">
                  See personalized rates based on your ZIP code and usage
                </p>
                <Link
                  href="/compare"
                  className="block w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Compare Plans Now
                </Link>
              </div>

              {/* Other Providers */}
              {otherProviders && otherProviders.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Other Providers
                  </h3>
                  <ul className="space-y-3">
                    {otherProviders.map((otherProvider) => (
                      <li key={otherProvider.id}>
                        <Link
                          href={`/providers/${otherProvider.slug}`}
                          className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                          <span className="font-medium">
                            {otherProvider.name}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/providers"
                    className="block mt-4 pt-4 border-t border-gray-200 text-blue-600 hover:text-blue-700 font-semibold text-sm text-center"
                  >
                    View All Providers →
                  </Link>
                </div>
              )}

              {/* Stats Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  Rate Range
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Lowest:</span>
                    <span className="text-lg font-bold text-blue-900">
                      {(lowestRate * 100).toFixed(1)}¢/kWh
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Highest:</span>
                    <span className="text-lg font-bold text-blue-900">
                      {(highestRate * 100).toFixed(1)}¢/kWh
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  Rates shown at 1000 kWh usage
                </p>
              </div>

              {/* Contract Options */}
              {contractLengths.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Contract Lengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contractLengths.map((length) => (
                      <span
                        key={length}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {length === 0 ? 'Month-to-Month' : `${length} months`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
