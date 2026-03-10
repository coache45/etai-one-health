import { Trophy, Calendar, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const challenges = [
  {
    id: '1',
    title: '10K Steps Challenge',
    type: 'steps',
    target: 10000,
    participants: 67,
    endsAt: '2026-03-31',
    isActive: true,
    progress: 73,
  },
  {
    id: '2',
    title: '7-Hour Sleep Week',
    type: 'sleep',
    target: 7,
    participants: 42,
    endsAt: '2026-03-17',
    isActive: true,
    progress: 45,
  },
  {
    id: '3',
    title: 'Hydration Sprint',
    type: 'hydration',
    target: 8,
    participants: 89,
    endsAt: '2026-03-20',
    isActive: true,
    progress: 82,
  },
]

export default function ChallengesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Challenges</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drive engagement with team wellness challenges.
          </p>
        </div>
        <Button variant="gold" size="sm">
          + New Challenge
        </Button>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#F5C842]" />
                  <h3 className="font-bold text-[#1B2A4A] dark:text-white">{challenge.title}</h3>
                </div>
                <Badge variant={challenge.isActive ? 'success' : 'outline'}>
                  {challenge.isActive ? 'Active' : 'Ended'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {challenge.participants} participants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Ends {new Date(challenge.endsAt).toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Team Progress</span>
                  <span className="font-medium text-[#1B2A4A] dark:text-white">{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
