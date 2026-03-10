import { NextRequest, NextResponse } from 'next/server'
import { calculateReadinessScore } from '@/lib/health/scores'
import { calculateSleepScore } from '@/lib/health/sleep-score'
import { calculateStressScore } from '@/lib/health/stress-score'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const readiness = calculateReadinessScore({
    sleepHours: body.sleep_hours ?? null,
    sleepQuality: body.sleep_quality ?? null,
    hrvMs: body.hrv_ms ?? null,
    restingHeartRate: body.resting_heart_rate ?? null,
    stressLevel: body.stress_level ?? null,
    previousDayActivity: body.active_minutes ?? null,
  })

  const sleep = calculateSleepScore({
    sleepHours: body.sleep_hours ?? null,
    sleepQuality: body.sleep_quality ?? null,
    sleepDeepMinutes: body.sleep_deep_minutes ?? null,
    sleepRemMinutes: body.sleep_rem_minutes ?? null,
    sleepAwakeMinutes: body.sleep_awake_minutes ?? null,
    sleepBedtime: body.sleep_bedtime ?? null,
    sleepWaketime: body.sleep_waketime ?? null,
  })

  const stress = calculateStressScore({
    stressLevel: body.stress_level ?? null,
    hrvMs: body.hrv_ms ?? null,
    restingHeartRate: body.resting_heart_rate ?? null,
    moodScore: body.mood ?? null,
  })

  return NextResponse.json({ readiness, sleep, stress })
}
