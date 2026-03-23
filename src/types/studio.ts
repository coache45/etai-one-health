// ─── AI Studio Types ───

export type GoalCategory = 'business' | 'relationships' | 'health' | 'finance' | 'creativity' | 'learning'
export type GoalStatus = 'active' | 'completed' | 'archived'
export type PackDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface PromptField {
  name: string
  placeholder: string
  type: 'text' | 'textarea'
}

export interface PackPrompt {
  id: string
  title: string
  description: string
  template: string
  fields: PromptField[]
}

export interface PromptPack {
  id: string
  title: string
  description: string
  category: GoalCategory
  difficulty: PackDifficulty
  prompts: PackPrompt[]
  is_free: boolean
  created_at: string
}

export interface PromptOutput {
  id: string
  user_id: string
  pack_id: string | null
  prompt_text: string
  output_text: string
  is_saved: boolean
  created_at: string
}

export interface UserGoal {
  id: string
  user_id: string
  title: string
  category: GoalCategory
  target_date: string | null
  status: GoalStatus
  created_at: string
  milestones?: GoalMilestone[]
}

export interface GoalMilestone {
  id: string
  goal_id: string
  title: string
  is_complete: boolean
  completed_at: string | null
  created_at: string
}

// ─── Category Config ───

export const GOAL_CATEGORIES: Record<
  GoalCategory,
  { label: string; emoji: string; color: string; bgColor: string; borderColor: string }
> = {
  business: {
    label: 'Business',
    emoji: '🚀',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  relationships: {
    label: 'Relationships',
    emoji: '💛',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
  health: {
    label: 'Health',
    emoji: '🌿',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  finance: {
    label: 'Finance',
    emoji: '💰',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  creativity: {
    label: 'Creativity',
    emoji: '🎨',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  learning: {
    label: 'Learning',
    emoji: '📚',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
}

export const DIFFICULTY_LABELS: Record<PackDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700' },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700' },
}

export const FREE_TIER_WEEKLY_LIMIT = 3
