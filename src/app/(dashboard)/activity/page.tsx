'use client'

import { Activity, Footprints, Flame, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useHealthStore } from '@/stores/health-store'
import { getWeekAverage } from '@/lib/health/trends'

const DAILY_STEP_GOAL = 8000
const ACTIVE_MINUTES_GOAL = 30

export default function ActivityPage() {
  const { todayLog, recentLogs } = useHealthStore()

  const steps = todayLog?.steps ?? 0
  const activeMinutes = todayLog?.active_minutes ?? 0
  const exerciseMinutes = todayLog?.exercise_minutes ?? 0

  const stepsProgress = Math.min(100, (steps / DAILY_STEP_GOAL) * 100)
  const activeProgress = Math.min(100, (activeMinutes / ACTIVE_MINUTES_GOAL) * 100)

  const avgSteps = getWeekAverage(recentLogs, 'steps')
  const avgActive = getWeekAverage(recentLogs, 'active_minutes')

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Activity</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Keep moving. Every step counts.</p>
      </div>

      {/* Step Goal */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-[#1B2A4A] dark:text-[#F5C842]" />
              <span className="font-semibold text-[#1B2A4A] dark:text-white">Daily Steps</span>
            </div>
            <span className="text-sm text-gray-500">Goal: {DAILY_STEP_GOAL.toLocaleString()}</span>
          </div>
          <div className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
            {steps.toLocaleString()}
          </div>
          <Progress value={stepsProgress} className="h-3" />
          <p className="text-xs text-gray-400 mt-2">
            {stepsProgress >= 100
              ? '🎉 Goal reached! Keep going.'
              : `${(DAILY_STEP_GOAL - steps).toLocaleString()} steps to goal`}
          </p>
        </CardContent>
      </Card>

      {/* Active Minutes */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1B2A4A] dark:text-[#F5C842]" />
              <span className="font-semibold text-[#1B2A4A] dark:text-white">Active Minutes</span>
            </div>
            <span className="text-sm text-gray-500">Goal: {ACTIVE_MINUTES_GOAL} min</span>
          </div>
          <div className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
            {activeMinutes}m
          </div>
          <Progress value={activeProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">
              {Math.round(steps * 0.04)}
            </p>
            <p className="text-xs text-gray-500">Cal Burned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 text-[#1E6FBF] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">
              {exerciseMinutes}m
            </p>
            <p className="text-xs text-gray-500">Exercise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Footprints className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">
              {avgSteps ? Math.round(avgSteps).toLocaleString() : '—'}
            </p>
            <p className="text-xs text-gray-500">7-Day Avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Type */}
      {todayLog?.exercise_type && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Exercise</p>
            <p className="text-lg font-bold text-[#1B2A4A] dark:text-white capitalize">
              {todayLog.exercise_type}
            </p>
            {exerciseMinutes > 0 && (
              <p className="text-sm text-gray-500">{exerciseMinutes} minutes</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
