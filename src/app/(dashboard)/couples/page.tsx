'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import { useCouplesSync } from '@/hooks/useCouplesSync'
import { useCouplesStore } from '@/stores/couples-store'
import { useUserStore } from '@/stores/user-store'
import { SyncScore } from '@/components/couples/SyncScore'
import { SideBySideView } from '@/components/couples/SideBySideView'
import { SharedGoals } from '@/components/couples/SharedGoals'
import { CouplesInsight } from '@/components/couples/CouplesInsight'
import { InvitePartner } from '@/components/couples/InvitePartner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function CouplesPage() {
  const { profile } = useUserStore()
  const { couplesData, isLoading } = useCouplesStore()
  const [insightTitle] = useState('You two are building something real.')
  const [insightBody] = useState(
    'Your sleep schedules are within 30 minutes of each other three days in a row. That kind of consistency creates real rhythm in a relationship.'
  )

  useCouplesSync(profile?.id)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!couplesData) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Couples</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            The health app built for two.
          </p>
        </div>
        <InvitePartner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">
            {couplesData.partnerA.display_name ?? couplesData.partnerA.full_name.split(' ')[0]} &amp;{' '}
            {couplesData.partnerB.display_name ?? couplesData.partnerB.full_name.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Connected since {
            couplesData.couple.connected_at
              ? new Date(couplesData.couple.connected_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'recently'
          }</p>
        </div>
        <Link href="/couples/settings">
          <Button variant="ghost" size="icon">
            <Shield className="w-5 h-5 text-gray-400" />
          </Button>
        </Link>
      </div>

      {/* Sync Score */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex justify-center">
        <SyncScore score={couplesData.syncScore} />
      </div>

      {/* Side by Side */}
      <SideBySideView data={couplesData} />

      {/* Couples Insight */}
      <CouplesInsight title={insightTitle} body={insightBody} />

      {/* Shared Goals */}
      <SharedGoals
        goals={couplesData.sharedGoals}
        onAddGoal={() => {/* TODO: open modal */}}
      />
    </div>
  )
}
