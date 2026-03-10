'use client'

import { Moon, Activity, Brain, Footprints } from 'lucide-react'
import { ReadinessScore } from '@/components/dashboard/ReadinessScore'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { AIInsightCard } from '@/components/dashboard/AIInsightCard'
import { QuickLogCard } from '@/components/dashboard/QuickLogCard'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { useHealthStore } from '@/stores/health-store'
import { useUserStore } from '@/stores/user-store'
import { useReadinessScore } from '@/hooks/useReadinessScore'
import { calculateTrend, getMetricStatus } from '@/lib/health/trends'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { profile, isLoading: userLoading } = useUserStore()
  const { todayLog, recentLogs, insights, isLoading: healthLoading } = useHealthStore()
  const readinessScore = useReadinessScore()

  const isLoading = userLoading || healthLoading

  // Calculate trends
  const sleepTrend = calculateTrend(recentLogs, 'sleep_hours')
  const stressTrend = calculateTrend(recentLogs, 'stress_level')
  const stepsTrend = calculateTrend(recentLogs, 'steps')
  const activeTrend = calculateTrend(recentLogs, 'active_minutes')

  const topInsight = insights.find((i) => !i.is_read)

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Readiness Score Hero */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="w-44 h-44 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <ReadinessScore score={readinessScore} size="lg" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
              {readinessScore === null
                ? 'Log your health data to see your Readiness Score.'
                : readinessScore >= 70
                ? 'Your body is ready. Make the most of today.'
                : readinessScore >= 45
                ? 'Moderate readiness. Take it steady and recover well.'
                : 'Your body needs rest. Prioritize recovery today.'}
            </p>
          </>
        )}
      </div>

      {/* Quick Log */}
      {profile && <QuickLogCard userId={profile.id} />}

      {/* AI Insight */}
      <AIInsightCard insight={topInsight ?? null} isLoading={isLoading} />

      {/* Metric Grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide px-1 mb-3">
          Today&apos;s Metrics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Sleep"
            value={todayLog?.sleep_hours ?? null}
            unit="hrs"
            icon={<Moon className="w-4 h-4" />}
            trend={sleepTrend?.direction ?? null}
            trendValue={sleepTrend ? `${Math.abs(sleepTrend.change).toFixed(1)}h` : undefined}
            status={todayLog?.sleep_hours ? getMetricStatus(todayLog.sleep_hours, 'sleep_hours') : 'good'}
            isLoading={isLoading}
          />
          <MetricCard
            title="Stress"
            value={todayLog?.stress_level ?? null}
            unit="/10"
            icon={<Brain className="w-4 h-4" />}
            trend={stressTrend ? (stressTrend.direction === 'up' ? 'down' : stressTrend.direction === 'down' ? 'up' : 'stable') : null}
            trendValue={stressTrend ? `${Math.abs(stressTrend.change)}` : undefined}
            status={todayLog?.stress_level ? getMetricStatus(todayLog.stress_level, 'stress_level') : 'good'}
            isLoading={isLoading}
          />
          <MetricCard
            title="Steps"
            value={todayLog?.steps ?? null}
            icon={<Footprints className="w-4 h-4" />}
            trend={stepsTrend?.direction ?? null}
            trendValue={stepsTrend ? `${Math.abs(Math.round(stepsTrend.change))}` : undefined}
            status={todayLog?.steps ? getMetricStatus(todayLog.steps, 'steps') : 'good'}
            isLoading={isLoading}
          />
          <MetricCard
            title="Active Min"
            value={todayLog?.active_minutes ?? null}
            unit="min"
            icon={<Activity className="w-4 h-4" />}
            trend={activeTrend?.direction ?? null}
            trendValue={activeTrend ? `${Math.abs(Math.round(activeTrend.change))}` : undefined}
            status="good"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Weekly Chart */}
      {!isLoading && recentLogs.length > 1 && <WeeklyChart logs={recentLogs} />}
    </div>
  )
}
