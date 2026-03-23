import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateGoal, deleteGoal } from '@/lib/studio/queries'

/** PATCH /api/studio/goals/[id] — update goal */
export async function PATCH(
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
    const updates: Record<string, unknown> = {}

    if (body.title !== undefined) updates.title = body.title
    if (body.status !== undefined) updates.status = body.status
    if (body.target_date !== undefined) updates.target_date = body.target_date

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const goal = await updateGoal(params.id, user.id, updates)
    return NextResponse.json({ goal })
  } catch (err) {
    console.error('Goal PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

/** DELETE /api/studio/goals/[id] */
export async function DELETE(
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
    await deleteGoal(params.id, user.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Goal DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
