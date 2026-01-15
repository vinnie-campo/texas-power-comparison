import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get('zip')
  
  // Get featured plans or top 3 cheapest if none featured
  let query = supabase
    .from('plans')
    .select(`
      id,
      plan_name,
      rate_1000kwh,
      contract_length_months,
      renewable_percentage,
      plan_type,
      affiliate_url,
      is_featured,
      provider:providers(name, slug)
    `)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rate_1000kwh', { ascending: true })
    .limit(3)
  
  const { data: plans, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ plans })
}
