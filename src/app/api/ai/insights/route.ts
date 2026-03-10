import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDailyInsight } from '@/lib/ai/insights'
import type { DailyHealthLog } from '@/types/health'

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
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [todayRes, recentRes] = await Promise.all([
      supabase.from('daily_health_logs').select('*').eq('user_id', user.id).eq('log_date', today).single(),
      supabase.from('daily_health_logs').select('*').eq('user_id', user.id).gte('log_date', lastWeek).order('log_date', { ascending: false }),
    ])

    if (!todayRes.data) {
      return NextResponse.json({ error: 'No data for today' }, { status: 404 })
    }

    const insight = await generateDailyInsight(
      user.id,
      todayRes.data as DailyHealthLog,
      (recentRes.data ?? []) as DailyHealthLog[]
    )

    const { data: saved } = await supabase.from('ai_insights').insert(insight).select().single()

    return NextResponse.json(saved)
  } catch (error) {
    console.error('Insights API error:', error)
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 })
  }
}
