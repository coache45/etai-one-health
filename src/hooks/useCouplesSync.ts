'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCouplesStore } from '@/stores/couples-store'
import type { CouplesData } from '@/types/couples'

export function useCouplesSync(userId: string | undefined) {
  const { setCouplesData, setLoading, updateSyncScore } = useCouplesStore()

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    async function fetchCouplesData() {
      setLoading(true)
      try {
        const { data: couple } = await supabase
          .from('couples')
          .select('*')
          .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`)
          .eq('status', 'active')
          .single()

        if (!couple) {
          setCouplesData(null)
          return
        }

        const partnerId =
          couple.partner_a_id === userId ? couple.partner_b_id : couple.partner_a_id

        const [partnerRes, goalsRes, todayA, todayB] = await Promise.all([
          supabase.from('profiles').select('id, full_name, display_name, avatar_url').eq('id', partnerId).single(),
          supabase.from('couples_shared_goals').select('*').eq('couple_id', couple.id).eq('status', 'active'),
          supabase.from('daily_health_logs').select('*').eq('user_id', userId).eq('log_date', new Date().toISOString().split('T')[0]).single(),
          supabase.from('daily_health_logs').select('*').eq('user_id', partnerId).eq('log_date', new Date().toISOString().split('T')[0]).single(),
        ])

        const meRes = await supabase
          .from('profiles')
          .select('id, full_name, display_name, avatar_url')
          .eq('id', userId)
          .single()

        const isPartnerA = couple.partner_a_id === userId

        const couplesData: CouplesData = {
          couple,
          partnerA: {
            id: isPartnerA ? userId : partnerId,
            full_name: isPartnerA ? meRes.data?.full_name ?? '' : partnerRes.data?.full_name ?? '',
            display_name: isPartnerA ? meRes.data?.display_name ?? null : partnerRes.data?.display_name ?? null,
            avatar_url: isPartnerA ? meRes.data?.avatar_url ?? null : partnerRes.data?.avatar_url ?? null,
            todayLog: isPartnerA ? todayA.data : todayB.data,
          },
          partnerB: {
            id: isPartnerA ? partnerId : userId,
            full_name: isPartnerA ? partnerRes.data?.full_name ?? '' : meRes.data?.full_name ?? '',
            display_name: isPartnerA ? partnerRes.data?.display_name ?? null : meRes.data?.display_name ?? null,
            avatar_url: isPartnerA ? partnerRes.data?.avatar_url ?? null : meRes.data?.avatar_url ?? null,
            todayLog: isPartnerA ? todayB.data : todayA.data,
          },
          sharedGoals: goalsRes.data ?? [],
          syncScore: couple.sync_score ?? 0,
        }

        setCouplesData(couplesData)
      } finally {
        setLoading(false)
      }
    }

    fetchCouplesData()

    // Realtime: update sync score when couple record changes
    const channel = supabase
      .channel('couples-sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'couples' },
        (payload) => {
          if (payload.new.sync_score !== undefined) {
            updateSyncScore(payload.new.sync_score as number)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, setCouplesData, setLoading, updateSyncScore])
}
