import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userProgramId, completedDay } = await request.json()

  const { data: up } = await supabase
    .from('user_programs')
    .select('*, program:programs(duration_days)')
    .eq('id', userProgramId)
    .eq('user_id', user.id)
    .single()

  if (!up) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 })
  }

  const currentCompletions = Array.isArray(up.daily_completions) ? up.daily_completions as number[] : []
  if (currentCompletions.includes(completedDay)) {
    return NextResponse.json({ message: 'Already completed' })
  }

  const newCompletions = [...currentCompletions, completedDay]
  const maxDay = (up.program as { duration_days: number }).duration_days
  const nextDay = Math.min(completedDay + 1, maxDay)
  const isComplete = newCompletions.length >= maxDay

  const { data, error } = await supabase
    .from('user_programs')
    .update({
      daily_completions: newCompletions,
      current_day: nextDay,
      status: isComplete ? 'completed' : 'active',
      completed_at: isComplete ? new Date().toISOString() : null,
    })
    .eq('id', userProgramId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
