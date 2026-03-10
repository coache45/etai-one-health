import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendArrowProps {
  direction: 'up' | 'down' | 'stable'
  positiveIsUp?: boolean // For stress, lower is better so down = positive
  className?: string
}

export function TrendArrow({
  direction,
  positiveIsUp = true,
  className,
}: TrendArrowProps) {
  const isPositive =
    direction === 'stable'
      ? true
      : positiveIsUp
      ? direction === 'up'
      : direction === 'down'

  return (
    <span
      className={cn(
        'inline-flex items-center',
        direction === 'stable' && 'text-gray-400',
        isPositive && direction !== 'stable' && 'text-green-500',
        !isPositive && direction !== 'stable' && 'text-red-500',
        className
      )}
    >
      {direction === 'up' && <TrendingUp className="w-3 h-3" />}
      {direction === 'down' && <TrendingDown className="w-3 h-3" />}
      {direction === 'stable' && <Minus className="w-3 h-3" />}
    </span>
  )
}
