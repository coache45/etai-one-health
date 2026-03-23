'use client'

import { useState } from 'react'
import { Send, Loader2, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface InviteFormProps {
  onInviteSent: () => void
}

export function InviteForm({ onInviteSent }: InviteFormProps) {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    setIsSending(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setSuccess(data.message ?? 'Invite sent!')
      setEmail('')
      setTimeout(() => onInviteSent(), 1500)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-[#C9A84C]" />
          <h3 className="font-bold text-[#1B2A4A]">Invite your person</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Enter their email and we&apos;ll link your accounts.
          If they&apos;re not on ONE Health yet, we&apos;ll connect you the moment they join.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="partner@email.com"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
            />
            <button
              type="submit"
              disabled={isSending || !email.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Invite
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-600 font-medium">{success}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
