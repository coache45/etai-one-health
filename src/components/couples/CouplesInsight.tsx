import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CouplesInsightProps {
  title: string
  body: string
  isLoading?: boolean
}

export function CouplesInsight({ title, body, isLoading = false }: CouplesInsightProps) {
  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-[#F5C842]">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-[#F5C842]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-[#F5C842]" />
          <span className="text-xs font-semibold text-[#F5C842] uppercase tracking-wide">
            Couples Insight
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{body}</p>
      </CardContent>
    </Card>
  )
}
