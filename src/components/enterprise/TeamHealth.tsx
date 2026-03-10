import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { WorkforceHealthScore } from '@/types/enterprise'

interface TeamHealthProps {
  teams: WorkforceHealthScore['teamBreakdown']
}

const riskColors = {
  low: 'success' as const,
  medium: 'warning' as const,
  high: 'destructive' as const,
}

export function TeamHealth({ teams }: TeamHealthProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Team Health Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {teams.map((team) => (
          <div key={team.team} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#1B2A4A] dark:text-white">{team.team}</span>
                <span className="text-xs text-gray-400">({team.memberCount} members)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1B2A4A] dark:text-white">{team.score}</span>
                <Badge variant={riskColors[team.riskLevel]} className="text-xs">
                  {team.riskLevel} risk
                </Badge>
              </div>
            </div>
            <Progress value={team.score} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
