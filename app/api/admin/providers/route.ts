import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * GET /api/admin/providers
 * Fetch all providers for admin dropdown
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: providers, error } = await supabase
      .from('providers')
      .select('id, name, slug')
      .order('name');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch providers', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error in GET /api/admin/providers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
