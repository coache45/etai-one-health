'use client'

import { useEffect, useState } from 'react'
import { Clock, Bookmark } from 'lucide-react'
import type { PromptOutput } from '@/types/studio'

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

interface SessionHistoryProps {
  refreshTrigger?: number
  onSelectOutput?: (output: PromptOutput) => void
}

export function SessionHistory({ refreshTrigger, onSelectOutput }: SessionHistoryProps) {
  const [outputs, setOutputs] = useState<PromptOutput[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/studio/outputs?limit=10')
        if (res.ok) {
          const data = await res.json()
          setOutputs(data.outputs ?? [])
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-slate-400">Loading history...</p>
      </div>
    )
  }

  if (outputs.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500 font-medium">Your story starts here</p>
        <p className="text-xs text-slate-400 mt-1">
          Sessions will show up as you create them.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-3">
        Recent Sessions
      </h3>
      {outputs.map((output) => (
        <button
          key={output.id}
          onClick={() => onSelectOutput?.(output)}
          className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <p className="text-sm text-slate-700 line-clamp-2 group-hover:text-[#1B2A4A]">
            {output.prompt_text.slice(0, 80)}
            {output.prompt_text.length > 80 ? '...' : ''}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">{timeAgo(output.created_at)}</span>
            {output.is_saved && (
              <Bookmark className="w-3 h-3 text-[#C9A84C] fill-[#C9A84C]" />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
