import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  acceptPartnership,
  dissolvePartnership,
  cancelInvite,
} from '@/lib/partnerships/queries'

/** PATCH /api/partnerships/[id] — accept or dissolve */
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
    const action = body.action

    if (action === 'accept') {
      const partnership = await acceptPartnership(params.id, user.id)
      return NextResponse.json({
        partnership,
        message: "You're linked up! Time to build together.",
      })
    }

    if (action === 'dissolve') {
      await dissolvePartnership(params.id, user.id)
      return NextResponse.json({
        success: true,
        message: 'Partnership ended. You can invite someone new whenever you\'re ready.',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Partnership PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update partnership' }, { status: 500 })
  }
}

/** DELETE /api/partnerships/[id] — cancel pending invite */
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
    await cancelInvite(params.id, user.id)
    return NextResponse.json({ success: true, message: 'Invite cancelled.' })
  } catch (err) {
    console.error('Partnership DELETE error:', err)
    return NextResponse.json({ error: 'Failed to cancel invite' }, { status: 500 })
  }
}
