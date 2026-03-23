'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Trash2, Pin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { CommunityPost } from '@/types/community'
import { CATEGORY_CONFIG } from '@/types/community'

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

interface PostCardProps {
  post: CommunityPost
  currentUserId?: string
  onLike?: (postId: string) => void
  onDelete?: (postId: string) => void
}

export function PostCard({ post, currentUserId, onLike, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked ?? false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const catConfig = CATEGORY_CONFIG[post.category]
  const isOwn = currentUserId === post.user_id

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isLiking) return
    setIsLiking(true)

    // Optimistic update
    setLiked(!liked)
    setLikesCount((c) => (liked ? c - 1 : c + 1))

    try {
      const res = await fetch(`/api/community/${post.id}/like`, { method: 'POST' })
      if (!res.ok) {
        // Revert
        setLiked(liked)
        setLikesCount(likesCount)
      }
      onLike?.(post.id)
    } catch {
      setLiked(liked)
      setLikesCount(likesCount)
    } finally {
      setIsLiking(false)
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this post?')) return

    try {
      const res = await fetch(`/api/community/${post.id}`, { method: 'DELETE' })
      if (res.ok) onDelete?.(post.id)
    } catch {
      // ignore
    }
  }

  // Avatar initials fallback
  const initials = (post.author_name ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header: author + category + pin */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name ?? ''}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-[#1B2A4A] text-sm">
                {post.author_name ?? 'Anonymous'}
              </p>
              <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.is_pinned && (
              <Pin className="w-4 h-4 text-[#C9A84C]" />
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${catConfig.bgColor} ${catConfig.color}`}
            >
              {catConfig.emoji} {catConfig.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <Link href={`/community/${post.id}`}>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>
        </Link>

        {/* Footer: likes + replies + delete */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked
                ? 'text-[#C9A84C] font-semibold'
                : 'text-slate-400 hover:text-[#C9A84C]'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-[#C9A84C]' : ''}`} />
            {likesCount}
          </button>

          <Link
            href={`/community/${post.id}`}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#1B2A4A] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {post.replies_count}
          </Link>

          {isOwn && (
            <button
              onClick={handleDelete}
              className="ml-auto flex items-center gap-1 text-xs text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
