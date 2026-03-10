import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const teams = [
  { name: 'Engineering', members: 24, avgScore: 75, topMetric: 'Recovery', risk: 'low' },
  { name: 'Sales', members: 18, avgScore: 61, topMetric: 'Stress', risk: 'medium' },
  { name: 'Operations', members: 31, avgScore: 69, topMetric: 'Sleep', risk: 'low' },
  { name: 'Night Shift', members: 12, avgScore: 44, topMetric: 'Fatigue', risk: 'high' },
  { name: 'Customer Success', members: 15, avgScore: 80, topMetric: 'Activity', risk: 'low' },
]

export default function TeamsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Teams</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Anonymous team health overview.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <Card key={team.name}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-[#1B2A4A] dark:text-white">{team.name}</h3>
                <Badge
                  variant={team.risk === 'low' ? 'success' : team.risk === 'medium' ? 'warning' : 'destructive'}
                >
                  {team.risk} risk
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">{team.avgScore}</p>
                  <p className="text-xs text-gray-500">Wellness Score</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1B2A4A] dark:text-white">{team.members}</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5C842]">{team.topMetric}</p>
                  <p className="text-xs text-gray-500">Key Metric</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
