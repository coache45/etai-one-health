import { ReadinessScore } from '@/components/dashboard/ReadinessScore'
import { Card, CardContent } from '@/components/ui/card'
import type { WorkforceHealthScore } from '@/types/enterprise'

interface WorkforceScoreProps {
  score: WorkforceHealthScore
}

export function WorkforceScore({ score }: WorkforceScoreProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <ReadinessScore score={score.overallScore} size="lg" />
          <div>
            <h3 className="text-center text-lg font-bold text-[#1B2A4A] dark:text-white mb-1">
              Workforce Wellness Score
            </h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Anonymous aggregate across {score.engagementRate}% active employees
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1B2A4A] dark:text-white">{score.sleepScore}</p>
              <p className="text-xs text-gray-500">Sleep</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1B2A4A] dark:text-white">{score.stressScore}</p>
              <p className="text-xs text-gray-500">Stress Resilience</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1B2A4A] dark:text-white">{score.activityScore}</p>
              <p className="text-xs text-gray-500">Activity</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
