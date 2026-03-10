'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/stores/user-store'
import { useSubscription } from '@/hooks/useSubscription'
import { ProgramCard } from '@/components/programs/ProgramCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Program, UserProgram } from '@/types/database'

export default function ProgramsPage() {
  const { profile } = useUserStore()
  const { canAccessFeature } = useSubscription()
  const [programs, setPrograms] = useState<Program[]>([])
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [programsRes, userProgramsRes] = await Promise.all([
        supabase.from('programs').select('*').order('created_at'),
        profile?.id
          ? supabase.from('user_programs').select('*').eq('user_id', profile.id).eq('status', 'active')
          : Promise.resolve({ data: [] }),
      ])
      setPrograms((programsRes.data as Program[]) ?? [])
      setUserPrograms((userProgramsRes.data as UserProgram[]) ?? [])
      setLoading(false)
    }
    load()
  }, [profile?.id])

  const categories = ['all', 'sleep', 'stress', 'energy', 'couples', 'shift_work']

  const filtered = activeFilter === 'all'
    ? programs
    : programs.filter((p) => p.category === activeFilter)

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Programs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Structured 14 to 30-day programs. Pick one, commit, transform.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              activeFilter === cat
                ? 'bg-[#1B2A4A] text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:border-[#1B2A4A]'
            }`}
          >
            {cat === 'all' ? 'All Programs' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Active Program Banner */}
      {userPrograms.length > 0 && (
        <div className="bg-[#1B2A4A] rounded-2xl p-4 text-white">
          <p className="text-xs font-semibold text-[#F5C842] uppercase tracking-wide mb-1">
            Currently Enrolled
          </p>
          <p className="text-sm">
            You are on Day {userPrograms[0].current_day} of your active program.
            Keep going — consistency is everything.
          </p>
        </div>
      )}

      {/* Program Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((program) => {
            const userProgram = userPrograms.find((up) => up.program_id === program.id)
            return (
              <ProgramCard
                key={program.id}
                program={program}
                isEnrolled={!!userProgram}
                currentDay={userProgram?.current_day}
                canAccess={canAccessFeature(program.tier_required)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
