import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchActivePartnership, getPartnerId } from '@/lib/partnerships/queries'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/partnerships/presence — check if partner is online
 * Polling fallback for Realtime presence.
 * Writes a heartbeat to a simple KV approach using profiles metadata.
 */
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
      return NextResponse.json({ partner_online: false, partner: null })
    }

    const partnerId = getPartnerId(partnership, user.id)
    if (!partnerId) {
      return NextResponse.json({ partner_online: false, partner: null })
    }

    // Record own heartbeat
    const adminClient = createAdminClient()
    await adminClient
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id)

    // Check partner's last heartbeat (within 30 seconds = online)
    const { data: partnerProfile } = await adminClient
      .from('profiles')
      .select('id, full_name, display_name, avatar_url, updated_at')
      .eq('id', partnerId)
      .single()

    if (!partnerProfile) {
      return NextResponse.json({ partner_online: false, partner: null })
    }

    const profile = partnerProfile as unknown as {
      id: string
      full_name: string | null
      display_name: string | null
      avatar_url: string | null
      updated_at: string
    }

    const lastSeen = new Date(profile.updated_at).getTime()
    const isOnline = Date.now() - lastSeen < 30000 // 30 seconds

    return NextResponse.json({
      partner_online: isOnline,
      partner: {
        id: profile.id,
        display_name: profile.display_name || profile.full_name || 'Your partner',
        avatar_url: profile.avatar_url,
        last_seen: profile.updated_at,
      },
      partnership_id: partnership.id,
    })
  } catch (err) {
    console.error('Presence GET error:', err)
    return NextResponse.json({ error: 'Failed to check presence' }, { status: 500 })
  }
}
