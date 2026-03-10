export function calculateStressScore(data: {
  stressLevel: number | null
  hrvMs: number | null
  restingHeartRate: number | null
  moodScore: number | null
}): number {
  let score = 0
  let factors = 0

  // Stress self-report (0-40 points) — lower stress = higher score
  if (data.stressLevel !== null) {
    score += ((10 - data.stressLevel) / 10) * 40
    factors++
  }

  // HRV (0-30 points) — higher HRV = lower stress
  if (data.hrvMs !== null) {
    score += Math.min(30, (data.hrvMs / 80) * 30)
    factors++
  }

  // Resting heart rate (0-20 points) — lower RHR = lower stress
  if (data.restingHeartRate !== null) {
    const rhrScore =
      data.restingHeartRate <= 60
        ? 20
        : data.restingHeartRate <= 70
        ? 16
        : data.restingHeartRate <= 80
        ? 10
        : 5
    score += rhrScore
    factors++
  }

  // Mood (0-10 points)
  if (data.moodScore !== null) {
    score += (data.moodScore / 10) * 10
    factors++
  }

  if (factors === 0) return 0

  const maxPossible = 100 * (factors / 4)
  return Math.round(Math.min(100, (score / maxPossible) * 100))
}

export function getStressLabel(score: number): string {
  if (score >= 80) return 'Low Stress'
  if (score >= 60) return 'Moderate'
  if (score >= 40) return 'Elevated'
  return 'High Stress'
}
