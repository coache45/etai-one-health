import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchMilestones,
  insertMilestone,
  toggleMilestoneComplete,
  deleteMilestone,
} from '@/lib/studio/queries'

/** GET /api/studio/goals/[id]/milestones */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const milestones = await fetchMilestones(params.id)
    return NextResponse.json({ milestones })
  } catch (err) {
    console.error('Milestones GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 })
  }
}

/** POST /api/studio/goals/[id]/milestones — create or toggle */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Toggle existing milestone
    if (body.milestone_id && typeof body.is_complete === 'boolean') {
      const milestone = await toggleMilestoneComplete(body.milestone_id, body.is_complete)
      return NextResponse.json({ milestone })
    }

    // Create new milestone
    const title = (body.title ?? '').trim()
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const milestone = await insertMilestone({ goal_id: params.id, title })
    return NextResponse.json({ milestone }, { status: 201 })
  } catch (err) {
    console.error('Milestones POST error:', err)
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 })
  }
}

/** PATCH /api/studio/goals/[id]/milestones — delete a milestone */
export async function PATCH(
  request: NextRequest,
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (body.action === 'delete' && body.milestone_id) {
      await deleteMilestone(body.milestone_id)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Milestones PATCH error:', err)
    return NextResponse.json({ error: 'Failed to delete milestone' }, { status: 500 })
  }
}
