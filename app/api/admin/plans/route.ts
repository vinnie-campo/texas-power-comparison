import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * GET /api/admin/plans
 * Fetch all plans with provider information
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: plans, error } = await supabase
      .from('plans')
      .select(`
        *,
        provider:providers(name, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch plans', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error in GET /api/admin/plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/plans
 * Create a new plan
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createServerClient();

    // Validate required fields
    if (!body.provider_id || !body.plan_name) {
      return NextResponse.json(
        { error: 'Provider and plan name are required' },
        { status: 400 }
      );
    }

    if (!body.rate_500kwh || !body.rate_1000kwh || !body.rate_2000kwh) {
      return NextResponse.json(
        { error: 'All rate tiers are required' },
        { status: 400 }
      );
    }

    // Prepare plan data
    const planData = {
      provider_id: body.provider_id,
      plan_name: body.plan_name,
      plan_type: body.plan_type || 'Fixed',
      contract_length_months: body.contract_length_months || 0,
      rate_500kwh: parseFloat(body.rate_500kwh),
      rate_1000kwh: parseFloat(body.rate_1000kwh),
      rate_2000kwh: parseFloat(body.rate_2000kwh),
      base_charge: parseFloat(body.base_charge || 0),
      early_termination_fee: body.early_termination_fee ? parseFloat(body.early_termination_fee) : null,
      renewable_percentage: parseInt(body.renewable_percentage || 0),
      features: body.features || [],
      efl_url: body.efl_url || null,
      tos_url: body.tos_url || null,
      yrac_url: body.yrac_url || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
    };

    const { data: plan, error } = await supabase
      .from('plans')
      .insert(planData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create plan', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
