import { Moon, Brain, Footprints, Smile } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReadinessScore } from '@/components/dashboard/ReadinessScore'
import { calculateReadinessScore } from '@/lib/health/scores'
import type { CouplesData } from '@/types/couples'

interface SideBySideViewProps {
  data: CouplesData
}

interface MetricRowProps {
  label: string
  icon: React.ReactNode
  valueA: number | null | undefined
  valueB: number | null | undefined
  unit?: string
  lowerIsBetter?: boolean
}

function MetricRow({ label, icon, valueA, valueB, unit = '', lowerIsBetter = false }: MetricRowProps) {
  const diff = valueA !== null && valueA !== undefined && valueB !== null && valueB !== undefined
    ? Math.abs(valueA - valueB)
    : null
  const isClose = diff !== null && diff <= (lowerIsBetter ? 1 : 2)

  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-lg ${isClose ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
      <div className="w-4 h-4 text-gray-400 shrink-0">{icon}</div>
      <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-[#1B2A4A] dark:text-white w-16 text-center">
        {valueA !== null && valueA !== undefined ? `${valueA}${unit}` : '—'}
      </span>
      {isClose && <span className="text-xs text-green-500">✓</span>}
      {!isClose && <span className="w-4" />}
      <span className="text-sm font-semibold text-[#1B2A4A] dark:text-white w-16 text-center">
        {valueB !== null && valueB !== undefined ? `${valueB}${unit}` : '—'}
      </span>
    </div>
  )
}

export function SideBySideView({ data }: SideBySideViewProps) {
  const { partnerA, partnerB, couple } = data

  const scoreA = partnerA.todayLog
    ? calculateReadinessScore({
        sleepHours: partnerA.todayLog.sleep_hours,
        sleepQuality: partnerA.todayLog.sleep_quality,
        hrvMs: partnerA.todayLog.hrv_ms,
        restingHeartRate: partnerA.todayLog.resting_heart_rate,
        stressLevel: partnerA.todayLog.stress_level,
        previousDayActivity: partnerA.todayLog.active_minutes,
      })
    : null

  const scoreB = partnerB.todayLog
    ? calculateReadinessScore({
        sleepHours: partnerB.todayLog.sleep_hours,
        sleepQuality: partnerB.todayLog.sleep_quality,
        hrvMs: partnerB.todayLog.hrv_ms,
        restingHeartRate: partnerB.todayLog.resting_heart_rate,
        stressLevel: partnerB.todayLog.stress_level,
        previousDayActivity: partnerB.todayLog.active_minutes,
      })
    : null

  const sharesA = couple.partner_a_shares
  const sharesB = couple.partner_b_shares

  return (
    <Card>
      <CardContent className="p-4">
        {/* Partner headers */}
        <div className="flex items-center mb-4">
          <div className="flex-1 flex flex-col items-center gap-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={partnerA.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">
                {partnerA.full_name[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs font-semibold text-[#1B2A4A] dark:text-white">
              {partnerA.display_name ?? partnerA.full_name.split(' ')[0]}
            </p>
            <ReadinessScore score={scoreA} size="sm" />
          </div>

          <div className="px-4 text-[#F5C842] text-xs font-bold">vs</div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={partnerB.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">
                {partnerB.full_name[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs font-semibold text-[#1B2A4A] dark:text-white">
              {partnerB.display_name ?? partnerB.full_name.split(' ')[0]}
            </p>
            <ReadinessScore score={scoreB} size="sm" />
          </div>
        </div>

        <div className="space-y-0.5">
          {sharesA.sleep && sharesB.sleep && (
            <MetricRow
              label="Sleep"
              icon={<Moon className="w-4 h-4" />}
              valueA={partnerA.todayLog?.sleep_hours}
              valueB={partnerB.todayLog?.sleep_hours}
              unit="h"
            />
          )}
          {sharesA.stress && sharesB.stress && (
            <MetricRow
              label="Stress"
              icon={<Brain className="w-4 h-4" />}
              valueA={partnerA.todayLog?.stress_level}
              valueB={partnerB.todayLog?.stress_level}
              unit="/10"
              lowerIsBetter
            />
          )}
          {sharesA.activity && sharesB.activity && (
            <MetricRow
              label="Steps"
              icon={<Footprints className="w-4 h-4" />}
              valueA={partnerA.todayLog?.steps}
              valueB={partnerB.todayLog?.steps}
            />
          )}
          {sharesA.mood && sharesB.mood && (
            <MetricRow
              label="Mood"
              icon={<Smile className="w-4 h-4" />}
              valueA={partnerA.todayLog?.mood}
              valueB={partnerB.todayLog?.mood}
              unit="/10"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
