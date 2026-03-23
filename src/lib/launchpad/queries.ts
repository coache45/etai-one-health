/**
 * Launchpad server-side data layer
 * All data fetched at request time — no loading spinners on first paint.
 */
import { createAdminClient } from '@/lib/supabase/admin'

const admin = () => createAdminClient()

// ─── Greeting ───

export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Profile + Partner ───

export async function fetchUserProfile(userId: string) {
  const { data } = await admin()
    .from('profiles')
    .select('id, email, full_name, display_name, subscription_tier, avatar_url')
    .eq('id', userId)
    .single()
  return data as unknown as {
    id: string
    email: string
    full_name: string | null
    display_name: string | null
    subscription_tier: string
    avatar_url: string | null
  } | null
}

export async function fetchPartnerName(userId: string): Promise<string | null> {
  // Check as user_id_1
  const { data: as1 } = await admin()
    .from('partnerships')
    .select('user_id_2')
    .eq('user_id_1', userId)
    .eq('status', 'active')
    .limit(1)
    .single()

  if (as1) {
    const partnerId = (as1 as unknown as { user_id_2: string }).user_id_2
    const { data: profile } = await admin()
      .from('profiles')
      .select('display_name, full_name')
      .eq('id', partnerId)
      .single()
    const p = profile as unknown as { display_name: string | null; full_name: string | null }
    return p?.display_name || p?.full_name || null
  }

  // Check as user_id_2
  const { data: as2 } = await admin()
    .from('partnerships')
    .select('user_id_1')
    .eq('user_id_2', userId)
    .eq('status', 'active')
    .limit(1)
    .single()

  if (as2) {
    const partnerId = (as2 as unknown as { user_id_1: string }).user_id_1
    const { data: profile } = await admin()
      .from('profiles')
      .select('display_name, full_name')
      .eq('id', partnerId)
      .single()
    const p = profile as unknown as { display_name: string | null; full_name: string | null }
    return p?.display_name || p?.full_name || null
  }

  return null
}

// ─── Prompt of the Day ───

export async function fetchPromptOfTheDay() {
  const { data: packs } = await admin()
    .from('prompt_packs')
    .select('id, title, category, prompts')
    .eq('is_free', true)

  if (!packs || packs.length === 0) return null

  // Deterministic daily rotation based on day-of-year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )

  // Flatten all prompts from free packs
  const allPrompts: { packId: string; packTitle: string; prompt: { id: string; title: string; description: string } }[] = []
  for (const pack of packs) {
    const p = pack as unknown as { id: string; title: string; prompts: { id: string; title: string; description: string }[] }
    for (const prompt of p.prompts ?? []) {
      allPrompts.push({ packId: p.id, packTitle: p.title, prompt })
    }
  }

  if (allPrompts.length === 0) return null
  const todayIdx = dayOfYear % allPrompts.length
  return allPrompts[todayIdx]
}

// ─── Progress Stats ───

export async function fetchProgressStats(userId: string) {
  const now = new Date()
  const oneWeekAgo = new Date(now)
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Sessions this week
  const { count: sessionsThisWeek } = await admin()
    .from('prompt_outputs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneWeekAgo.toISOString())

  // Active goals count
  const { count: activeGoals } = await admin()
    .from('user_goals')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')

  // Completed milestones this month
  const { count: milestonesThisMonth } = await admin()
    .from('goal_milestones')
    .select('id', { count: 'exact', head: true })
    .eq('is_complete', true)
    .gte('completed_at', monthStart.toISOString())

  // Streak: consecutive days with at least one session
  let streak = 0
  const checkDate = new Date(now)
  for (let i = 0; i < 30; i++) {
    const dayStart = new Date(checkDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(checkDate)
    dayEnd.setHours(23, 59, 59, 999)

    const { count } = await admin()
      .from('prompt_outputs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', dayStart.toISOString())
      .lte('created_at', dayEnd.toISOString())

    if ((count ?? 0) > 0) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return {
    sessionsThisWeek: sessionsThisWeek ?? 0,
    activeGoals: activeGoals ?? 0,
    milestonesThisMonth: milestonesThisMonth ?? 0,
    streak,
  }
}

// ─── Community Pulse ───

export async function fetchRecentPosts() {
  const { data } = await admin()
    .from('community_posts')
    .select('id, content, category, likes_count, replies_count, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(3)

  if (!data || data.length === 0) return []

  // Get author names
  const userIds = [...new Set((data as unknown as { user_id: string }[]).map((p) => p.user_id))]
  const { data: profiles } = await admin()
    .from('profiles')
    .select('id, display_name, full_name')
    .in('id', userIds)

  const nameMap: Record<string, string> = {}
  for (const p of (profiles ?? []) as unknown as { id: string; display_name: string | null; full_name: string | null }[]) {
    nameMap[p.id] = p.display_name || p.full_name || 'Community member'
  }

  return (data as unknown as {
    id: string
    content: string
    category: string
    likes_count: number
    replies_count: number
    created_at: string
    user_id: string
  }[]).map((post) => ({
    ...post,
    author_name: nameMap[post.user_id] ?? 'Community member',
  }))
}

// ─── Partner Activity ───

export async function fetchPartnerActivity(userId: string) {
  // Find partner
  const { data: as1 } = await admin()
    .from('partnerships')
    .select('user_id_2')
    .eq('user_id_1', userId)
    .eq('status', 'active')
    .limit(1)
    .single()

  const { data: as2 } = !as1
    ? await admin()
        .from('partnerships')
        .select('user_id_1')
        .eq('user_id_2', userId)
        .eq('status', 'active')
        .limit(1)
        .single()
    : { data: null }

  const partnerId = as1
    ? (as1 as unknown as { user_id_2: string }).user_id_2
    : as2
    ? (as2 as unknown as { user_id_1: string }).user_id_1
    : null

  if (!partnerId) return { hasPartner: false, activities: [] }

  const { data: partnerProfile } = await admin()
    .from('profiles')
    .select('display_name, full_name')
    .eq('id', partnerId)
    .single()

  const partnerName =
    (partnerProfile as unknown as { display_name: string | null; full_name: string | null })?.display_name ??
    (partnerProfile as unknown as { full_name: string | null })?.full_name ??
    'Your partner'

  // Recent partner milestones
  const { data: milestones } = await admin()
    .from('goal_milestones')
    .select('id, title, is_complete, completed_at, completed_by, goal_id')
    .eq('completed_by', partnerId)
    .eq('is_complete', true)
    .order('completed_at', { ascending: false })
    .limit(3)

  // Recent partner sessions
  const { data: sessions } = await admin()
    .from('prompt_outputs')
    .select('id, prompt_text, created_at')
    .eq('user_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(2)

  const activities: { type: string; text: string; time: string }[] = []

  for (const m of (milestones ?? []) as unknown as { title: string; completed_at: string }[]) {
    activities.push({
      type: 'milestone',
      text: `${partnerName} completed "${m.title}"`,
      time: m.completed_at,
    })
  }

  for (const s of (sessions ?? []) as unknown as { prompt_text: string; created_at: string }[]) {
    activities.push({
      type: 'session',
      text: `${partnerName} ran an AI session`,
      time: s.created_at,
    })
  }

  // Sort by time descending
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return { hasPartner: true, partnerName, activities: activities.slice(0, 3) }
}

// ─── Guardian Status ───

export async function fetchGuardianStatus(userId: string) {
  // Check if user has any cognitive vectors (means they have guardian access)
  const { data } = await admin()
    .from('cognitive_vectors')
    .select('cpr_score, recorded_at')
    .eq('entity_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(2)

  if (!data || data.length === 0) return null

  const records = data as unknown as { cpr_score: number; recorded_at: string }[]
  const latest = records[0]
  const previous = records.length > 1 ? records[1] : null

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (previous) {
    const diff = latest.cpr_score - previous.cpr_score
    if (diff > 0.02) trend = 'up'
    else if (diff < -0.02) trend = 'down'
  }

  return {
    cprScore: latest.cpr_score,
    trend,
    lastReading: latest.recorded_at,
  }
}
