'use client'

import { Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GOAL_CATEGORIES, DIFFICULTY_LABELS } from '@/types/studio'
import type { PromptPack } from '@/types/studio'

interface PackCardProps {
  pack: PromptPack
  isLocked?: boolean
  onSelect: (pack: PromptPack) => void
}

export function PackCard({ pack, isLocked, onSelect }: PackCardProps) {
  const catConfig = GOAL_CATEGORIES[pack.category]
  const diffConfig = DIFFICULTY_LABELS[pack.difficulty]

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isLocked ? 'opacity-70' : ''
      }`}
      onClick={() => !isLocked && onSelect(pack)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{catConfig.emoji}</span>
          <div className="flex items-center gap-2">
            {pack.is_free ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                Free
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] font-medium">
                Builder
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffConfig.color}`}>
              {diffConfig.label}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-[#1B2A4A] mb-1">{pack.title}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{pack.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {pack.prompts?.length ?? 0} prompts
          </span>
          {isLocked && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              Upgrade to unlock
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
