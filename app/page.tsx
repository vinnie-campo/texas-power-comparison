import { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  BarChart,
  DollarSign,
  CheckCircle,
  Users,
  FileText,
  Award,
  TrendingDown,
  Shield,
  Clock,
  Zap,
} from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import ZipSearch from '@/components/search/ZipSearch';
import FAQSection from '@/components/content/FAQSection';
import StructuredData from '@/components/seo/StructuredData';
import { generalElectricityFAQs } from '@/lib/data/faq-data';
import ProviderLogo from '@/components/ui/ProviderLogo';

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
            telephone: '1-800-555-0123',
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

      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative bg-hero-gradient text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">
                  trusted by 50,000+ Texans
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                compare electricity rates{' '}
                <span className="text-[#00D4AA]">in seconds</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
                find the best electricity plan for your home.{' '}
                <strong className="text-white">
                  save up to 40% on your monthly bill.
                </strong>
              </p>

              {/* ZIP Search Component */}
              <div className="max-w-2xl mx-auto">
                <ZipSearch />
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00D4AA]" />
                  <span>100% free service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00D4AA]" />
                  <span>no hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00D4AA]" />
                  <span>takes 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS/TRUST SECTION */}
        <section className="py-16 bg-light-blue">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-pink mb-2">
                  {cityCount || 250}+
                </div>
                <div className="text-secondary-blue font-medium">cities covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-pink mb-2">
                  {providerCount || 8}
                </div>
                <div className="text-secondary-blue font-medium">top providers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-pink mb-2">
                  {planCount || 29}+
                </div>
                <div className="text-secondary-blue font-medium">plans available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent-teal mb-2">
                  $300+
                </div>
                <div className="text-secondary-blue font-medium">
                  avg. annual savings
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-blue mb-4">
                how it works
              </h2>
              <p className="text-lg text-secondary-blue/70 max-w-2xl mx-auto">
                finding the best electricity rate is simple with our free
                comparison tool
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="relative">
                <div className="card-bulb p-10 text-center">
                  <div className="w-20 h-20 bg-[#E8F4FD] rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-[#E5007D]" />
                  </div>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary-pink rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-blue mb-3">
                    enter your ZIP code
                  </h3>
                  <p className="text-secondary-blue/70">
                    tell us where you live to see plans available in your area
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="card-bulb p-10 text-center">
                  <div className="w-20 h-20 bg-[#E8F4FD] rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart className="w-10 h-10 text-[#E5007D]" />
                  </div>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary-pink rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-blue mb-3">
                    compare personalized plans
                  </h3>
                  <p className="text-secondary-blue/70">
                    see side-by-side comparisons based on your actual usage
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="card-bulb p-10 text-center">
                  <div className="w-20 h-20 bg-[#E8F4FD] rounded-full flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-10 h-10 text-[#00D4AA]" />
                  </div>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-accent-teal rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-blue mb-3">
                    switch & save
                  </h3>
                  <p className="text-secondary-blue/70">
                    enroll online in minutes and start saving on your next bill
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link
                href="/compare"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-lg transition-colors shadow-lg"
              >
                Start Comparing Rates Now
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Texas Power Compare
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We make it easy to find the right electricity plan for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Personalized Recommendations
                </h3>
                <p className="text-gray-600 text-sm">
                  Our calculator estimates your actual usage based on your home
                  profile for accurate comparisons
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Unbiased Comparisons
                </h3>
                <p className="text-gray-600 text-sm">
                  We show all available plans sorted by best value, not who pays
                  us the most
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Hidden Fees
                </h3>
                <p className="text-gray-600 text-sm">
                  See the real price including all charges and fees before you
                  switch
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  100% Free Service
                </h3>
                <p className="text-gray-600 text-sm">
                  Our comparison tool is always free for consumers with no
                  obligation to switch
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROVIDERS SECTION */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Compare Plans from Top Texas Providers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We partner with the most trusted electricity providers in Texas
              </p>
            </div>

            {providers && providers.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                  {providers.map((provider) => (
                    <Link
                      key={provider.id}
                      href={`/providers/${provider.slug}`}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
                    >
                      <ProviderLogo
                        providerSlug={provider.slug}
                        providerName={provider.name}
                        size="md"
                        className="mb-3"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {provider.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="text-center">
                  <Link
                    href="/providers"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2"
                  >
                    View All Providers
                    <span className="text-xl">→</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600">
                Loading providers...
              </div>
            )}
          </div>
        </section>

        {/* POPULAR CITIES SECTION */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find Rates in Your City
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Compare electricity plans in over 250 Texas cities
              </p>
            </div>

            {cities && cities.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/cities/${city.slug}`}
                      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {city.name}
                        </h3>
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-600">From</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {city.average_rate_1000.toFixed(1)}¢
                        </span>
                        <span className="text-sm text-gray-600">/kWh</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center">
                  <Link
                    href="/cities"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    View All 250+ Cities
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600">Loading cities...</div>
            )}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <FAQSection
              title="Frequently Asked Questions"
              description="Get answers to common questions about comparing and switching electricity providers in Texas"
              faqs={homepageFAQs}
              includeSchema={true}
            />
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Save on Electricity?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Compare rates from top Texas providers and find your perfect plan
              </p>

              {/* ZIP Search */}
              <div className="max-w-2xl mx-auto mb-6">
                <ZipSearch />
              </div>

              {/* Urgency Text */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Takes less than 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  <span>Save up to $300+ per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>100% Free & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
