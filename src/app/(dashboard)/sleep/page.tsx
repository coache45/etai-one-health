'use client'

import { Moon, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReadinessScore } from '@/components/dashboard/ReadinessScore'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { useHealthStore } from '@/stores/health-store'
import { calculateSleepScore, getSleepStageBreakdown } from '@/lib/health/sleep-score'
import { getWeekAverage } from '@/lib/health/trends'

export default function SleepPage() {
  const { todayLog, recentLogs } = useHealthStore()

  const sleepScore = todayLog
    ? calculateSleepScore({
        sleepHours: todayLog.sleep_hours,
        sleepQuality: todayLog.sleep_quality,
        sleepDeepMinutes: todayLog.sleep_deep_minutes,
        sleepRemMinutes: todayLog.sleep_rem_minutes,
        sleepAwakeMinutes: todayLog.sleep_awake_minutes,
        sleepBedtime: todayLog.sleep_bedtime,
        sleepWaketime: todayLog.sleep_waketime,
      })
    : null

  const stages = todayLog
    ? getSleepStageBreakdown({
        deepMinutes: todayLog.sleep_deep_minutes,
        lightMinutes: todayLog.sleep_light_minutes,
        remMinutes: todayLog.sleep_rem_minutes,
        awakeMinutes: todayLog.sleep_awake_minutes,
      })
    : []

  const totalSleepMinutes = stages.reduce((sum, s) => sum + s.minutes, 0)
  const avgSleepHours = getWeekAverage(recentLogs, 'sleep_hours')
  const avgSleepQuality = getWeekAverage(recentLogs, 'sleep_quality')

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Sleep</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {todayLog?.sleep_bedtime && todayLog?.sleep_waketime
            ? `${todayLog.sleep_bedtime} → ${todayLog.sleep_waketime}`
            : 'Track your sleep to unlock insights'}
        </p>
      </div>

      {/* Sleep Score */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex justify-center">
        <ReadinessScore score={sleepScore} size="lg" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Duration', value: todayLog?.sleep_hours ? `${todayLog.sleep_hours}h` : '—' },
          { label: 'Quality', value: todayLog?.sleep_quality ? `${todayLog.sleep_quality}/10` : '—' },
          { label: '7-Day Avg', value: avgSleepHours ? `${avgSleepHours}h` : '—' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sleep Stages */}
      {stages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Sleep Stages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Bar visualization */}
            <div className="flex h-6 rounded-full overflow-hidden">
              {stages.map((stage) => (
                <div
                  key={stage.stage}
                  style={{
                    width: `${(stage.minutes / totalSleepMinutes) * 100}%`,
                    backgroundColor: stage.color,
                  }}
                />
              ))}
            </div>
            {stages.map((stage) => (
              <div key={stage.stage} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: stage.color }} />
                  <span className="text-gray-600 dark:text-gray-300">{stage.stage}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#1B2A4A] dark:text-white">
                    {stage.minutes}m
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    ({Math.round((stage.minutes / totalSleepMinutes) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weekly Trend */}
      <WeeklyChart logs={recentLogs} />

      {/* AI Tip */}
      {avgSleepHours && avgSleepHours < 7 && (
        <Card className="border-l-4 border-l-[#F5C842]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#F5C842]" />
              <span className="text-xs font-semibold text-[#F5C842]">COACH TIP</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your 7-day average is {avgSleepHours} hours — below the ideal range.
              Try moving your bedtime back by 30 minutes tonight and see how you feel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
