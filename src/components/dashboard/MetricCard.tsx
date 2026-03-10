'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number | null
  unit?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable' | null
  trendValue?: string
  status?: 'good' | 'warning' | 'danger'
  isLoading?: boolean
  onClick?: () => void
}

const statusColors = {
  good: 'text-green-500',
  warning: 'text-amber-500',
  danger: 'text-red-500',
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  status = 'good',
  isLoading = false,
  onClick,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-[#1B2A4A] dark:text-[#F5C842]">{icon}</div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </span>
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'stable' && <Minus className="w-3 h-3" />}
              {trendValue}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          {value !== null ? (
            <>
              <span className={cn('text-2xl font-bold', statusColors[status])}>
                {value}
              </span>
              {unit && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">—</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
