'use client'

import { useUserStore } from '@/stores/user-store'

export function useSubscription() {
  const { profile } = useUserStore()
  const tier = profile?.subscription_tier ?? 'free'

  return {
    tier,
    isPro: tier === 'pro' || tier === 'couples' || tier === 'enterprise',
    isCouples: tier === 'couples' || tier === 'enterprise',
    isEnterprise: tier === 'enterprise',
    isFree: tier === 'free',
    canAccessFeature: (requiredTier: 'free' | 'pro' | 'couples' | 'enterprise') => {
      const tiers = ['free', 'pro', 'couples', 'enterprise']
      return tiers.indexOf(tier) >= tiers.indexOf(requiredTier)
    },
  }
}
