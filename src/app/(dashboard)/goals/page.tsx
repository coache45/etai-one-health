'use client'

import { useEffect, useState, useCallback } from 'react'
import { Target, Loader2, Plus, Trophy, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GoalCard } from '@/components/studio/goal-card'
import { CategorySelector } from '@/components/studio/category-selector'
import { GOAL_CATEGORIES } from '@/types/studio'
import type { UserGoal, GoalCategory } from '@/types/studio'

export default function GoalsPage() {
  const [goals, setGoals] = useState<UserGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'active' | 'completed'>('active')

  // Form state
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<GoalCategory | null>(null)
  const [newDate, setNewDate] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const loadGoals = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/studio/goals?status=${tab}`)
      if (res.ok) {
        const data = await res.json()
        setGoals(data.goals ?? [])
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [tab])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newCategory) return
    setIsCreating(true)

    try {
      const res = await fetch('/api/studio/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          target_date: newDate || null,
        }),
      })

      if (res.ok) {
        setNewTitle('')
        setNewCategory(null)
        setNewDate('')
        setShowForm(false)
        setTab('active')
        loadGoals()
      }
    } catch {
      // ignore
    } finally {
      setIsCreating(false)
    }
  }

  const activeGoals = goals.filter((g) => g.status === 'active')
  const completedGoals = goals.filter((g) => g.status === 'completed')
  const displayGoals = tab === 'active' ? activeGoals : completedGoals

  // Win Journal: completed milestones across all completed goals
  const completedMilestones = completedGoals.flatMap((g) =>
    (g.milestones ?? [])
      .filter((m) => m.is_complete)
      .map((m) => ({
        ...m,
        goalTitle: g.title,
        goalCategory: g.category,
      }))
  )

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center">
              <Target className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Goals</h1>
              <p className="text-sm text-slate-500">
                Set it, break it down, get it done.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Goal'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <Card className="mb-6 border-2 border-dashed border-[#C9A84C]/30">
            <CardContent className="p-5">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B2A4A] mb-1">
                    What&apos;s your goal?
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Launch my Etsy shop by summer"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B2A4A] mb-2">
                    Category
                  </label>
                  <CategorySelector selected={newCategory} onSelect={setNewCategory} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B2A4A] mb-1">
                    Target date (optional)
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim() || !newCategory}
                  className="w-full px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Goal'}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-slate-200">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === 'active'
                ? 'bg-[#1B2A4A] text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Active Goals
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === 'completed'
                ? 'bg-[#1B2A4A] text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Goals list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
            <span className="ml-2 text-sm text-slate-400">Loading goals...</span>
          </div>
        ) : displayGoals.length === 0 ? (
          <div className="text-center py-20">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            {tab === 'active' ? (
              <>
                <p className="text-slate-500 font-medium">
                  No goals yet? That&apos;s about to change.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  What are you working toward? Hit &quot;New Goal&quot; to get started.
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-500 font-medium">
                  Your wins will show up here.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Let&apos;s go earn the first one.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onUpdate={loadGoals} />
            ))}
          </div>
        )}

        {/* Win Journal */}
        {tab === 'completed' && completedMilestones.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-[#C9A84C]" />
              <h2 className="text-lg font-bold text-[#1B2A4A]">Win Journal</h2>
            </div>
            <div className="space-y-2">
              {completedMilestones.map((m) => {
                const catConfig = GOAL_CATEGORIES[m.goalCategory as GoalCategory]
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100"
                  >
                    <span className="text-lg">{catConfig?.emoji ?? '🏆'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1B2A4A]">{m.title}</p>
                      <p className="text-xs text-slate-400">{m.goalTitle}</p>
                    </div>
                    {m.completed_at && (
                      <span className="text-xs text-slate-400 shrink-0">
                        {new Date(m.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
