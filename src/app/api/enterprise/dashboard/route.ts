import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is org admin
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('admin_user_id', user.id)
    .single()

  if (!org) {
    return NextResponse.json({ error: 'Not an enterprise admin' }, { status: 403 })
  }

  // Get member count and anonymous aggregate stats
  const { data: members } = await supabase
    .from('organization_members')
    .select('user_id, team')
    .eq('org_id', org.id)

  const memberIds = members?.map((m) => m.user_id) ?? []
  const totalMembers = memberIds.length

  // Aggregate health scores (anonymous)
  if (memberIds.length > 0) {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data: logs } = await supabase
      .from('daily_health_logs')
      .select('user_id, readiness_score, sleep_score, stress_score')
      .in('user_id', memberIds)
      .gte('log_date', lastWeek)

    const activeUserIds = new Set(logs?.map((l) => l.user_id))
    const engagementRate = Math.round((activeUserIds.size / totalMembers) * 100)

    const avgReadiness =
      logs && logs.length > 0
        ? Math.round(
            logs
              .filter((l) => l.readiness_score !== null)
              .reduce((sum, l) => sum + (l.readiness_score ?? 0), 0) /
              logs.filter((l) => l.readiness_score !== null).length
          )
        : 0

    return NextResponse.json({
      org,
      totalMembers,
      engagementRate,
      avgReadiness,
    })
  }

  return NextResponse.json({ org, totalMembers, engagementRate: 0, avgReadiness: 0 })
}
