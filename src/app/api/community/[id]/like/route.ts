import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { toggleLike } from '@/lib/community/queries'

/** POST /api/community/[id]/like — toggle like */
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
    const result = await toggleLike(params.id, user.id)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Like POST error:', err)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
