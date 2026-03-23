'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { CommunityReply } from '@/types/community'

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

interface ReplyThreadProps {
  postId: string
  replies: CommunityReply[]
  onReplyCreated?: () => void
}

export function ReplyThread({ postId, replies, onReplyCreated }: ReplyThreadProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/community/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      })

      if (res.ok) {
        setContent('')
        onReplyCreated?.()
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[#1B2A4A]">
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h3>

      {/* Reply list */}
      {replies.length > 0 ? (
        <div className="space-y-2">
          {replies.map((reply) => {
            const initials = (reply.author_name ?? 'A')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <Card key={reply.id} className="bg-slate-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {reply.author_avatar ? (
                      <img
                        src={reply.author_avatar}
                        alt={reply.author_name ?? ''}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1B2A4A]/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#1B2A4A]">
                          {reply.author_name ?? 'Anonymous'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {timeAgo(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">
          No replies yet. Be the first to respond!
        </p>
      )}

      {/* Reply composer */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a reply..."
          maxLength={2000}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
        />
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
