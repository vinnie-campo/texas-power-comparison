import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { PlanWithProvider } from '@/types/database';

// Type for API response
interface PlansSuccessResponse {
  plans: PlanWithProvider[];
  count: number;
}

interface PlansErrorResponse {
  error: string;
}

// Type for valid usage values
type UsageValue = '500' | '1000' | '2000';

/**
 * GET /api/plans
 * Fetches electricity plans for a given ZIP code
 *
 * Query Parameters:
 * - zipCode: 5-digit ZIP code (required)
 * - usage: Usage tier - 500, 1000, or 2000 kWh (optional, defaults to 1000)
 *
 * Returns:
 * - 200: { plans: PlanWithProvider[], count: number }
 * - 400: { error: string } - Invalid parameters
 * - 500: { error: string } - Server error
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zipCode');
    const usage = searchParams.get('usage') || '1000';

    // Validate ZIP code
    if (!zipCode) {
      return NextResponse.json(
        { error: 'ZIP code is required' } as PlansErrorResponse,
        { status: 400 }
      );
    }

    // Validate ZIP code format (5 digits)
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipCode)) {
      return NextResponse.json(
        { error: 'ZIP code must be exactly 5 digits' } as PlansErrorResponse,
        { status: 400 }
      );
    }

    // Validate usage parameter
    const validUsages: UsageValue[] = ['500', '1000', '2000'];
    if (!validUsages.includes(usage as UsageValue)) {
      return NextResponse.json(
        { error: 'Usage must be 500, 1000, or 2000' } as PlansErrorResponse,
        { status: 400 }
      );
    }

    // Determine which rate field to order by
    const rateField = usage === '500'
      ? 'rate_500kwh'
      : usage === '2000'
      ? 'rate_2000kwh'
      : 'rate_1000kwh';

    // Create Supabase server client
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
      .eq('plans.is_active', true)
      .order(`plans.${rateField}`, { ascending: true });

    // Handle database errors
    if (error) {
      console.error('Database error fetching plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch plans from database' } as PlansErrorResponse,
        { status: 500 }
      );
    }

    // If no data returned
    if (!data || data.length === 0) {
      return NextResponse.json(
        { plans: [], count: 0 } as PlansSuccessResponse,
        { status: 200 }
      );
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

    // Sort by the appropriate rate field
    uniquePlans.sort((a, b) => {
      const rateA = usage === '500'
        ? a.rate_500kwh
        : usage === '2000'
        ? a.rate_2000kwh
        : a.rate_1000kwh;

      const rateB = usage === '500'
        ? b.rate_500kwh
        : usage === '2000'
        ? b.rate_2000kwh
        : b.rate_1000kwh;

      return rateA - rateB;
    });

    // Return success response
    return NextResponse.json(
      {
        plans: uniquePlans,
        count: uniquePlans.length,
      } as PlansSuccessResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error in /api/plans:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' } as PlansErrorResponse,
      { status: 500 }
    );
  }
}
