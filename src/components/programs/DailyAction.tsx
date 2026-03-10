'use client'

import { CheckCircle, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DailyAction } from '@/types/database'

interface DailyActionProps {
  action: DailyAction
  isCompleted?: boolean
  onComplete?: () => void
  isToday?: boolean
}

const actionTypeLabels: Record<string, string> = {
  log: 'Log',
  task: 'Task',
  exercise: 'Exercise',
  conversation: 'Discuss',
  meditation: 'Meditate',
}

export function DailyActionCard({
  action,
  isCompleted = false,
  onComplete,
  isToday = false,
}: DailyActionProps) {
  return (
    <Card
      className={`transition-all ${
        isCompleted ? 'opacity-60' : ''
      } ${isToday ? 'ring-2 ring-[#F5C842]' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onComplete}
            disabled={isCompleted || !onComplete}
            className="mt-0.5 shrink-0"
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 hover:text-[#F5C842] transition-colors" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400">Day {action.day}</span>
              <Badge variant="outline" className="text-xs h-4 px-1">
                {actionTypeLabels[action.action_type] ?? action.action_type}
              </Badge>
              {isToday && (
                <Badge variant="gold" className="text-xs h-4 px-1">
                  Today
                </Badge>
              )}
            </div>
            <h4
              className={`font-semibold text-sm mb-1 ${
                isCompleted ? 'line-through text-gray-400' : 'text-[#1B2A4A] dark:text-white'
              }`}
            >
              {action.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
