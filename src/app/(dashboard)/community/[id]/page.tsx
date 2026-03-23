'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Globe, Heart, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ReplyThread } from '@/components/community/reply-thread'
import { CATEGORY_CONFIG } from '@/types/community'
import type { CommunityPost, CommunityReply } from '@/types/community'
import { useUserStore } from '@/stores/user-store'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  const { profile } = useUserStore()

  const [post, setPost] = useState<CommunityPost | null>(null)
  const [replies, setReplies] = useState<CommunityReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  const loadPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/${postId}`)
      if (!res.ok) {
        router.push('/community')
        return
      }
      const data = await res.json()
      setPost(data.post)
      setReplies(data.replies ?? [])
      setLiked(data.post.user_has_liked ?? false)
      setLikesCount(data.post.likes_count ?? 0)
    } catch {
      router.push('/community')
    } finally {
      setIsLoading(false)
    }
  }, [postId, router])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  async function handleLike() {
    setLiked(!liked)
    setLikesCount((c) => (liked ? c - 1 : c + 1))
    try {
      await fetch(`/api/community/${postId}/like`, { method: 'POST' })
    } catch {
      setLiked(liked)
      setLikesCount(likesCount)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/community/${postId}`, { method: 'DELETE' })
      if (res.ok) router.push('/community')
    } catch {
      // ignore
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF8F1] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
        <span className="ml-2 text-sm text-slate-400">Loading post...</span>
      </div>
    )
  }

  if (!post) return null

  const catConfig = CATEGORY_CONFIG[post.category]
  const isOwn = profile?.id === post.user_id
  const initials = (post.author_name ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back nav */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1B2A4A] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Earth Station
        </Link>

        {/* Post card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Author header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {post.author_avatar ? (
                  <img
                    src={post.author_avatar}
                    alt={post.author_name ?? ''}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#1B2A4A]">
                    {post.author_name ?? 'Anonymous'}
                  </p>
                  <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${catConfig.bgColor} ${catConfig.color}`}
              >
                {catConfig.emoji} {catConfig.label}
              </span>
            </div>

            {/* Content */}
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-5">
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked
                    ? 'text-[#C9A84C] font-semibold'
                    : 'text-slate-400 hover:text-[#C9A84C]'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-[#C9A84C]' : ''}`} />
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </button>

              {isOwn && (
                <button
                  onClick={handleDelete}
                  className="ml-auto flex items-center gap-1.5 text-xs text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reply thread */}
        <ReplyThread
          postId={postId}
          replies={replies}
          onReplyCreated={loadPost}
        />
      </div>
    </div>
  )
}
