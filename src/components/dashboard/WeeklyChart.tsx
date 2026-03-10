'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatShortDate } from '@/lib/utils'
import type { DailyHealthLog } from '@/types/health'

interface WeeklyChartProps {
  logs: DailyHealthLog[]
}

export function WeeklyChart({ logs }: WeeklyChartProps) {
  const data = logs
    .slice()
    .reverse()
    .map((log) => ({
      date: formatShortDate(log.log_date),
      readiness: log.readiness_score,
      sleep: log.sleep_score,
      stress: log.stress_score ? 100 - log.stress_score : null,
    }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">7-Day Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
            Log a few days to see your trend
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">7-Day Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B2A4A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1B2A4A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E6FBF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1E6FBF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            />
            <Area
              type="monotone"
              dataKey="readiness"
              name="Readiness"
              stroke="#1B2A4A"
              fill="url(#readinessGrad)"
              strokeWidth={2}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="sleep"
              name="Sleep"
              stroke="#1E6FBF"
              fill="url(#sleepGrad)"
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-3 h-0.5 bg-[#1B2A4A]" /> Readiness
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-3 h-0.5 bg-[#1E6FBF]" /> Sleep
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
