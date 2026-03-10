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

  const { token } = await request.json()

  const { data: couple, error } = await supabase
    .from('couples')
    .select('*')
    .eq('invite_token', token)
    .eq('status', 'pending')
    .single()

  if (error || !couple) {
    return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 })
  }

  if (couple.partner_a_id === user.id) {
    return NextResponse.json({ error: 'Cannot accept your own invite' }, { status: 400 })
  }

  const { data: updated, error: updateError } = await supabase
    .from('couples')
    .update({
      partner_b_id: user.id,
      status: 'active',
      connected_at: new Date().toISOString(),
      invite_token: null,
    })
    .eq('id', couple.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, couple: updated })
}
