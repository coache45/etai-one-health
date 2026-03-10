import type { DailyHealthLog } from '@/types/health'
import type { SharingPreferences } from '@/types/couples'
import { timeToMinutes } from '@/lib/utils'

export function calculateSyncScore(
  partnerA: DailyHealthLog,
  partnerB: DailyHealthLog,
  sharingSettings: { a: SharingPreferences; b: SharingPreferences }
): number {
  let score = 0
  let components = 0

  // Sleep schedule alignment (0-30 points)
  if (sharingSettings.a.sleep && sharingSettings.b.sleep) {
    if (partnerA.sleep_bedtime && partnerB.sleep_bedtime) {
      const bedtimeDiffMin = Math.abs(
        timeToMinutes(partnerA.sleep_bedtime) - timeToMinutes(partnerB.sleep_bedtime)
      )
      score += bedtimeDiffMin <= 30 ? 30 : Math.max(0, 30 - (bedtimeDiffMin - 30) * 0.5)
      components++
    }

    if (partnerA.sleep_hours && partnerB.sleep_hours) {
      const hoursDiff = Math.abs(partnerA.sleep_hours - partnerB.sleep_hours)
      score += hoursDiff <= 1 ? 15 : Math.max(0, 15 - hoursDiff * 5)
      components++
    }
  }

  // Stress pattern alignment (0-25 points)
  if (sharingSettings.a.stress && sharingSettings.b.stress) {
    if (partnerA.stress_level && partnerB.stress_level) {
      const stressDiff = Math.abs(partnerA.stress_level - partnerB.stress_level)
      score += Math.max(0, 25 - stressDiff * 5)
      components++
    }
  }

  // Activity alignment (0-25 points)
  if (sharingSettings.a.activity && sharingSettings.b.activity) {
    if (partnerA.steps && partnerB.steps) {
      const stepRatio =
        Math.min(partnerA.steps, partnerB.steps) / Math.max(partnerA.steps, partnerB.steps)
      score += stepRatio * 25
      components++
    }
  }

  // Mood alignment (0-20 points)
  if (sharingSettings.a.mood && sharingSettings.b.mood) {
    if (partnerA.mood && partnerB.mood) {
      const moodDiff = Math.abs(partnerA.mood - partnerB.mood)
      score += Math.max(0, 20 - moodDiff * 4)
      components++
    }
  }

  if (components === 0) return 0

  // Normalize across components
  const maxPerComponent = 25
  return Math.round(Math.min(100, (score / (components * maxPerComponent)) * 100))
}

export function getSyncScoreLabel(score: number): string {
  if (score >= 85) return 'In Perfect Sync'
  if (score >= 70) return 'Well Aligned'
  if (score >= 55) return 'Mostly in Sync'
  if (score >= 40) return 'Drifting Apart'
  return 'Out of Sync'
}

export function getSyncScoreMessage(score: number, partnerName: string): string {
  if (score >= 85) return `You and ${partnerName} are in perfect rhythm right now.`
  if (score >= 70) return `You two are well aligned. Keep it going.`
  if (score >= 55) return `Mostly in sync with ${partnerName}. A few small shifts could close the gap.`
  if (score >= 40) return `Your schedules diverged this week. What changed?`
  return `You and ${partnerName} are living very different rhythms right now. Time to reconnect.`
}
