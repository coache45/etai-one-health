'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useHealthStore } from '@/stores/health-store'
import { getTodayISO, getLastNDays } from '@/lib/utils'
import type { DailyHealthLog } from '@/types/health'

export function useHealthData(userId: string | undefined) {
  const { setTodayLog, setRecentLogs, setInsights, setLoading } = useHealthStore()

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()
    const today = getTodayISO()
    const lastWeek = getLastNDays(7)[0]

    async function fetchData() {
      setLoading(true)
      try {
        const [todayRes, recentRes, insightsRes] = await Promise.all([
          supabase
            .from('daily_health_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('log_date', today)
            .single(),
          supabase
            .from('daily_health_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('log_date', lastWeek)
            .order('log_date', { ascending: false }),
          supabase
            .from('ai_insights')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false)
            .order('priority', { ascending: false })
            .limit(5),
        ])

        setTodayLog((todayRes.data as DailyHealthLog | null) ?? null)
        setRecentLogs((recentRes.data as DailyHealthLog[]) ?? [])
        setInsights(insightsRes.data ?? [])
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Realtime subscription for today's log
    const channel = supabase
      .channel('health-logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_health_logs',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const log = payload.new as DailyHealthLog
            if (log.log_date === today) {
              setTodayLog(log)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, setTodayLog, setRecentLogs, setInsights, setLoading])
}
