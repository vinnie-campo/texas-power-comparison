import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;

    if (!city) {
      return NextResponse.json(
        {
          error: 'City parameter is required',
          message: 'Please provide a city slug in the URL',
        },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Fetch city data
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', city)
      .single();

    if (cityError || !cityData) {
      return NextResponse.json(
        {
          error: 'City not found',
          message: `No data available for city: ${city}`,
        },
        { status: 404 }
      );
    }

    // Construct the response with clean, AI-parseable structure
    const response = {
      status: 'success',
      data: {
        city: {
          name: cityData.name,
          slug: cityData.slug,
          county: cityData.county,
          state: 'Texas',
          population: cityData.population,
        },
        rates: {
          currency: 'USD',
          unit: 'cents per kWh',
          tiers: [
            {
              usage_kwh: 500,
              average_rate: cityData.average_rate_500,
              typical_monthly_cost: (cityData.average_rate_500 * 500) / 100,
              description:
                'Low usage tier - typical for small apartments or efficient homes',
            },
            {
              usage_kwh: 1000,
              average_rate: cityData.average_rate_1000,
              typical_monthly_cost: (cityData.average_rate_1000 * 1000) / 100,
              description:
                'Medium usage tier - typical for average residential homes',
            },
            {
              usage_kwh: 2000,
              average_rate: cityData.average_rate_2000,
              typical_monthly_cost: (cityData.average_rate_2000 * 2000) / 100,
              description:
                'High usage tier - typical for large homes or high AC usage',
            },
          ],
          summary: `The average electricity rate in ${cityData.name}, Texas is ${cityData.average_rate_1000}¢ per kWh for typical residential usage of 1000 kWh per month.`,
        },
        market_info: {
          is_deregulated: true,
          description:
            'Residents can choose from multiple competing electricity providers',
          regulatory_body: 'Public Utility Commission of Texas (PUCT)',
          grid_operator: 'ERCOT',
        },
        metadata: {
          last_updated: cityData.updated_at || cityData.created_at,
          source: 'Texas Power Compare - Aggregated market data',
          methodology:
            'Rates represent average residential electricity prices across available plans from major providers',
          data_freshness: 'Updated regularly from retail electricity provider filings',
          notes: [
            'Rates include energy charges but exclude TDU delivery fees and taxes',
            'Actual rates vary by provider, plan type, and contract length',
            'Individual plans may offer rates higher or lower than these averages',
          ],
        },
        seo: {
          meta_title: cityData.meta_title,
          meta_description: cityData.meta_description,
        },
      },
      links: {
        compare_plans: `https://texaspowercompare.com/compare?zip=${cityData.slug}`,
        city_page: `https://texaspowercompare.com/cities/${cityData.slug}`,
        api_documentation: 'https://texaspowercompare.com/api/docs',
      },
    };

    // Set cache headers for AI crawlers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
        'X-Robots-Tag': 'index, follow',
      },
    });
  } catch (error) {
    console.error('Error in city rates API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while fetching city rate data',
      },
      { status: 500 }
    );
  }
}

// Optional: Add metadata for API documentation
export const metadata = {
  title: 'City Rates API',
  description: 'Get electricity rate data for Texas cities',
};
