/**
 * Partnerships data layer
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { Partnership, PartnerProfile, PartnershipWithPartner } from '@/types/partnerships'

const admin = () => createAdminClient()

// ─── Partnership CRUD ───

export async function fetchActivePartnership(userId: string): Promise<PartnershipWithPartner | null> {
  // Check as user_id_1
  const { data: as1 } = await admin()
    .from('partnerships')
    .select('*')
    .eq('user_id_1', userId)
    .in('status', ['active', 'pending'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (as1) {
    const partnership = as1 as unknown as Partnership
    const partner = partnership.user_id_2
      ? await fetchPartnerProfile(partnership.user_id_2)
      : null
    return { ...partnership, partner, role: 'inviter' }
  }

  // Check as user_id_2
  const { data: as2 } = await admin()
    .from('partnerships')
    .select('*')
    .eq('user_id_2', userId)
    .in('status', ['active', 'pending'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (as2) {
    const partnership = as2 as unknown as Partnership
    const partner = await fetchPartnerProfile(partnership.user_id_1)
    return { ...partnership, partner, role: 'invitee' }
  }

  return null
}

export async function fetchPartnerProfile(userId: string): Promise<PartnerProfile | null> {
  const { data, error } = await admin()
    .from('profiles')
    .select('id, email, full_name, display_name, avatar_url')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as unknown as PartnerProfile
}

export async function createPartnershipInvite(
  inviterId: string,
  inviteEmail: string
): Promise<Partnership> {
  // Check if partner already has an account
  const { data: existingUser } = await admin()
    .from('profiles')
    .select('id')
    .eq('email', inviteEmail)
    .single()

  const insertData: Record<string, unknown> = {
    user_id_1: inviterId,
    invite_email: inviteEmail,
    status: 'pending',
  }

  // If partner already exists, immediately link and activate
  if (existingUser) {
    insertData.user_id_2 = (existingUser as unknown as { id: string }).id
    insertData.status = 'active'
  }

  const { data, error } = await admin()
    .from('partnerships')
    .insert(insertData)
    .select()
    .single()

  if (error) throw error
  return data as unknown as Partnership
}

export async function acceptPartnership(
  partnershipId: string,
  userId: string
): Promise<Partnership> {
  const { data, error } = await admin()
    .from('partnerships')
    .update({ user_id_2: userId, status: 'active' })
    .eq('id', partnershipId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error) throw error
  return data as unknown as Partnership
}

export async function dissolvePartnership(
  partnershipId: string,
  userId: string
): Promise<void> {
  const { error } = await admin()
    .from('partnerships')
    .update({ status: 'dissolved' })
    .eq('id', partnershipId)
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)

  if (error) throw error
}

export async function cancelInvite(
  partnershipId: string,
  inviterId: string
): Promise<void> {
  const { error } = await admin()
    .from('partnerships')
    .delete()
    .eq('id', partnershipId)
    .eq('user_id_1', inviterId)
    .eq('status', 'pending')

  if (error) throw error
}

// ─── Partner-aware queries ───

export function getPartnerId(partnership: PartnershipWithPartner, myUserId: string): string | null {
  if (partnership.status !== 'active') return null
  return partnership.user_id_1 === myUserId ? partnership.user_id_2 : partnership.user_id_1
}

export async function fetchPartnerGoals(partnerId: string) {
  const { data, error } = await admin()
    .from('user_goals')
    .select('*')
    .eq('user_id', partnerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function shareGoalWithPartner(goalId: string, partnerId: string): Promise<void> {
  const { error } = await admin()
    .from('user_goals')
    .update({ shared_with: partnerId })
    .eq('id', goalId)

  if (error) throw error
}

export async function saveSharedOutput(output: {
  user_id: string
  shared_with: string
  pack_id: string | null
  prompt_text: string
  output_text: string
}): Promise<void> {
  const { error } = await admin()
    .from('prompt_outputs')
    .insert(output)

  if (error) throw error
}

export async function addOutputComment(
  outputId: string,
  comment: { id: string; user_id: string; display_name: string; text: string; created_at: string }
): Promise<void> {
  // Fetch current comments, append new one
  const { data } = await admin()
    .from('prompt_outputs')
    .select('comments')
    .eq('id', outputId)
    .single()

  const existing = ((data as unknown as { comments: unknown[] })?.comments ?? []) as unknown[]
  existing.push(comment)

  const { error } = await admin()
    .from('prompt_outputs')
    .update({ comments: existing })
    .eq('id', outputId)

  if (error) throw error
}
