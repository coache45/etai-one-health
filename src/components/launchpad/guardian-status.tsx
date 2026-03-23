import Link from 'next/link'
import { Shield, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface GuardianStatusProps {
  status: {
    cprScore: number
    trend: 'up' | 'down' | 'stable'
    lastReading: string
  } | null
}

function getScoreColor(score: number): string {
  if (score >= 0.7) return 'text-emerald-600'
  if (score >= 0.4) return 'text-amber-500'
  return 'text-red-500'
}

function getScoreLabel(score: number): string {
  if (score >= 0.7) return 'Stable'
  if (score >= 0.4) return 'Monitor'
  return 'Alert'
}

function getGaugeColor(score: number): string {
  if (score >= 0.7) return '#10b981'
  if (score >= 0.4) return '#f59e0b'
  return '#ef4444'
}

export function GuardianStatus({ status }: GuardianStatusProps) {
  if (!status) return null

  const scorePercent = Math.round(status.cprScore * 100)
  const gaugeColor = getGaugeColor(status.cprScore)

  // Mini SVG gauge
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - status.cprScore)

  const TrendIcon = status.trend === 'up' ? TrendingUp : status.trend === 'down' ? TrendingDown : Minus
  const trendColor = status.trend === 'up' ? 'text-emerald-500' : status.trend === 'down' ? 'text-red-500' : 'text-slate-400'

  const timeSince = (() => {
    const mins = Math.floor((Date.now() - new Date(status.lastReading).getTime()) / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  })()

  return (
    <div>
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Guardian
      </h2>
      <Link href="/guardian">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {/* Mini gauge */}
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-bold ${getScoreColor(status.cprScore)}`}>
                    {scorePercent}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getScoreColor(status.cprScore)}`}>
                    CPR: {getScoreLabel(status.cprScore)}
                  </span>
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last reading {timeSince}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
