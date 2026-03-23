/**
 * Community data layer — Earth Station
 * Uses admin client for server-side queries.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { CommunityPost, CommunityReply, PostCategory } from '@/types/community'

const admin = () => createAdminClient()

// ─── Posts ───

export async function fetchPosts(options: {
  category?: PostCategory
  limit?: number
  offset?: number
}): Promise<CommunityPost[]> {
  const { category, limit = 20, offset = 0 } = options
  let query = admin()
    .from('community_posts')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && category !== 'general') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as CommunityPost[]
}

export async function fetchPostById(id: string): Promise<CommunityPost | null> {
  const { data, error } = await admin()
    .from('community_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as unknown as CommunityPost
}

export async function createPost(
  userId: string,
  content: string,
  category: PostCategory
): Promise<CommunityPost> {
  const { data, error } = await admin()
    .from('community_posts')
    .insert({ user_id: userId, content, category })
    .select()
    .single()

  if (error) throw error
  return data as unknown as CommunityPost
}

export async function deletePost(id: string, userId: string): Promise<void> {
  const { error } = await admin()
    .from('community_posts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

// ─── Replies ───

export async function fetchReplies(postId: string): Promise<CommunityReply[]> {
  const { data, error } = await admin()
    .from('community_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as CommunityReply[]
}

export async function createReply(
  postId: string,
  userId: string,
  content: string
): Promise<CommunityReply> {
  const { data, error } = await admin()
    .from('community_replies')
    .insert({ post_id: postId, user_id: userId, content })
    .select()
    .single()

  if (error) throw error
  return data as unknown as CommunityReply
}

// ─── Likes ───

export async function toggleLike(
  postId: string,
  userId: string
): Promise<{ liked: boolean }> {
  // Check if already liked
  const { data: existing } = await admin()
    .from('community_likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    // Unlike
    await admin()
      .from('community_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    return { liked: false }
  } else {
    // Like
    await admin()
      .from('community_likes')
      .insert({ post_id: postId, user_id: userId })
    return { liked: true }
  }
}

export async function getUserLikes(
  userId: string,
  postIds: string[]
): Promise<Set<string>> {
  if (postIds.length === 0) return new Set()

  const { data } = await admin()
    .from('community_likes')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds)

  return new Set((data ?? []).map((d: { post_id: string }) => d.post_id))
}

// ─── Profiles (for author names) ───

export async function getProfilesByIds(
  userIds: string[]
): Promise<Map<string, { full_name: string; avatar_url: string | null }>> {
  if (userIds.length === 0) return new Map()

  const { data } = await admin()
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds)

  const map = new Map<string, { full_name: string; avatar_url: string | null }>()
  for (const p of data ?? []) {
    const profile = p as unknown as { id: string; full_name: string; avatar_url: string | null }
    map.set(profile.id, {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    })
  }
  return map
}
