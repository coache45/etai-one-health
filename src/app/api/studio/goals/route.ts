import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchUserGoals, insertGoal, fetchMilestones } from '@/lib/studio/queries'
import type { GoalCategory } from '@/types/studio'

const VALID_CATEGORIES = ['business', 'relationships', 'health', 'finance', 'creativity', 'learning']

/** GET /api/studio/goals?status=active */
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? undefined

    const goals = await fetchUserGoals(user.id, status)

    // Fetch milestones for each goal
    const goalsWithMilestones = await Promise.all(
      goals.map(async (goal) => {
        const milestones = await fetchMilestones(goal.id)
        return { ...goal, milestones }
      })
    )

    return NextResponse.json({ goals: goalsWithMilestones })
  } catch (err) {
    console.error('Goals GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

/** POST /api/studio/goals — create a new goal */
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const title = (body.title ?? '').trim()
    const category = body.category as GoalCategory
    const targetDate = body.target_date ?? null

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const goal = await insertGoal({
      user_id: user.id,
      title,
      category,
      target_date: targetDate,
    })

    return NextResponse.json({ goal }, { status: 201 })
  } catch (err) {
    console.error('Goals POST error:', err)
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}
