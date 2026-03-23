'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface PartnerPresence {
  partnerOnline: boolean
  partnerName: string
  partnerAvatar: string | null
  partnershipId: string | null
  lastSeen: string | null
  isLoading: boolean
}

/**
 * Client hook for partner presence detection.
 * Polls /api/partnerships/presence every 10 seconds when active.
 * Also acts as a heartbeat for the current user.
 */
export function usePartnerPresence(enabled: boolean = true): PartnerPresence {
  const [state, setState] = useState<PartnerPresence>({
    partnerOnline: false,
    partnerName: '',
    partnerAvatar: null,
    partnershipId: null,
    lastSeen: null,
    isLoading: true,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkPresence = useCallback(async () => {
    try {
      const res = await fetch('/api/partnerships/presence')
      if (!res.ok) return

      const data = await res.json()
      setState({
        partnerOnline: data.partner_online ?? false,
        partnerName: data.partner?.display_name ?? '',
        partnerAvatar: data.partner?.avatar_url ?? null,
        partnershipId: data.partnership_id ?? null,
        lastSeen: data.partner?.last_seen ?? null,
        isLoading: false,
      })
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    // Initial check
    checkPresence()

    // Poll every 10 seconds
    intervalRef.current = setInterval(checkPresence, 10000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, checkPresence])

  return state
}
