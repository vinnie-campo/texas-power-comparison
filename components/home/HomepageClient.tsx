'use client'

import Link from 'next/link'
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
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import ZipSearch from '@/components/search/ZipSearch'
import FAQSection from '@/components/content/FAQSection'
import ProviderLogo from '@/components/ui/ProviderLogo'

interface City {
  name: string
  slug: string
  average_rate_1000: number
  population: number
}

interface Provider {
  id: string
  name: string
  slug: string
  logo_url: string | null
}

interface FAQ {
  question: string
  answer: string
}

interface HomepageClientProps {
  cities: City[] | null
  providers: Provider[] | null
  cityCount: number | null
  providerCount: number | null
  planCount: number | null
  faqs: FAQ[]
}

export default function HomepageClient({
  cities,
  providers,
  cityCount,
  providerCount,
  planCount,
  faqs,
}: HomepageClientProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative bg-hero-gradient text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {t('heroTitle').split('in Seconds').map((part, i) =>
                i === 0 ? <span key={i}>{part}<br /></span> : <span key={i} className="text-[#00943C]">in Seconds</span>
              )}
            </h1>

            {/* Subheadline */}
            <div className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              <p className="mb-1">{t('heroSubtitle').split('.')[0]}.</p>
              <p className="font-bold">{t('heroSubtitle').split('.')[1]}.</p>
            </div>

            {/* ZIP Search Component - Inline Variant */}
            <div className="mb-8">
              <ZipSearch variant="inline" />
            </div>

            {/* Quick Stats - Inline */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00943C]" />
                <span>{t('free')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00943C]" />
                <span>{t('noHiddenFees')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00943C]" />
                <span>{t('takes2Min')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#00943C]" />
                <span>{t('trustedBy')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS/TRUST SECTION */}
      <section className="py-10 bg-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#003366] mb-1">
                {cityCount || 250}+
              </div>
              <div className="text-sm text-[#003366] font-medium">{t('citiesCovered')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#003366] mb-1">
                {providerCount || 8}
              </div>
              <div className="text-sm text-[#003366] font-medium">{t('topProviders')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#003366] mb-1">
                {planCount || 29}+
              </div>
              <div className="text-sm text-[#003366] font-medium">{t('plansAvailable')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#00943C] mb-1">
                $300+
              </div>
              <div className="text-sm text-[#003366] font-medium">
                {t('avgAnnualSavings')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
              {t('howItWorks')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="card-bulb p-10 text-center">
                <div className="w-20 h-20 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-[#003366]" />
                </div>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">
                  {t('step1Title')}
                </h3>
                <p className="text-gray-600">
                  {t('step1Desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card-bulb p-10 text-center">
                <div className="w-20 h-20 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart className="w-10 h-10 text-[#003366]" />
                </div>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">
                  {t('step2Title')}
                </h3>
                <p className="text-gray-600">
                  {t('step2Desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="card-bulb p-10 text-center">
                <div className="w-20 h-20 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-10 h-10 text-[#00943C]" />
                </div>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#00943C] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">
                  {t('step3Title')}
                </h3>
                <p className="text-gray-600">
                  {t('step3Desc')}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              href="/compare"
              className="inline-block bg-[#00943C] hover:bg-[#007830] text-white font-bold text-lg py-4 px-10 rounded-lg transition-all shadow-lg"
            >
              {t('startComparingNow')}
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('whyChooseUsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('personalizedRecs')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('personalizedRecsDesc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('unbiasedComparisons')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('unbiasedComparisonsDesc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('noHiddenFeesTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('noHiddenFeesDesc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('freeService')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('freeServiceDesc')}
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
              {t('compareFromTopProviders')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('compareFromTopProvidersDesc')}
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
                  {t('viewAllProviders')}
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">
              {t('loadingProviders')}
            </div>
          )}
        </div>
      </section>

      {/* POPULAR CITIES SECTION */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('findRatesInCity')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('findRatesInCityDesc')}
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
                      <span className="text-sm text-gray-600">{t('from')}</span>
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
                  {t('viewAllCities')}
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">{t('loadingCities')}</div>
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <FAQSection
            title={t('faqTitle')}
            description={t('faqDesc')}
            faqs={faqs}
            includeSchema={true}
          />
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 md:py-24 bg-hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Zap className="w-16 h-16 text-[#00943C] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t('readyToSave')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('readyToSaveDesc')}
            </p>

            {/* ZIP Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <ZipSearch />
            </div>

            {/* Urgency Text */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t('lessThan2Min')}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span>{t('saveUpTo')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>{t('freeAndSecure')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
