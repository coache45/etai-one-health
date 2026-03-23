import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchActivePartnership,
  createPartnershipInvite,
} from '@/lib/partnerships/queries'

/** GET /api/partnerships — get current partnership status */
export async function GET() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const partnership = await fetchActivePartnership(user.id)
    return NextResponse.json({ partnership })
  } catch (err) {
    console.error('Partnership GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch partnership' }, { status: 500 })
  }
}

/** POST /api/partnerships — send partner invite */
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
    const email = (body.email ?? '').trim().toLowerCase()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Can't invite yourself
    if (email === user.email) {
      return NextResponse.json(
        { error: "That's your own email — invite your person instead!" },
        { status: 400 }
      )
    }

    // Check if already in an active partnership
    const existing = await fetchActivePartnership(user.id)
    if (existing && existing.status === 'active') {
      return NextResponse.json(
        { error: 'You already have an active partner. Dissolve the current partnership first.' },
        { status: 409 }
      )
    }
    if (existing && existing.status === 'pending' && existing.role === 'inviter') {
      return NextResponse.json(
        {
          error: `You already have a pending invite to ${existing.invite_email}. Cancel it first to invite someone else.`,
        },
        { status: 409 }
      )
    }

    const partnership = await createPartnershipInvite(user.id, email)

    const message =
      partnership.status === 'active'
        ? "They're already on ONE Health — you're linked up!"
        : "Invite sent! We'll link you up the moment they join."

    return NextResponse.json({ partnership, message }, { status: 201 })
  } catch (err) {
    console.error('Partnership POST error:', err)
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })
  }
}
