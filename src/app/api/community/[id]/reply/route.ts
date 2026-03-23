import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createReply } from '@/lib/community/queries'

/** POST /api/community/[id]/reply — add a reply */
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
    const content = (body.content ?? '').trim()

    if (!content || content.length > 2000) {
      return NextResponse.json(
        { error: 'Reply content is required (max 2000 chars)' },
        { status: 400 }
      )
    }

    const reply = await createReply(params.id, user.id, content)
    return NextResponse.json({ reply }, { status: 201 })
  } catch (err) {
    console.error('Reply POST error:', err)
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
}
