import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateReadinessScore } from '@/lib/health/scores'
import { calculateSleepScore } from '@/lib/health/sleep-score'
import { calculateStressScore } from '@/lib/health/stress-score'
import type { DailyHealthLog } from '@/types/health'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const logDate = body.log_date ?? new Date().toISOString().split('T')[0]

  // Calculate scores
  const readiness_score = calculateReadinessScore({
    sleepHours: body.sleep_hours ?? null,
    sleepQuality: body.sleep_quality ?? null,
    hrvMs: body.hrv_ms ?? null,
    restingHeartRate: body.resting_heart_rate ?? null,
    stressLevel: body.stress_level ?? null,
    previousDayActivity: body.active_minutes ?? null,
  })

  const sleep_score = calculateSleepScore({
    sleepHours: body.sleep_hours ?? null,
    sleepQuality: body.sleep_quality ?? null,
    sleepDeepMinutes: body.sleep_deep_minutes ?? null,
    sleepRemMinutes: body.sleep_rem_minutes ?? null,
    sleepAwakeMinutes: body.sleep_awake_minutes ?? null,
    sleepBedtime: body.sleep_bedtime ?? null,
    sleepWaketime: body.sleep_waketime ?? null,
  })

  const stress_score = calculateStressScore({
    stressLevel: body.stress_level ?? null,
    hrvMs: body.hrv_ms ?? null,
    restingHeartRate: body.resting_heart_rate ?? null,
    moodScore: body.mood ?? null,
  })

  const { data, error } = await supabase
    .from('daily_health_logs')
    .upsert(
      {
        user_id: user.id,
        log_date: logDate,
        ...body,
        readiness_score,
        sleep_score,
        stress_score,
      },
      { onConflict: 'user_id,log_date' }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data as DailyHealthLog)
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_health_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', date)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}
