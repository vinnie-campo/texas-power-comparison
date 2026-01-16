import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ plans: [] })
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data: plans, error } = await supabase
      .from('plans')
      .select(`
        id,
        plan_name,
        rate_1000kwh,
        contract_length_months,
        provider:providers(name, slug)
      `)
      .eq('is_active', true)
      .eq('plan_type', 'Prepaid')
      .order('rate_1000kwh', { ascending: true })
      .limit(6)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ plans: [] })
    }
    
    return NextResponse.json({ plans: plans || [] })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ plans: [] })
  }
}
