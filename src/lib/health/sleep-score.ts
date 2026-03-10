import type { SleepScoreInput } from '@/types/health'

export function calculateSleepScore(data: SleepScoreInput): number {
  let score = 0
  let factors = 0

  // Duration (0-30 points)
  if (data.sleepHours !== null) {
    const duration = data.sleepHours
    const durationScore =
      duration >= 7 && duration <= 9
        ? 30
        : duration >= 6 && duration < 7
        ? 22
        : duration > 9
        ? 22
        : duration >= 5
        ? 12
        : 5
    score += durationScore
    factors++
  }

  // Quality (0-30 points)
  if (data.sleepQuality !== null) {
    score += (data.sleepQuality / 10) * 30
    factors++
  }

  // Deep sleep (0-20 points) — optimal 90 min
  if (data.sleepDeepMinutes !== null) {
    score += Math.min(20, (data.sleepDeepMinutes / 90) * 20)
    factors++
  }

  // REM sleep (0-20 points) — optimal 90 min
  if (data.sleepRemMinutes !== null) {
    score += Math.min(20, (data.sleepRemMinutes / 90) * 20)
    factors++
  }

  if (factors === 0) return 0

  // Normalize
  const maxPossible = (30 + 30 + 20 + 20) * (factors / 4)
  if (factors < 4) {
    return Math.round(Math.min(100, (score / maxPossible) * 100))
  }

  return Math.round(Math.min(100, score))
}

export function getSleepStageBreakdown(data: {
  deepMinutes: number | null
  lightMinutes: number | null
  remMinutes: number | null
  awakeMinutes: number | null
}): { stage: string; minutes: number; color: string }[] {
  const stages = []

  if (data.deepMinutes) {
    stages.push({ stage: 'Deep', minutes: data.deepMinutes, color: '#1B2A4A' })
  }
  if (data.remMinutes) {
    stages.push({ stage: 'REM', minutes: data.remMinutes, color: '#1E6FBF' })
  }
  if (data.lightMinutes) {
    stages.push({ stage: 'Light', minutes: data.lightMinutes, color: '#F5C842' })
  }
  if (data.awakeMinutes) {
    stages.push({ stage: 'Awake', minutes: data.awakeMinutes, color: '#EF4444' })
  }

  return stages
}
