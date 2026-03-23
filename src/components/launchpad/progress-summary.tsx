import { Zap, Target, Trophy, Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ProgressSummaryProps {
  stats: {
    sessionsThisWeek: number
    activeGoals: number
    milestonesThisMonth: number
    streak: number
  }
}

export function ProgressSummary({ stats }: ProgressSummaryProps) {
  const metrics = [
    {
      label: 'Sessions this week',
      value: stats.sessionsThisWeek,
      icon: Zap,
      color: 'text-[#C9A84C]',
      bg: 'bg-[#C9A84C]/10',
    },
    {
      label: 'Active goals',
      value: stats.activeGoals,
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Milestones this month',
      value: stats.milestonesThisMonth,
      icon: Trophy,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Day streak',
      value: stats.streak,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div>
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
        Your progress
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mx-auto mb-2`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <p className="text-2xl font-bold text-[#1B2A4A]">{m.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
