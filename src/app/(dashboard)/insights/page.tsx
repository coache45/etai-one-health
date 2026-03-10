'use client'

import { Sparkles, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { useHealthStore } from '@/stores/health-store'
import { useUserStore } from '@/stores/user-store'
import { getWeekAverage } from '@/lib/health/trends'
import { createClient } from '@/lib/supabase/client'
import type { AIInsight } from '@/types/ai'

export default function InsightsPage() {
  const { recentLogs, insights } = useHealthStore()
  const { profile } = useUserStore()

  const avgReadiness = getWeekAverage(recentLogs, 'readiness_score')
  const avgSleep = getWeekAverage(recentLogs, 'sleep_hours')
  const avgStress = getWeekAverage(recentLogs, 'stress_level')
  const avgSteps = getWeekAverage(recentLogs, 'steps')

  const priorityColor = (priority: number) => {
    if (priority >= 8) return 'destructive'
    if (priority >= 5) return 'warning'
    return 'success'
  }

  async function markRead(id: string) {
    const supabase = createClient()
    await supabase.from('ai_insights').update({ is_read: true }).eq('id', id)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your 7-day summary and AI observations.</p>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Avg Readiness', value: avgReadiness ? `${Math.round(avgReadiness)}` : '—' },
          { label: 'Avg Sleep', value: avgSleep ? `${avgSleep}h` : '—' },
          { label: 'Avg Stress', value: avgStress ? `${avgStress}/10` : '—' },
          { label: 'Avg Steps', value: avgSteps ? `${Math.round(avgSteps).toLocaleString()}` : '—' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#1B2A4A] dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Chart */}
      <WeeklyChart logs={recentLogs} />

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#F5C842]" />
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            AI Observations
          </h2>
        </div>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keep logging daily and your AI coach will generate personalized insights here.
                </p>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight: AIInsight) => (
              <Card
                key={insight.id}
                className={`border-l-4 ${
                  insight.priority >= 8
                    ? 'border-l-red-500'
                    : insight.priority >= 5
                    ? 'border-l-amber-500'
                    : 'border-l-[#F5C842]'
                }`}
                onClick={() => markRead(insight.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={priorityColor(insight.priority)} className="text-xs">
                      {insight.insight_type}
                    </Badge>
                    {!insight.is_read && (
                      <div className="w-2 h-2 bg-[#F5C842] rounded-full" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-[#1B2A4A] dark:text-white mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {insight.body}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
