'use client'

import { Heart, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { PartnershipWithPartner } from '@/types/partnerships'

interface PartnerStatusProps {
  partnership: PartnershipWithPartner | null
  isLoading: boolean
  onDissolve?: () => void
  onCancelInvite?: () => void
}

export function PartnerStatus({ partnership, isLoading, onDissolve, onCancelInvite }: PartnerStatusProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-[#C9A84C] animate-spin" />
          <span className="ml-2 text-sm text-slate-400">Loading partnership...</span>
        </CardContent>
      </Card>
    )
  }

  // No partnership
  if (!partnership) {
    return (
      <Card className="border-2 border-dashed border-[#C9A84C]/30">
        <CardContent className="p-8 text-center">
          <Heart className="w-12 h-12 text-[#C9A84C]/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">
            Better together
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Built by a couple, for couples. Your person is your unfair advantage.
            Invite your partner to share goals, AI sessions, and wins.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Pending invite
  if (partnership.status === 'pending') {
    return (
      <Card className="border-l-4 border-l-amber-400">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#1B2A4A]">Invite pending</h3>
                <p className="text-sm text-slate-500">
                  Waiting for <strong>{partnership.invite_email}</strong> to join.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  We&apos;ll link you up the moment they do.
                </p>
              </div>
            </div>
            {partnership.role === 'inviter' && onCancelInvite && (
              <button
                onClick={onCancelInvite}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Cancel invite
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Active partnership
  if (partnership.status === 'active' && partnership.partner) {
    const connectedDate = new Date(partnership.updated_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    return (
      <Card className="border-l-4 border-l-emerald-400">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
                {partnership.partner.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partnership.partner.avatar_url}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  '💛'
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#1B2A4A] text-lg">
                    {partnership.partner.display_name || partnership.partner.full_name || 'Your partner'}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500">
                  Connected since {connectedDate}
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Sharing goals, sessions, and wins
                </p>
              </div>
            </div>
            {onDissolve && (
              <button
                onClick={onDissolve}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                <XCircle className="w-3 h-3" />
                End partnership
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Dissolved
  return (
    <Card className="border-l-4 border-l-slate-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h3 className="font-medium text-slate-500">Partnership ended</h3>
            <p className="text-sm text-slate-400">
              You can invite someone new whenever you&apos;re ready.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
