import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchPostById,
  fetchReplies,
  deletePost,
  getUserLikes,
  getProfilesByIds,
} from '@/lib/community/queries'

/** GET /api/community/[id] — post detail + replies */
export async function GET(
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
    const post = await fetchPostById(params.id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const replies = await fetchReplies(params.id)

    // Gather all user IDs for profile enrichment
    const allUserIds = [
      post.user_id,
      ...replies.map((r) => r.user_id),
    ]
    const uniqueUserIds = [...new Set(allUserIds)]

    const [profiles, likedSet] = await Promise.all([
      getProfilesByIds(uniqueUserIds),
      getUserLikes(user.id, [post.id]),
    ])

    const enrichedPost = {
      ...post,
      author_name: profiles.get(post.user_id)?.full_name ?? 'Anonymous',
      author_avatar: profiles.get(post.user_id)?.avatar_url ?? null,
      user_has_liked: likedSet.has(post.id),
    }

    const enrichedReplies = replies.map((reply) => ({
      ...reply,
      author_name: profiles.get(reply.user_id)?.full_name ?? 'Anonymous',
      author_avatar: profiles.get(reply.user_id)?.avatar_url ?? null,
    }))

    return NextResponse.json({ post: enrichedPost, replies: enrichedReplies })
  } catch (err) {
    console.error('Community GET [id] error:', err)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

/** DELETE /api/community/[id] — delete own post */
export async function DELETE(
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
    await deletePost(params.id, user.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Community DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
