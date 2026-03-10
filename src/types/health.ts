export interface DailyHealthLog {
  id: string
  user_id: string
  log_date: string
  sleep_hours: number | null
  sleep_quality: number | null
  sleep_bedtime: string | null
  sleep_waketime: string | null
  energy_level: number | null
  mood: number | null
  stress_level: number | null
  steps: number | null
  active_minutes: number | null
  water_glasses: number | null
  meals_logged: number | null
  exercise_type: string | null
  exercise_minutes: number | null
  notes: string | null
  resting_heart_rate: number | null
  hrv_ms: number | null
  spo2_percent: number | null
  skin_temp_celsius: number | null
  respiratory_rate: number | null
  sleep_deep_minutes: number | null
  sleep_light_minutes: number | null
  sleep_rem_minutes: number | null
  sleep_awake_minutes: number | null
  readiness_score: number | null
  sleep_score: number | null
  stress_score: number | null
  recovery_score: number | null
  created_at: string
}

export interface HealthMetricHourly {
  id: string
  user_id: string
  recorded_at: string
  heart_rate: number | null
  hrv_ms: number | null
  spo2_percent: number | null
  skin_temp_celsius: number | null
  steps: number | null
  active_calories: number | null
  source: 'manual' | 'ring_one' | 'apple_health' | 'google_health' | 'fitbit' | 'garmin'
  created_at: string
}

export interface ReadinessScoreInput {
  sleepHours: number | null
  sleepQuality: number | null
  hrvMs: number | null
  restingHeartRate: number | null
  stressLevel: number | null
  previousDayActivity: number | null
}

export interface SleepScoreInput {
  sleepHours: number | null
  sleepQuality: number | null
  sleepDeepMinutes: number | null
  sleepRemMinutes: number | null
  sleepAwakeMinutes: number | null
  sleepBedtime: string | null
  sleepWaketime: string | null
}

export interface MetricTrend {
  value: number
  previousValue: number
  change: number
  direction: 'up' | 'down' | 'stable'
  data: { date: string; value: number }[]
}

export type TrackingSource = 'manual' | 'ring_one' | 'apple_health' | 'google_health' | 'fitbit' | 'garmin'

export interface QuickLogEntry {
  metric: 'sleep' | 'mood' | 'energy' | 'stress' | 'water' | 'exercise'
  value: number | string
  logDate: string
}
