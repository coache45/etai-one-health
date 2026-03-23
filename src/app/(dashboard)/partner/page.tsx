'use client'

import { useEffect, useState, useCallback } from 'react'
import { Heart, Sparkles, Target, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PartnerStatus } from '@/components/partnerships/partner-status'
import { InviteForm } from '@/components/partnerships/invite-form'
import type { PartnershipWithPartner } from '@/types/partnerships'

export default function PartnerPage() {
  const [partnership, setPartnership] = useState<PartnershipWithPartner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadPartnership = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/partnerships')
      if (res.ok) {
        const data = await res.json()
        setPartnership(data.partnership ?? null)
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPartnership()
  }, [loadPartnership])

  async function handleDissolve() {
    if (!partnership) return
    if (!confirm('End this partnership? You can always invite someone new later.')) return

    try {
      const res = await fetch(`/api/partnerships/${partnership.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dissolve' }),
      })
      if (res.ok) {
        loadPartnership()
      }
    } catch {
      // ignore
    }
  }

  async function handleCancelInvite() {
    if (!partnership) return
    try {
      const res = await fetch(`/api/partnerships/${partnership.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadPartnership()
      }
    } catch {
      // ignore
    }
  }

  const showInviteForm = !partnership || partnership.status === 'dissolved'

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Couples Mode</h1>
              <p className="text-sm text-slate-500">
                Your person is your unfair advantage.
              </p>
            </div>
          </div>
        </div>

        {/* Partnership status */}
        <div className="mb-6">
          <PartnerStatus
            partnership={partnership}
            isLoading={isLoading}
            onDissolve={handleDissolve}
            onCancelInvite={handleCancelInvite}
          />
        </div>

        {/* Invite form (shown when no active partnership) */}
        {showInviteForm && (
          <div className="mb-6">
            <InviteForm onInviteSent={loadPartnership} />
          </div>
        )}

        {/* What you get together */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            What you unlock together
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5 text-center">
                <Sparkles className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
                <h3 className="font-bold text-[#1B2A4A] text-sm mb-1">Shared AI Studio</h3>
                <p className="text-xs text-slate-500">
                  Generate together in real time. See each other&apos;s prompts and outputs as they happen.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <Target className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
                <h3 className="font-bold text-[#1B2A4A] text-sm mb-1">Shared Goals</h3>
                <p className="text-xs text-slate-500">
                  Set goals together. Both can add milestones and track progress side by side.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <MessageSquare className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
                <h3 className="font-bold text-[#1B2A4A] text-sm mb-1">Comments & Reactions</h3>
                <p className="text-xs text-slate-500">
                  Leave thoughts on each other&apos;s outputs. Celebrate wins in real time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Brand message */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400 italic">
            &ldquo;Built by a couple, for couples.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
