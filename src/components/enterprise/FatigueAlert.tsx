import { AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FatigueAlertProps {
  department: string
  affectedPercent: number
  message: string
}

export function FatigueAlert({ department, affectedPercent, message }: FatigueAlertProps) {
  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#1B2A4A] dark:text-white">
              Fatigue Signal — {department}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {affectedPercent}% of team members showing elevated fatigue indicators
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
