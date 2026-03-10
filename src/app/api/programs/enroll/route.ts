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

  const { programId } = await request.json()

  if (!programId) {
    return NextResponse.json({ error: 'programId required' }, { status: 400 })
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('user_programs')
    .select('id')
    .eq('user_id', user.id)
    .eq('program_id', programId)
    .eq('status', 'active')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already enrolled in this program' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('user_programs')
    .insert({
      user_id: user.id,
      program_id: programId,
      status: 'active',
      current_day: 1,
    })
    .select('*, program:programs(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
