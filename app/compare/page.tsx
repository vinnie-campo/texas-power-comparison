import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, Loader2 } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import { PlanWithProvider } from '@/types/database';
import ComparePageClient from '@/components/compare/ComparePageClient';
import ZipSearch from '@/components/search/ZipSearch';
import UsageQuizWrapper from '@/components/compare/UsageQuizWrapper';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Compare Electricity Rates in Texas | Find Best Energy Plans',
  description:
    'Compare electricity rates from top providers in Texas. Find the best energy plans for your home and save on your monthly bill.',
};

// TypeScript interfaces
interface SearchParams {
  zip?: string;
  usage?: string;
  calculated?: string;
  breakdown?: string;
}

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

async function fetchPlansForZip(zipCode: string): Promise<PlanWithProvider[]> {
  try {
    const supabase = await createServerClient();

    // Query plans with provider information, filtered by ZIP code
    const { data, error } = await supabase
      .from('zip_coverage')
      .select(
        `
        plan_id,
        plans!inner(
          id,
          provider_id,
          plan_name,
          plan_type,
          contract_length_months,
          renewable_percentage,
          rate_500kwh,
          rate_1000kwh,
          rate_2000kwh,
          base_charge,
          early_termination_fee,
          features,
          is_active,
          created_at,
          updated_at,
          providers!inner(
            id,
            name,
            slug,
            logo_url,
            description,
            website,
            phone,
            rating,
            created_at
          )
        )
      `
      )
      .eq('zip_code', zipCode)
      .eq('plans.is_active', true);

    if (error) {
      console.error('Error fetching plans:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the nested data structure into PlanWithProvider format
    const plans: PlanWithProvider[] = data.map((item: any) => ({
      ...item.plans,
      provider: item.plans.providers,
      created_at: new Date(item.plans.created_at),
      updated_at: new Date(item.plans.updated_at),
    }));

    // Remove duplicate plans (a plan might be in multiple ZIP codes)
    const uniquePlans = plans.filter(
      (plan, index, self) => index === self.findIndex((p) => p.id === plan.id)
    );

    return uniquePlans;
  } catch (error) {
    console.error('Error in fetchPlansForZip:', error);
    return [];
  }
}

// Helper to parse breakdown from URL parameter
function parseBreakdown(breakdownParam?: string): UsageBreakdown | null {
  if (!breakdownParam) return null;

  try {
    const decoded = decodeURIComponent(breakdownParam);
    const parsed = JSON.parse(decoded);

    // Validate structure
    if (
      typeof parsed.base === 'number' &&
      typeof parsed.bedrooms === 'number' &&
      typeof parsed.sqft === 'number' &&
      typeof parsed.ev === 'number' &&
      typeof parsed.solar === 'number' &&
      typeof parsed.climate === 'number' &&
      typeof parsed.total === 'number'
    ) {
      return parsed as UsageBreakdown;
    }

    return null;
  } catch (error) {
    console.error('Error parsing breakdown:', error);
    return null;
  }
}

// Helper to normalize usage to nearest standard tier
function normalizeUsage(usage: number): 500 | 1000 | 2000 {
  if (usage <= 750) return 500;
  if (usage <= 1500) return 1000;
  return 2000;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const zipCode = params.zip;
  const isCalculated = params.calculated === 'true';
  const usageParam = params.usage ? parseInt(params.usage) : null;
  const breakdown = parseBreakdown(params.breakdown);

  // If no ZIP code provided, show search interface
  if (!zipCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">
              Compare Electricity Rates
            </span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Compare Electricity Rates
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Enter your ZIP code to find the best electricity plans in your area
            </p>
          </div>

          {/* Search Component */}
          <div className="max-w-2xl mx-auto">
            <ZipSearch />
          </div>
        </div>
      </div>
    );
  }

  // Validate ZIP code format
  if (!/^\d{5}$/.test(zipCode)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Invalid ZIP Code
            </h2>
            <p className="text-red-600 mb-4">
              Please enter a valid 5-digit ZIP code.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If ZIP exists but not calculated, show the quiz
  if (!isCalculated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/compare"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Compare
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">
              Calculate Usage
            </span>
          </nav>

          {/* Quiz Component */}
          <UsageQuizWrapper zipCode={zipCode} />
        </div>
      </div>
    );
  }

  // If calculated is true, fetch plans and show results
  const plans = await fetchPlansForZip(zipCode);

  // Determine the usage value
  const calculatedUsage = usageParam || 1000;
  const normalizedUsage = normalizeUsage(calculatedUsage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">
            Compare Electricity Rates
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {breakdown ? 'Your Personalized Plan Recommendations' : 'Compare Electricity Rates'}
          </h1>
          <p className="text-gray-600">
            {breakdown
              ? 'Based on your home profile and usage estimate'
              : 'Find the best electricity plan for your home'}
          </p>
        </div>

        {/* Results */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading plans...</span>
            </div>
          }
        >
          {plans.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                No Plans Available
              </h2>
              <p className="text-yellow-700 mb-4">
                We couldn't find any electricity plans for ZIP code{' '}
                <span className="font-mono font-semibold">{zipCode}</span>.
              </p>
              <p className="text-sm text-yellow-600 mb-4">
                This could mean the area is not currently served by our partner
                providers or the ZIP code is outside of Texas's deregulated
                electricity market.
              </p>
              <Link
                href="/compare"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Try Another ZIP Code
              </Link>
            </div>
          ) : (
            <ComparePageClient
              plans={plans}
              zipCode={zipCode}
              initialUsage={calculatedUsage}
              breakdown={breakdown || undefined}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
