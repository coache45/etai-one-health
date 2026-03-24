export interface Profile {
  id: string
  email: string
  full_name: string
  display_name: string | null
  avatar_url: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null
  height_cm: number | null
  weight_kg: number | null
  timezone: string
  subscription_tier: 'free' | 'pro' | 'couples' | 'enterprise' | 'builder'
  stripe_customer_id: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  name: string
  slug: string
  description: string
  duration_days: number
  category: 'sleep' | 'stress' | 'energy' | 'recovery' | 'habit' | 'shift_work' | 'couples'
  is_couples: boolean
  tier_required: 'free' | 'pro' | 'couples' | 'enterprise' | 'builder'
  daily_actions: DailyAction[]
  created_at: string
}

export interface DailyAction {
  day: number
  title: string
  description: string
  action_type: 'log' | 'task' | 'exercise' | 'conversation' | 'meditation'
}

export interface UserProgram {
  id: string
  user_id: string
  couple_id: string | null
  program_id: string
  status: 'active' | 'completed' | 'paused' | 'abandoned'
  current_day: number
  started_at: string
  completed_at: string | null
  daily_completions: number[]
  program?: Program
}
