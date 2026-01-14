import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * GET /api/admin/plans/[id]
 * Fetch a single plan by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    const { data: plan, error } = await supabase
      .from('plans')
      .select(`
        *,
        provider:providers(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Plan not found', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error in GET /api/admin/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/plans/[id]
 * Update a plan
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createServerClient();

    // Prepare update data
    const updateData: any = {};

    if (body.provider_id) updateData.provider_id = body.provider_id;
    if (body.plan_name) updateData.plan_name = body.plan_name;
    if (body.plan_type) updateData.plan_type = body.plan_type;
    if (body.contract_length_months !== undefined) {
      updateData.contract_length_months = parseInt(body.contract_length_months);
    }
    if (body.rate_500kwh) updateData.rate_500kwh = parseFloat(body.rate_500kwh);
    if (body.rate_1000kwh) updateData.rate_1000kwh = parseFloat(body.rate_1000kwh);
    if (body.rate_2000kwh) updateData.rate_2000kwh = parseFloat(body.rate_2000kwh);
    if (body.base_charge !== undefined) updateData.base_charge = parseFloat(body.base_charge);
    if (body.early_termination_fee !== undefined) {
      updateData.early_termination_fee = body.early_termination_fee ? parseFloat(body.early_termination_fee) : null;
    }
    if (body.renewable_percentage !== undefined) {
      updateData.renewable_percentage = parseInt(body.renewable_percentage);
    }
    if (body.features !== undefined) updateData.features = body.features;
    if (body.efl_url !== undefined) updateData.efl_url = body.efl_url || null;
    if (body.tos_url !== undefined) updateData.tos_url = body.tos_url || null;
    if (body.yrac_url !== undefined) updateData.yrac_url = body.yrac_url || null;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    updateData.updated_at = new Date().toISOString();

    const { data: plan, error } = await supabase
      .from('plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update plan', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error in PUT /api/admin/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/plans/[id]
 * Delete a plan
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete plan', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
