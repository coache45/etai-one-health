import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: couple } = await supabase
    .from('couples')
    .select('id')
    .or(`partner_a_id.eq.${user.id},partner_b_id.eq.${user.id}`)
    .eq('status', 'active')
    .single()

  if (!couple) {
    return NextResponse.json({ error: 'No active couple' }, { status: 404 })
  }

  await supabase
    .from('couples')
    .update({ status: 'disconnected', disconnected_at: new Date().toISOString() })
    .eq('id', couple.id)

  return NextResponse.json({ success: true })
}
