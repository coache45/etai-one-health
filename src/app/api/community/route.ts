import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchPosts,
  createPost,
  getUserLikes,
  getProfilesByIds,
} from '@/lib/community/queries'
import type { PostCategory } from '@/types/community'

const VALID_CATEGORIES = ['general', 'wins', 'questions', 'resources', 'introductions']

/** GET /api/community?category=wins&limit=20&offset=0 */
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as PostCategory | null
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  try {
    const posts = await fetchPosts({
      category: category && VALID_CATEGORIES.includes(category) ? category : undefined,
      limit,
      offset,
    })

    // Enrich with author names and like status
    const userIds = [...new Set(posts.map((p) => p.user_id))]
    const postIds = posts.map((p) => p.id)

    const [profiles, likedSet] = await Promise.all([
      getProfilesByIds(userIds),
      getUserLikes(user.id, postIds),
    ])

    const enriched = posts.map((post) => ({
      ...post,
      author_name: profiles.get(post.user_id)?.full_name ?? 'Anonymous',
      author_avatar: profiles.get(post.user_id)?.avatar_url ?? null,
      user_has_liked: likedSet.has(post.id),
    }))

    return NextResponse.json({ posts: enriched })
  } catch (err) {
    console.error('Community GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

/** POST /api/community — create a new post */
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
    const content = (body.content ?? '').trim()
    const category = body.category ?? 'general'

    if (!content || content.length > 5000) {
      return NextResponse.json(
        { error: 'Content is required (max 5000 chars)' },
        { status: 400 }
      )
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const post = await createPost(user.id, content, category as PostCategory)
    return NextResponse.json({ post }, { status: 201 })
  } catch (err) {
    console.error('Community POST error:', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
