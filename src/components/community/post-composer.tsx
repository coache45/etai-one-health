'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ALL_CATEGORIES, CATEGORY_CONFIG } from '@/types/community'
import type { PostCategory } from '@/types/community'

interface PostComposerProps {
  onPostCreated?: () => void
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed, category }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to create post')
        return
      }

      setContent('')
      setCategory('general')
      onPostCreated?.()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-dashed border-[#C9A84C]/30">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the community..."
            rows={3}
            maxLength={5000}
            className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
          />

          <div className="flex items-center justify-between mt-3">
            {/* Category selector */}
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => {
                const config = CATEGORY_CONFIG[cat]
                const active = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                      active
                        ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-[#C9A84C]/40`
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {config.emoji} {config.label}
                  </button>
                )
              })}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
