import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchUserOutputs, toggleOutputSaved } from '@/lib/studio/queries'

/** GET /api/studio/outputs?saved=true&limit=10 */
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
    const savedOnly = searchParams.get('saved') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50)

    const outputs = await fetchUserOutputs(user.id, { limit, savedOnly })
    return NextResponse.json({ outputs })
  } catch (err) {
    console.error('Outputs GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch outputs' }, { status: 500 })
  }
}

/** POST /api/studio/outputs — toggle save status */
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
    const { id, is_saved } = body

    if (!id || typeof is_saved !== 'boolean') {
      return NextResponse.json({ error: 'Missing id or is_saved' }, { status: 400 })
    }

    await toggleOutputSaved(id, user.id, is_saved)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Outputs POST error:', err)
    return NextResponse.json({ error: 'Failed to update output' }, { status: 500 })
  }
}
