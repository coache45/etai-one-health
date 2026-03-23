'use client'

import { useEffect, useState, useCallback } from 'react'
import { MessageSquare, Send, Loader2, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { SessionComment } from '@/types/partnerships'

interface SharedOutput {
  id: string
  prompt_text: string
  output_text: string
  user_id: string
  shared_with: string | null
  comments: SessionComment[]
  created_at: string
}

interface SharedSessionProps {
  refreshTrigger?: number
}

export function SharedSession({ refreshTrigger }: SharedSessionProps) {
  const [outputs, setOutputs] = useState<SharedOutput[]>([])
  const [hasPartner, setHasPartner] = useState(false)
  const [partnerName, setPartnerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [commentingOn, setCommentingOn] = useState<string | null>(null)
  const [isSendingComment, setIsSendingComment] = useState(false)

  const loadShared = useCallback(async () => {
    try {
      const res = await fetch('/api/studio/shared')
      if (res.ok) {
        const data = await res.json()
        setOutputs(data.outputs ?? [])
        setHasPartner(data.has_partner ?? false)
        setPartnerName(data.partner_name ?? '')
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShared()
  }, [loadShared, refreshTrigger])

  async function handleComment(outputId: string) {
    if (!commentText.trim()) return
    setIsSendingComment(true)

    try {
      const res = await fetch('/api/studio/shared', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ output_id: outputId, text: commentText.trim() }),
      })

      if (res.ok) {
        setCommentText('')
        setCommentingOn(null)
        loadShared()
      }
    } catch {
      // ignore
    } finally {
      setIsSendingComment(false)
    }
  }

  if (isLoading) return null

  if (!hasPartner) return null

  if (outputs.length === 0) {
    return (
      <Card className="border-dashed border-2 border-[#C9A84C]/20">
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 text-[#C9A84C]/40 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-medium">
            Shared sessions with {partnerName} will show up here
          </p>
          <p className="text-xs text-slate-400 mt-1">
            When either of you generates something, you&apos;ll both see it.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider flex items-center gap-2">
        <Users className="w-3.5 h-3.5" />
        Shared with {partnerName}
      </h3>

      {outputs.slice(0, 5).map((output) => (
        <Card key={output.id} className="border border-[#C9A84C]/20">
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-1">
              {new Date(output.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-slate-700 line-clamp-2 mb-2">
              {output.prompt_text.slice(0, 100)}
              {output.prompt_text.length > 100 ? '...' : ''}
            </p>
            <p className="text-xs text-slate-500 line-clamp-3">
              {output.output_text.slice(0, 150)}
              {output.output_text.length > 150 ? '...' : ''}
            </p>

            {/* Comments */}
            {(output.comments ?? []).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                {(output.comments as SessionComment[]).map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <span className="text-xs font-semibold text-[#1B2A4A]">{c.display_name}:</span>
                    <span className="text-xs text-slate-600">{c.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            {commentingOn === output.id ? (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment(output.id)}
                  placeholder="Add a thought..."
                  autoFocus
                  className="flex-1 text-xs rounded-md border border-slate-200 px-2 py-1.5 text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none"
                />
                <button
                  onClick={() => handleComment(output.id)}
                  disabled={isSendingComment || !commentText.trim()}
                  className="px-2 py-1.5 rounded-md bg-[#1B2A4A] text-white disabled:opacity-40"
                >
                  {isSendingComment ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCommentingOn(output.id)}
                className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-[#C9A84C] transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                Comment
              </button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
