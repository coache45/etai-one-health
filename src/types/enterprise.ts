export interface Organization {
  id: string
  name: string
  slug: string
  industry: string | null
  employee_count: number | null
  plan: 'starter' | 'professional' | 'enterprise'
  stripe_subscription_id: string | null
  admin_user_id: string
  settings: Record<string, unknown>
  created_at: string
}

export interface OrganizationMember {
  id: string
  org_id: string
  user_id: string
  role: 'admin' | 'manager' | 'member'
  team: string | null
  shift_pattern: string | null
  joined_at: string
}

export interface WellnessChallenge {
  id: string
  org_id: string
  title: string
  description: string | null
  challenge_type: 'steps' | 'sleep' | 'hydration' | 'activity' | 'custom'
  target_value: number | null
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  created_at: string
}

export interface WorkforceHealthScore {
  orgId: string
  overallScore: number
  sleepScore: number
  stressScore: number
  activityScore: number
  engagementRate: number
  atRiskPercentage: number
  teamBreakdown: {
    team: string
    score: number
    memberCount: number
    riskLevel: 'low' | 'medium' | 'high'
  }[]
}
