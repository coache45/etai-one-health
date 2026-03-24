'use client'

import { useUserStore } from '@/stores/user-store'

export function useSubscription() {
  const { profile } = useUserStore()
  const tier = profile?.subscription_tier ?? 'free'

  return {
    tier,
    isPro: tier !== 'free',
    isCouples: tier === 'couples' || tier === 'enterprise',
    isEnterprise: tier === 'enterprise',
    isFree: tier === 'free',
    isBuilder: tier === 'builder',
    canAccessFeature: (requiredTier: 'free' | 'pro' | 'couples' | 'enterprise' | 'builder') => {
      const tiers = ['free', 'builder', 'pro', 'couples', 'enterprise']
      return tiers.indexOf(tier) >= tiers.indexOf(requiredTier)
    },
  }
}
