'use client'

import { Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReadinessScore } from '@/components/dashboard/ReadinessScore'
import { useHealthStore } from '@/stores/health-store'
import { calculateStressScore, getStressLabel } from '@/lib/health/stress-score'
import { getWeekAverage } from '@/lib/health/trends'

export default function StressPage() {
  const { todayLog, recentLogs } = useHealthStore()

  const stressScore = todayLog
    ? calculateStressScore({
        stressLevel: todayLog.stress_level,
        hrvMs: todayLog.hrv_ms,
        restingHeartRate: todayLog.resting_heart_rate,
        moodScore: todayLog.mood,
      })
    : null

  const avgStress = getWeekAverage(recentLogs, 'stress_level')
  const avgHRV = getWeekAverage(recentLogs, 'hrv_ms')

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Stress</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Higher score = lower stress. Your body tells the truth.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
        <ReadinessScore score={stressScore} size="lg" />
        {stressScore !== null && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {getStressLabel(stressScore)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Today', value: todayLog?.stress_level ? `${todayLog.stress_level}/10` : '—' },
          { label: '7-Day Avg', value: avgStress ? `${avgStress}/10` : '—' },
          { label: 'HRV', value: todayLog?.hrv_ms ? `${todayLog.hrv_ms}ms` : avgHRV ? `${avgHRV}ms` : '—' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Understanding Your Stress Score
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <strong className="text-[#1B2A4A] dark:text-white">80–100:</strong> You are calm and recovered. Great day to take on challenges.
          </p>
          <p>
            <strong className="text-[#1B2A4A] dark:text-white">60–79:</strong> Moderate stress. Manageable — watch your evening habits.
          </p>
          <p>
            <strong className="text-[#1B2A4A] dark:text-white">40–59:</strong> Elevated stress. Consider a breathing break or lighter schedule.
          </p>
          <p>
            <strong className="text-amber-500">Below 40:</strong> High stress load. Prioritize rest, hydration, and connection tonight.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
