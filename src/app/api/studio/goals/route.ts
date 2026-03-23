import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchUserGoals, insertGoal, fetchMilestones } from '@/lib/studio/queries'
import { fetchActivePartnership, getPartnerId } from '@/lib/partnerships/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import type { GoalCategory, UserGoal } from '@/types/studio'

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

    // If include_shared=true, also fetch partner's shared goals
    let sharedGoals: UserGoal[] = []
    const includeShared = searchParams.get('include_shared') === 'true'

    if (includeShared) {
      try {
        const partnership = await fetchActivePartnership(user.id)
        if (partnership && partnership.status === 'active') {
          const partnerId = getPartnerId(partnership, user.id)
          if (partnerId) {
            // Fetch goals shared with this user
            const adminClient = createAdminClient()
            const { data: shared } = await adminClient
              .from('user_goals')
              .select('*')
              .eq('shared_with', user.id)
              .eq('status', status ?? 'active')
              .order('created_at', { ascending: false })

            if (shared) {
              const sharedWithMilestones = await Promise.all(
                (shared as unknown as UserGoal[]).map(async (goal) => {
                  const milestones = await fetchMilestones(goal.id)
                  return { ...goal, milestones }
                })
              )
              sharedGoals = sharedWithMilestones
            }
          }
        }
      } catch {
        // Partner goals are optional — don't fail the request
      }
    }

    return NextResponse.json({ goals: goalsWithMilestones, shared_goals: sharedGoals })
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
