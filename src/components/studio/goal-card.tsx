'use client'

import { useState } from 'react'
import { Check, Plus, Trash2, Trophy, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GOAL_CATEGORIES } from '@/types/studio'
import type { UserGoal, GoalMilestone } from '@/types/studio'

interface GoalCardProps {
  goal: UserGoal
  onUpdate?: () => void
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [newMilestone, setNewMilestone] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const catConfig = GOAL_CATEGORIES[goal.category]

  const milestones = goal.milestones ?? []
  const totalMilestones = milestones.length
  const completedMilestones = milestones.filter((m) => m.is_complete).length
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  const daysLeft = goal.target_date
    ? Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000))
    : null

  async function toggleMilestone(milestone: GoalMilestone) {
    try {
      await fetch(`/api/studio/goals/${goal.id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestone_id: milestone.id,
          is_complete: !milestone.is_complete,
        }),
      })
      onUpdate?.()
    } catch {
      // ignore
    }
  }

  async function addMilestone() {
    const title = newMilestone.trim()
    if (!title) return
    setIsAdding(true)
    try {
      await fetch(`/api/studio/goals/${goal.id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      setNewMilestone('')
      onUpdate?.()
    } catch {
      // ignore
    } finally {
      setIsAdding(false)
    }
  }

  async function completeGoal() {
    try {
      await fetch(`/api/studio/goals/${goal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      onUpdate?.()
    } catch {
      // ignore
    }
  }

  async function deleteGoal() {
    if (!confirm('Delete this goal? This cannot be undone.')) return
    try {
      await fetch(`/api/studio/goals/${goal.id}`, { method: 'DELETE' })
      onUpdate?.()
    } catch {
      // ignore
    }
  }

  async function removeMilestone(milestoneId: string) {
    try {
      await fetch(`/api/studio/goals/${goal.id}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', milestone_id: milestoneId }),
      })
      onUpdate?.()
    } catch {
      // ignore
    }
  }

  return (
    <Card className={`border-l-4 ${catConfig.borderColor}`}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{catConfig.emoji}</span>
            <div>
              <h3 className="font-bold text-[#1B2A4A]">{goal.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.bgColor} ${catConfig.color} font-medium`}>
                  {catConfig.label}
                </span>
                {daysLeft !== null && (
                  <span className="text-xs text-slate-400">
                    {daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {goal.status === 'active' && progress === 100 && (
              <button
                onClick={completeGoal}
                className="text-xs px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
              >
                <Trophy className="w-3 h-3 inline mr-1" />
                Complete
              </button>
            )}
            <button
              onClick={deleteGoal}
              className="p-1 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {totalMilestones > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">
                {completedMilestones} of {totalMilestones} milestones
              </span>
              <span className="text-xs font-bold text-[#1B2A4A]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Milestones */}
        <div className="space-y-1.5">
          {milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-2 group">
              <button
                onClick={() => toggleMilestone(m)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  m.is_complete
                    ? 'bg-[#C9A84C] border-[#C9A84C] text-white'
                    : 'border-slate-300 hover:border-[#C9A84C]'
                }`}
              >
                {m.is_complete && <Check className="w-3 h-3" />}
              </button>
              <span
                className={`text-sm flex-1 ${
                  m.is_complete ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
              >
                {m.title}
              </span>
              <button
                onClick={() => removeMilestone(m.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-300 hover:text-red-400 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add milestone */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
            placeholder="Add a milestone..."
            className="flex-1 text-sm rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
          />
          <button
            onClick={addMilestone}
            disabled={isAdding || !newMilestone.trim()}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
