import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateSyncScore } from '@/lib/health/sync-score'
import type { DailyHealthLog } from '@/types/health'
import type { SharingPreferences } from '@/types/couples'

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
    .select('*')
    .or(`partner_a_id.eq.${user.id},partner_b_id.eq.${user.id}`)
    .eq('status', 'active')
    .single()

  if (!couple) {
    return NextResponse.json({ error: 'No active couple' }, { status: 404 })
  }

  const today = new Date().toISOString().split('T')[0]

  const [logA, logB] = await Promise.all([
    supabase.from('daily_health_logs').select('*').eq('user_id', couple.partner_a_id).eq('log_date', today).single(),
    supabase.from('daily_health_logs').select('*').eq('user_id', couple.partner_b_id).eq('log_date', today).single(),
  ])

  if (!logA.data || !logB.data) {
    return NextResponse.json({ error: 'Both partners need to log today' }, { status: 400 })
  }

  const syncScore = calculateSyncScore(
    logA.data as DailyHealthLog,
    logB.data as DailyHealthLog,
    {
      a: couple.partner_a_shares as SharingPreferences,
      b: couple.partner_b_shares as SharingPreferences,
    }
  )

  await supabase
    .from('couples')
    .update({ sync_score: syncScore, sync_score_updated_at: new Date().toISOString() })
    .eq('id', couple.id)

  return NextResponse.json({ syncScore })
}
