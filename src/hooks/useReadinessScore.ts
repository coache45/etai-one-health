'use client'

import { useMemo } from 'react'
import { calculateReadinessScore } from '@/lib/health/scores'
import { useHealthStore } from '@/stores/health-store'

export function useReadinessScore() {
  const { todayLog } = useHealthStore()

  return useMemo(() => {
    if (!todayLog) return null

    // Use stored score if available, otherwise calculate
    if (todayLog.readiness_score !== null) return todayLog.readiness_score

    return calculateReadinessScore({
      sleepHours: todayLog.sleep_hours,
      sleepQuality: todayLog.sleep_quality,
      hrvMs: todayLog.hrv_ms,
      restingHeartRate: todayLog.resting_heart_rate,
      stressLevel: todayLog.stress_level,
      previousDayActivity: todayLog.active_minutes,
    })
  }, [todayLog])
}
