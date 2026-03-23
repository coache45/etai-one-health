import Link from 'next/link'
import { Heart, Trophy, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PartnerActivityProps {
  data: {
    hasPartner: boolean
    partnerName?: string
    activities: { type: string; text: string; time: string }[]
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const mins = Math.floor((now - then) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function PartnerActivity({ data }: PartnerActivityProps) {
  // No partner — show invite CTA
  if (!data.hasPartner) {
    return (
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Partner
        </h2>
        <Link href="/partner">
          <Card className="border-2 border-dashed border-[#C9A84C]/30 hover:border-[#C9A84C]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 text-center">
              <Heart className="w-8 h-8 text-[#C9A84C]/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1B2A4A]">
                Better together
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Invite your person to share goals and AI sessions.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C9A84C]">
                Invite partner <ArrowRight className="w-3 h-3" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    )
  }

  // Partner linked but no activity
  if (data.activities.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#C9A84C]" />
          {data.partnerName}
        </h2>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-slate-500">
              No recent activity from {data.partnerName} — yet!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Heart className="w-4 h-4 text-[#C9A84C]" />
        {data.partnerName}
      </h2>
      <div className="space-y-2">
        {data.activities.map((activity, idx) => {
          const Icon = activity.type === 'milestone' ? Trophy : Sparkles
          const iconColor = activity.type === 'milestone' ? 'text-emerald-500' : 'text-[#C9A84C]'

          return (
            <Card key={idx}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{activity.text}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {timeAgo(activity.time)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
