'use client'

import { Plus, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CouplesSharedGoal } from '@/types/couples'

interface SharedGoalsProps {
  goals: CouplesSharedGoal[]
  onAddGoal: () => void
}

export function SharedGoals({ goals, onAddGoal }: SharedGoalsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Shared Goals</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs gap-1"
            onClick={onAddGoal}
          >
            <Plus className="w-3 h-3" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {goals.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No shared goals yet. Set a goal you both care about.
          </p>
        )}
        {goals.map((goal) => {
          const progress =
            goal.target_value
              ? Math.min(100, (goal.current_value / goal.target_value) * 100)
              : 0

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#1B2A4A] dark:text-white">
                    {goal.title}
                  </p>
                  {goal.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {goal.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="outline" className="text-xs capitalize">
                    {goal.frequency}
                  </Badge>
                  {progress >= 100 && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              {goal.target_value && (
                <div className="space-y-1">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
