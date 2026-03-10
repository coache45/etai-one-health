'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/stores/user-store'
import { Button } from '@/components/ui/button'
import { DailyActionCard } from '@/components/programs/DailyAction'
import { ProgramTimeline } from '@/components/programs/ProgramTimeline'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { Program, UserProgram } from '@/types/database'
import Link from 'next/link'

export default function ProgramDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { profile } = useUserStore()
  const [program, setProgram] = useState<Program | null>(null)
  const [userProgram, setUserProgram] = useState<(UserProgram & { program: Program }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      const supabase = createClient()

      const [programRes, userProgramRes] = await Promise.all([
        supabase.from('programs').select('*').eq('id', id).single(),
        profile?.id
          ? supabase
              .from('user_programs')
              .select('*, program:programs(*)')
              .eq('user_id', profile.id)
              .eq('program_id', id)
              .eq('status', 'active')
              .single()
          : Promise.resolve({ data: null }),
      ])

      setProgram(programRes.data as Program)
      setUserProgram(userProgramRes.data as (UserProgram & { program: Program }) | null)
      setLoading(false)
    }
    load()
  }, [id, profile?.id])

  async function enroll() {
    if (!profile?.id || !program) return
    setEnrolling(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('user_programs')
        .insert({
          user_id: profile.id,
          program_id: program.id,
          current_day: 1,
          status: 'active',
        })
        .select('*, program:programs(*)')
        .single()

      if (error) throw error
      setUserProgram(data as UserProgram & { program: Program })
      toast.success(`You are enrolled in ${program.name}. Day 1 starts now.`)
    } catch {
      toast.error('Could not enroll. Try again.')
    } finally {
      setEnrolling(false)
    }
  }

  async function completeDay(day: number) {
    if (!userProgram || !profile?.id) return
    const supabase = createClient()

    const currentCompletions = Array.isArray(userProgram.daily_completions)
      ? userProgram.daily_completions as number[]
      : []

    if (currentCompletions.includes(day)) return

    const newCompletions = [...currentCompletions, day]
    const nextDay = Math.min(day + 1, userProgram.program.duration_days)

    const { data } = await supabase
      .from('user_programs')
      .update({ daily_completions: newCompletions, current_day: nextDay })
      .eq('id', userProgram.id)
      .select('*, program:programs(*)')
      .single()

    if (data) setUserProgram(data as UserProgram & { program: Program })
    toast.success(`Day ${day} complete! Great work.`)
  }

  if (loading || !program) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  const completedDays = Array.isArray(userProgram?.daily_completions)
    ? userProgram.daily_completions as number[]
    : []
  const currentDay = userProgram?.current_day ?? 1
  const todayAction = program.daily_actions.find((a) => a.day === currentDay)

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Back */}
      <Link href="/programs">
        <Button variant="ghost" size="sm" className="gap-1 text-gray-500 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Programs
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">{program.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{program.description}</p>
      </div>

      {/* Progress Timeline */}
      {userProgram && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <ProgramTimeline userProgram={userProgram} />
        </div>
      )}

      {/* Enroll CTA */}
      {!userProgram && (
        <div className="bg-[#1B2A4A] rounded-2xl p-5 text-white">
          <p className="text-lg font-bold mb-1">{program.duration_days} days. One habit at a time.</p>
          <p className="text-sm text-white/70 mb-4">{program.description}</p>
          <Button variant="gold" onClick={enroll} disabled={enrolling} className="w-full">
            {enrolling ? 'Enrolling...' : `Start ${program.name}`}
          </Button>
        </div>
      )}

      {/* Today's Action */}
      {userProgram && todayAction && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
            Today&apos;s Action
          </h2>
          <DailyActionCard
            action={todayAction}
            isCompleted={completedDays.includes(currentDay)}
            onComplete={() => completeDay(currentDay)}
            isToday
          />
        </div>
      )}

      {/* All Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          Program Overview
        </h2>
        <div className="space-y-3">
          {program.daily_actions.slice(0, 5).map((action) => (
            <DailyActionCard
              key={action.day}
              action={action}
              isCompleted={completedDays.includes(action.day)}
              onComplete={userProgram ? () => completeDay(action.day) : undefined}
              isToday={userProgram ? action.day === currentDay : false}
            />
          ))}
          {program.daily_actions.length < program.duration_days && (
            <p className="text-xs text-center text-gray-400 py-2">
              + {program.duration_days - program.daily_actions.length} more days unlock as you progress
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
