import type { DailyHealthLog } from './health'

export interface SharingPreferences {
  sleep: boolean
  stress: boolean
  activity: boolean
  heart_rate: boolean
  mood: boolean
}

export interface Couple {
  id: string
  partner_a_id: string
  partner_b_id: string
  status: 'pending' | 'active' | 'paused' | 'disconnected'
  invited_by: string
  partner_a_shares: SharingPreferences
  partner_b_shares: SharingPreferences
  invite_token: string | null
  sync_score: number | null
  sync_score_updated_at: string | null
  connected_at: string | null
  disconnected_at: string | null
  created_at: string
}

export interface CouplesSharedGoal {
  id: string
  couple_id: string
  title: string
  description: string | null
  target_value: number | null
  current_value: number
  unit: string | null
  frequency: 'daily' | 'weekly' | 'monthly'
  status: 'active' | 'completed' | 'abandoned'
  starts_at: string | null
  ends_at: string | null
  created_at: string
}

export interface CouplesData {
  couple: Couple
  partnerA: {
    id: string
    full_name: string
    display_name: string | null
    avatar_url: string | null
    todayLog: DailyHealthLog | null
  }
  partnerB: {
    id: string
    full_name: string
    display_name: string | null
    avatar_url: string | null
    todayLog: DailyHealthLog | null
  }
  sharedGoals: CouplesSharedGoal[]
  syncScore: number
}

export interface SyncScoreInput {
  partnerA: DailyHealthLog
  partnerB: DailyHealthLog
  sharingSettings: {
    a: SharingPreferences
    b: SharingPreferences
  }
}
