import type { ReadinessScoreInput } from '@/types/health'

export function calculateReadinessScore(data: ReadinessScoreInput): number {
  let score = 0
  let factors = 0

  // Sleep hours component (0-30 points)
  if (data.sleepHours !== null) {
    const sleepScore =
      data.sleepHours >= 7 && data.sleepHours <= 9
        ? 30
        : Math.max(0, 30 - Math.abs(data.sleepHours - 8) * 8)
    score += sleepScore
    factors++
  }

  // Sleep quality component (0-20 points)
  if (data.sleepQuality !== null) {
    score += (data.sleepQuality / 10) * 20
    factors++
  }

  // HRV component (0-20 points) — higher is better
  if (data.hrvMs !== null) {
    const hrvScore = Math.min(20, (data.hrvMs / 80) * 20)
    score += hrvScore
    factors++
  }

  // Resting heart rate (0-15 points) — lower is better
  if (data.restingHeartRate !== null) {
    const rhrScore =
      data.restingHeartRate <= 60
        ? 15
        : data.restingHeartRate <= 70
        ? 12
        : data.restingHeartRate <= 80
        ? 8
        : 4
    score += rhrScore
    factors++
  }

  // Stress inverse (0-15 points) — lower stress = more points
  if (data.stressLevel !== null) {
    score += ((10 - data.stressLevel) / 10) * 15
    factors++
  }

  if (factors === 0) return 0

  // Normalize if we don't have all factors
  if (factors < 5) {
    const maxPossible = factors * 20
    score = (score / maxPossible) * 100
  }

  return Math.round(Math.min(100, Math.max(0, score)))
}

export function calculateRecoveryScore(data: {
  hrvMs: number | null
  restingHeartRate: number | null
  sleepHours: number | null
  sleepDeepMinutes: number | null
  sleepRemMinutes: number | null
}): number {
  let score = 0
  let factors = 0

  if (data.hrvMs !== null) {
    score += Math.min(40, (data.hrvMs / 80) * 40)
    factors++
  }

  if (data.restingHeartRate !== null) {
    const rhrScore =
      data.restingHeartRate <= 55
        ? 30
        : data.restingHeartRate <= 65
        ? 24
        : data.restingHeartRate <= 75
        ? 16
        : 8
    score += rhrScore
    factors++
  }

  if (data.sleepHours !== null) {
    score += Math.min(20, (data.sleepHours / 8) * 20)
    factors++
  }

  if (data.sleepDeepMinutes !== null) {
    score += Math.min(10, (data.sleepDeepMinutes / 90) * 10)
    factors++
  }

  if (factors === 0) return 0

  const maxPossible = factors === 4 ? 100 : factors * 25
  score = factors === 4 ? score : (score / maxPossible) * 100

  return Math.round(Math.min(100, Math.max(0, score)))
}
