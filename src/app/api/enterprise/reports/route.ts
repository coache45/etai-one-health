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

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('admin_user_id', user.id)
    .single()

  if (!org) {
    return NextResponse.json({ error: 'Not an enterprise admin' }, { status: 403 })
  }

  // Generate a simple CSV report
  const { data: members } = await supabase
    .from('organization_members')
    .select('user_id, team, role')
    .eq('org_id', org.id)

  const memberIds = members?.map((m) => m.user_id) ?? []
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: logs } = await supabase
    .from('daily_health_logs')
    .select('user_id, readiness_score, sleep_score, stress_score, steps, log_date')
    .in('user_id', memberIds)
    .gte('log_date', lastMonth)

  // Anonymize and aggregate by team
  const teamStats: Record<string, { scores: number[]; members: Set<string> }> = {}

  logs?.forEach((log) => {
    const member = members?.find((m) => m.user_id === log.user_id)
    const team = member?.team ?? 'Unassigned'
    if (!teamStats[team]) teamStats[team] = { scores: [], members: new Set() }
    if (log.readiness_score !== null) teamStats[team].scores.push(log.readiness_score)
    teamStats[team].members.add(log.user_id)
  })

  const report = Object.entries(teamStats).map(([team, data]) => ({
    team,
    memberCount: data.members.size,
    avgReadiness: data.scores.length > 0
      ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
      : null,
  }))

  return NextResponse.json({ org: org.name, period: '30 days', report })
}
