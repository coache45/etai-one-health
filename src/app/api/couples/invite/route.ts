import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if already in a couple
  const { data: existing } = await supabase
    .from('couples')
    .select('id')
    .or(`partner_a_id.eq.${user.id},partner_b_id.eq.${user.id}`)
    .eq('status', 'active')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already connected to a partner' }, { status: 409 })
  }

  const token = randomBytes(32).toString('hex')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { data: couple, error } = await supabase
    .from('couples')
    .insert({
      partner_a_id: user.id,
      invited_by: user.id,
      status: 'pending',
      invite_token: token,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const inviteUrl = `${appUrl}/couples/accept?token=${token}`
  return NextResponse.json({ inviteUrl, coupleId: couple.id })
}
