'use client'

import { useState } from 'react'
import { Moon, Smile, Zap, Brain, Droplets, Dumbbell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useHealthStore } from '@/stores/health-store'
import { getTodayISO } from '@/lib/utils'
import { toast } from 'sonner'
import type { DailyHealthLog } from '@/types/health'

interface QuickLogItem {
  metric: keyof Pick<DailyHealthLog, 'sleep_hours' | 'mood' | 'energy_level' | 'stress_level' | 'water_glasses'>
  label: string
  icon: React.ReactNode
  unit?: string
  min: number
  max: number
  step: number
}

const quickLogs: QuickLogItem[] = [
  { metric: 'sleep_hours', label: 'Sleep', icon: <Moon className="w-4 h-4" />, unit: 'hrs', min: 0, max: 12, step: 0.5 },
  { metric: 'mood', label: 'Mood', icon: <Smile className="w-4 h-4" />, unit: '/10', min: 1, max: 10, step: 1 },
  { metric: 'energy_level', label: 'Energy', icon: <Zap className="w-4 h-4" />, unit: '/10', min: 1, max: 10, step: 1 },
  { metric: 'stress_level', label: 'Stress', icon: <Brain className="w-4 h-4" />, unit: '/10', min: 1, max: 10, step: 1 },
  { metric: 'water_glasses', label: 'Water', icon: <Droplets className="w-4 h-4" />, unit: 'glasses', min: 0, max: 16, step: 1 },
]

interface QuickLogCardProps {
  userId: string
}

export function QuickLogCard({ userId }: QuickLogCardProps) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { todayLog, updateTodayLog } = useHealthStore()

  async function handleLog(metric: string, value: number) {
    setSaving(true)
    const supabase = createClient()
    const today = getTodayISO()

    try {
      const { data, error } = await supabase
        .from('daily_health_logs')
        .upsert(
          { user_id: userId, log_date: today, [metric]: value },
          { onConflict: 'user_id,log_date' }
        )
        .select()
        .single()

      if (error) throw error
      updateTodayLog({ [metric]: value })
      setActiveMetric(null)
      toast.success('Logged!')
    } catch {
      toast.error('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide px-1">
        Quick Log
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5">
        {quickLogs.map((item) => {
          const currentValue = todayLog?.[item.metric]
          const isActive = activeMetric === item.metric

          return (
            <Card
              key={item.metric}
              className={`shrink-0 w-24 lg:w-auto cursor-pointer transition-all ${
                isActive ? 'ring-2 ring-[#F5C842]' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveMetric(isActive ? null : item.metric)}
            >
              <CardContent className="p-3 text-center">
                <div className="flex justify-center mb-1 text-[#1B2A4A] dark:text-[#F5C842]">
                  {item.icon}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
                {currentValue !== null && currentValue !== undefined ? (
                  <p className="text-sm font-bold text-[#1B2A4A] dark:text-[#F5C842]">
                    {currentValue}{item.unit}
                  </p>
                ) : (
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Tap to log</p>
                )}
              </CardContent>
              {isActive && (
                <div className="px-2 pb-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {Array.from(
                      { length: Math.round((item.max - item.min) / item.step) + 1 },
                      (_, i) => item.min + i * item.step
                    )
                      .filter((v) => v > 0)
                      .slice(0, 10)
                      .map((v) => (
                        <Button
                          key={v}
                          size="sm"
                          variant={currentValue === v ? 'gold' : 'outline'}
                          className="h-7 w-7 p-0 text-xs"
                          onClick={() => handleLog(item.metric, v)}
                          disabled={saving}
                        >
                          {v}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
