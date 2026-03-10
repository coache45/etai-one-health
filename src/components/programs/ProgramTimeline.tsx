import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { UserProgram, Program } from '@/types/database'

interface ProgramTimelineProps {
  userProgram: UserProgram & { program: Program }
}

export function ProgramTimeline({ userProgram }: ProgramTimelineProps) {
  const { program, current_day, daily_completions } = userProgram
  const progress = Math.round((current_day / program.duration_days) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#1B2A4A] dark:text-white">{program.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Day {current_day} of {program.duration_days}
          </p>
        </div>
        <Badge variant={userProgram.status === 'completed' ? 'success' : 'default'}>
          {userProgram.status}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Started {new Date(userProgram.started_at).toLocaleDateString()}</span>
        <span>{progress}% complete</span>
      </div>

      <div className="flex gap-1 flex-wrap mt-2">
        {Array.from({ length: program.duration_days }, (_, i) => i + 1).map((day) => {
          const done = Array.isArray(daily_completions) && daily_completions.includes(day)
          const isCurrent = day === current_day
          return (
            <div
              key={day}
              className={`w-5 h-5 rounded-sm text-[9px] flex items-center justify-center font-bold ${
                done
                  ? 'bg-green-500 text-white'
                  : isCurrent
                  ? 'bg-[#F5C842] text-[#1B2A4A]'
                  : day < current_day
                  ? 'bg-red-100 text-red-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
