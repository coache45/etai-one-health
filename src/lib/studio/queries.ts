/**
 * AI Studio data layer
 * Uses admin client for server-side queries.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type {
  PromptPack,
  PromptOutput,
  UserGoal,
  GoalMilestone,
  GoalCategory,
} from '@/types/studio'

const admin = () => createAdminClient()

// ─── Prompt Packs ───

export async function fetchPacks(options?: {
  category?: GoalCategory
  freeOnly?: boolean
}): Promise<PromptPack[]> {
  let query = admin()
    .from('prompt_packs')
    .select('*')
    .order('created_at', { ascending: true })

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.freeOnly) {
    query = query.eq('is_free', true)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as PromptPack[]
}

export async function fetchPackById(id: string): Promise<PromptPack | null> {
  const { data, error } = await admin()
    .from('prompt_packs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as unknown as PromptPack
}

// ─── Prompt Outputs ───

export async function fetchUserOutputs(
  userId: string,
  options?: { limit?: number; savedOnly?: boolean }
): Promise<PromptOutput[]> {
  let query = admin()
    .from('prompt_outputs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(options?.limit ?? 20)

  if (options?.savedOnly) {
    query = query.eq('is_saved', true)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as PromptOutput[]
}

export async function countUserOutputsThisWeek(userId: string): Promise<number> {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count, error } = await admin()
    .from('prompt_outputs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneWeekAgo.toISOString())

  if (error) throw error
  return count ?? 0
}

export async function insertOutput(output: {
  user_id: string
  pack_id: string | null
  prompt_text: string
  output_text: string
}): Promise<PromptOutput> {
  const { data, error } = await admin()
    .from('prompt_outputs')
    .insert(output)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PromptOutput
}

export async function toggleOutputSaved(
  id: string,
  userId: string,
  isSaved: boolean
): Promise<void> {
  const { error } = await admin()
    .from('prompt_outputs')
    .update({ is_saved: isSaved })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

// ─── Goals ───

export async function fetchUserGoals(
  userId: string,
  status?: string
): Promise<UserGoal[]> {
  let query = admin()
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as UserGoal[]
}

export async function insertGoal(goal: {
  user_id: string
  title: string
  category: GoalCategory
  target_date: string | null
}): Promise<UserGoal> {
  const { data, error } = await admin()
    .from('user_goals')
    .insert(goal)
    .select()
    .single()
  if (error) throw error
  return data as unknown as UserGoal
}

export async function updateGoal(
  id: string,
  userId: string,
  updates: { title?: string; status?: string; target_date?: string | null }
): Promise<UserGoal> {
  const { data, error } = await admin()
    .from('user_goals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data as unknown as UserGoal
}

export async function deleteGoal(id: string, userId: string): Promise<void> {
  const { error } = await admin()
    .from('user_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

// ─── Milestones ───

export async function fetchMilestones(goalId: string): Promise<GoalMilestone[]> {
  const { data, error } = await admin()
    .from('goal_milestones')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as unknown as GoalMilestone[]
}

export async function insertMilestone(milestone: {
  goal_id: string
  title: string
}): Promise<GoalMilestone> {
  const { data, error } = await admin()
    .from('goal_milestones')
    .insert(milestone)
    .select()
    .single()
  if (error) throw error
  return data as unknown as GoalMilestone
}

export async function toggleMilestoneComplete(
  id: string,
  isComplete: boolean
): Promise<GoalMilestone> {
  const { data, error } = await admin()
    .from('goal_milestones')
    .update({
      is_complete: isComplete,
      completed_at: isComplete ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as GoalMilestone
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await admin()
    .from('goal_milestones')
    .delete()
    .eq('id', id)
  if (error) throw error
}
