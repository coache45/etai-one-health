import type { DailyHealthLog, MetricTrend } from '@/types/health'

type NumericKey = keyof Pick<
  DailyHealthLog,
  | 'sleep_hours'
  | 'sleep_quality'
  | 'energy_level'
  | 'mood'
  | 'stress_level'
  | 'steps'
  | 'active_minutes'
  | 'readiness_score'
  | 'sleep_score'
  | 'hrv_ms'
  | 'resting_heart_rate'
>

export function calculateTrend(
  logs: DailyHealthLog[],
  metric: NumericKey
): MetricTrend | null {
  if (logs.length < 2) return null

  const withValues = logs.filter((l) => l[metric] !== null)
  if (withValues.length < 2) return null

  const sorted = [...withValues].sort(
    (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
  )

  const currentValue = sorted[sorted.length - 1][metric] as number
  const previousValue = sorted[sorted.length - 2][metric] as number
  const change = currentValue - previousValue
  const threshold = 0.05 * previousValue

  const direction: 'up' | 'down' | 'stable' =
    Math.abs(change) < threshold ? 'stable' : change > 0 ? 'up' : 'down'

  const data = sorted.map((log) => ({
    date: log.log_date,
    value: (log[metric] as number) ?? 0,
  }))

  return { value: currentValue, previousValue, change, direction, data }
}

export function getWeekAverage(logs: DailyHealthLog[], metric: NumericKey): number | null {
  const values = logs
    .filter((l) => l[metric] !== null)
    .map((l) => l[metric] as number)

  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

export function getMetricStatus(
  value: number,
  metric: string
): 'good' | 'warning' | 'danger' {
  switch (metric) {
    case 'sleep_hours':
      return value >= 7 ? 'good' : value >= 5.5 ? 'warning' : 'danger'
    case 'sleep_quality':
    case 'energy_level':
    case 'mood':
      return value >= 7 ? 'good' : value >= 5 ? 'warning' : 'danger'
    case 'stress_level':
      return value <= 4 ? 'good' : value <= 6 ? 'warning' : 'danger'
    case 'readiness_score':
    case 'sleep_score':
      return value >= 70 ? 'good' : value >= 45 ? 'warning' : 'danger'
    case 'steps':
      return value >= 8000 ? 'good' : value >= 5000 ? 'warning' : 'danger'
    default:
      return 'good'
  }
}
