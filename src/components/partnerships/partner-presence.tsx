'use client'

import { usePartnerPresence } from '@/lib/partnerships/use-partner-presence'

interface PartnerPresenceProps {
  enabled?: boolean
}

export function PartnerPresence({ enabled = true }: PartnerPresenceProps) {
  const { partnerOnline, partnerName, isLoading } = usePartnerPresence(enabled)

  if (isLoading || !partnerName) return null

  if (partnerOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-right-2 duration-300">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-medium text-emerald-700">
          {partnerName} is here
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
      <span className="text-xs text-slate-400">
        {partnerName} is away
      </span>
    </div>
  )
}
