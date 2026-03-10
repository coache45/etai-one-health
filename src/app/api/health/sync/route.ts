import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Placeholder for Apple Health / Google Health sync
// Real implementation requires OAuth and health kit integration
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { source, data } = await request.json()

  if (!['apple_health', 'google_health', 'ring_one', 'fitbit', 'garmin'].includes(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  }

  // For now, accept manually-provided data and store it
  const today = new Date().toISOString().split('T')[0]

  const { data: log, error } = await supabase
    .from('daily_health_logs')
    .upsert(
      {
        user_id: user.id,
        log_date: today,
        ...data,
      },
      { onConflict: 'user_id,log_date' }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, log })
}
