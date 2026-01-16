import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 })
  }
  
  try {
    const { plan_id, provider_id, zip_code } = await request.json()
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('conversions')
      .insert({
        plan_id,
        provider_id,
        zip_code,
        status: 'clicked',
        commission_amount: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error logging click:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, conversion_id: data.id })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
