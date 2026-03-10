import Link from 'next/link'
import { Clock, Users, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Program } from '@/types/database'

interface ProgramCardProps {
  program: Program
  isEnrolled?: boolean
  currentDay?: number
  canAccess?: boolean
}

const categoryColors: Record<string, string> = {
  sleep: 'bg-indigo-100 text-indigo-700',
  stress: 'bg-orange-100 text-orange-700',
  energy: 'bg-yellow-100 text-yellow-700',
  recovery: 'bg-green-100 text-green-700',
  habit: 'bg-purple-100 text-purple-700',
  shift_work: 'bg-blue-100 text-blue-700',
  couples: 'bg-pink-100 text-pink-700',
}

export function ProgramCard({ program, isEnrolled = false, currentDay, canAccess = true }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                categoryColors[program.category] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {program.category.replace('_', ' ')}
            </span>
            {program.is_couples && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Couples
              </span>
            )}
          </div>
          {!canAccess && <Lock className="w-4 h-4 text-gray-400 shrink-0" />}
        </div>

        <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-1">{program.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {program.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            {program.duration_days} days
          </div>

          {isEnrolled ? (
            <Link href={`/programs/${program.id}`}>
              <Button size="sm" variant="gold">
                Day {currentDay} →
              </Button>
            </Link>
          ) : (
            <Link href={`/programs/${program.id}`}>
              <Button size="sm" variant={canAccess ? 'default' : 'outline'} disabled={!canAccess}>
                {canAccess ? 'View Program' : 'Upgrade to Access'}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
