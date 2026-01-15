import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get('zip')
  
  // Use fetch to call Supabase REST API directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ plans: [] })
  }
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/plans?select=id,plan_name,rate_1000kwh,contract_length_months,renewable_percentage,plan_type,affiliate_url,is_featured,provider:providers(name,slug)&is_active=eq.true&order=is_featured.desc,rate_1000kwh.asc&limit=3`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    )
    
    const plans = await response.json()
    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Error fetching featured plans:', error)
    return NextResponse.json({ plans: [] })
  }
}
