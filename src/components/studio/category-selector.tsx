'use client'

import { GOAL_CATEGORIES } from '@/types/studio'
import type { GoalCategory } from '@/types/studio'

interface CategorySelectorProps {
  selected: GoalCategory | null
  onSelect: (category: GoalCategory | null) => void
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  const categories = Object.entries(GOAL_CATEGORIES) as [GoalCategory, typeof GOAL_CATEGORIES[GoalCategory]][]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {categories.map(([key, config]) => {
        const active = selected === key
        return (
          <button
            key={key}
            onClick={() => onSelect(active ? null : key)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
              active
                ? `${config.bgColor} ${config.borderColor} ${config.color} ring-2 ring-[#C9A84C]/30`
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl">{config.emoji}</span>
            <span className="text-xs font-semibold">{config.label}</span>
          </button>
        )
      })}
    </div>
  )
}
