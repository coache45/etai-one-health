import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCouplesInsight } from '@/lib/ai/couples-ai'
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

  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: couple } = await supabase
      .from('couples')
      .select('*')
      .or(`partner_a_id.eq.${user.id},partner_b_id.eq.${user.id}`)
      .eq('status', 'active')
      .single()

    if (!couple) {
      return NextResponse.json({ error: 'No active couple found' }, { status: 404 })
    }

    const partnerId =
      couple.partner_a_id === user.id ? couple.partner_b_id : couple.partner_a_id

    const [meProfile, partnerProfile, myLog, partnerLog] = await Promise.all([
      supabase.from('profiles').select('full_name, display_name').eq('id', user.id).single(),
      supabase.from('profiles').select('full_name, display_name').eq('id', partnerId).single(),
      supabase.from('daily_health_logs').select('*').eq('user_id', user.id).eq('log_date', today).single(),
      supabase.from('daily_health_logs').select('*').eq('user_id', partnerId).eq('log_date', today).single(),
    ])

    const isPartnerA = couple.partner_a_id === user.id
    const insight = await generateCouplesInsight({
      partnerAName: isPartnerA
        ? meProfile.data?.display_name ?? meProfile.data?.full_name ?? 'Partner A'
        : partnerProfile.data?.display_name ?? partnerProfile.data?.full_name ?? 'Partner A',
      partnerBName: isPartnerA
        ? partnerProfile.data?.display_name ?? partnerProfile.data?.full_name ?? 'Partner B'
        : meProfile.data?.display_name ?? meProfile.data?.full_name ?? 'Partner B',
      partnerALog: isPartnerA ? (myLog.data as DailyHealthLog) : (partnerLog.data as DailyHealthLog),
      partnerBLog: isPartnerA ? (partnerLog.data as DailyHealthLog) : (myLog.data as DailyHealthLog),
      syncScore: couple.sync_score ?? 0,
      sharingA: (isPartnerA ? couple.partner_a_shares : couple.partner_b_shares) as SharingPreferences,
      sharingB: (isPartnerA ? couple.partner_b_shares : couple.partner_a_shares) as SharingPreferences,
    })

    return NextResponse.json(insight)
  } catch (error) {
    console.error('Couples AI error:', error)
    return NextResponse.json({ error: 'Failed to generate couples insight' }, { status: 500 })
  }
}
