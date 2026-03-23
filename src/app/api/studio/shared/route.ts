import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchActivePartnership,
  getPartnerId,
  addOutputComment,
} from '@/lib/partnerships/queries'
import { createAdminClient } from '@/lib/supabase/admin'

/** GET /api/studio/shared — fetch shared session outputs */
export async function GET() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const partnership = await fetchActivePartnership(user.id)
    if (!partnership || partnership.status !== 'active') {
      return NextResponse.json({ outputs: [], has_partner: false })
    }

    const partnerId = getPartnerId(partnership, user.id)
    if (!partnerId) {
      return NextResponse.json({ outputs: [], has_partner: false })
    }

    // Fetch outputs shared with this user (from partner)
    const adminClient = createAdminClient()
    const { data: sharedOutputs } = await adminClient
      .from('prompt_outputs')
      .select('*')
      .eq('shared_with', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch own outputs shared with partner
    const { data: mySharedOutputs } = await adminClient
      .from('prompt_outputs')
      .select('*')
      .eq('user_id', user.id)
      .eq('shared_with', partnerId)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      outputs: [...(sharedOutputs ?? []), ...(mySharedOutputs ?? [])],
      has_partner: true,
      partner_name: partnership.partner?.display_name || partnership.partner?.full_name || 'Your partner',
    })
  } catch (err) {
    console.error('Shared GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch shared sessions' }, { status: 500 })
  }
}

/** POST /api/studio/shared — add comment to shared output */
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { output_id, text } = body

    if (!output_id || !text?.trim()) {
      return NextResponse.json({ error: 'output_id and text required' }, { status: 400 })
    }

    // Get display name
    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('display_name, full_name')
      .eq('id', user.id)
      .single()

    const displayName =
      (profile as unknown as { display_name: string | null; full_name: string | null })?.display_name ??
      (profile as unknown as { full_name: string | null })?.full_name ??
      'You'

    await addOutputComment(output_id, {
      id: crypto.randomUUID(),
      user_id: user.id,
      display_name: displayName,
      text: text.trim(),
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Shared POST error:', err)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
