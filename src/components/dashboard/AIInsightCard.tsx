'use client'

import { Sparkles, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHealthStore } from '@/stores/health-store'
import { createClient } from '@/lib/supabase/client'
import type { AIInsight } from '@/types/ai'

interface AIInsightCardProps {
  insight: AIInsight | null
  isLoading?: boolean
}

export function AIInsightCard({ insight, isLoading = false }: AIInsightCardProps) {
  const { markInsightRead } = useHealthStore()

  async function dismiss(id: string) {
    const supabase = createClient()
    await supabase.from('ai_insights').update({ is_read: true }).eq('id', id)
    markInsightRead(id)
  }

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-[#F5C842]">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (!insight) {
    return (
      <Card className="border-l-4 border-l-[#F5C842]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#F5C842]" />
            <span className="text-xs font-semibold text-[#F5C842] uppercase tracking-wide">
              Your Daily Insight
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Log your health data today and your AI coach will generate a personalized
            insight just for you.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-[#F5C842] animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#F5C842] shrink-0" />
            <span className="text-xs font-semibold text-[#F5C842] uppercase tracking-wide">
              {insight.insight_type === 'celebration' ? 'Win of the Day' : 'Your Daily Insight'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 shrink-0"
            onClick={() => dismiss(insight.id)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-white mb-1">
          {insight.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {insight.body}
        </p>
      </CardContent>
    </Card>
  )
}
