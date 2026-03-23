/**
 * ELI5 Guide Library type definitions.
 */

export type GuideDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type GuideCategory =
  | 'general'
  | 'sleep'
  | 'stress'
  | 'nutrition'
  | 'movement'
  | 'cognition'
  | 'guardian'
  | 'couples'
  | 'ai_basics'
  | 'health'
  | 'business'
  | 'relationships'
  | 'tools'
  | 'manufacturing'

export interface GuideStep {
  title: string
  description: string
  icon?: string
}

export interface GuideChapter {
  title: string
  emoji: string
  content: string          // Main explanation text (markdown-safe)
  analogy?: string         // "Think of it like..." box
  steps?: GuideStep[]      // Optional action steps
}

export interface ELI5Guide {
  id: string
  title: string
  tagline: string
  emoji: string
  slug: string
  category: GuideCategory
  difficulty: GuideDifficulty
  chapters: GuideChapter[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export type ELI5GuideInsert = Omit<ELI5Guide, 'id' | 'created_at' | 'updated_at'>
export type ELI5GuideUpdate = Partial<Omit<ELI5Guide, 'id' | 'created_at'>>

export const DIFFICULTY_CONFIG: Record<GuideDifficulty, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  intermediate: { label: 'Intermediate', color: 'text-amber-700', bg: 'bg-amber-50' },
  advanced: { label: 'Advanced', color: 'text-red-700', bg: 'bg-red-50' },
}

export const CATEGORY_CONFIG: Record<GuideCategory, { label: string; emoji: string }> = {
  general: { label: 'General', emoji: '📚' },
  sleep: { label: 'Sleep', emoji: '🌙' },
  stress: { label: 'Stress', emoji: '🧘' },
  nutrition: { label: 'Nutrition', emoji: '🥗' },
  movement: { label: 'Movement', emoji: '🏃' },
  cognition: { label: 'Cognition', emoji: '🧠' },
  guardian: { label: 'Guardian', emoji: '🛡️' },
  couples: { label: 'Couples', emoji: '💕' },
  ai_basics: { label: 'AI Basics', emoji: '🤖' },
  health: { label: 'Health', emoji: '❤️' },
  business: { label: 'Business', emoji: '💼' },
  relationships: { label: 'Relationships', emoji: '💞' },
  tools: { label: 'Tools', emoji: '🛠️' },
  manufacturing: { label: 'Manufacturing', emoji: '🏭' },
}

// Step card border colors cycle through these
export const STEP_COLORS = [
  'border-l-[#C9A84C]',
  'border-l-[#1B2A4A]',
  'border-l-emerald-500',
  'border-l-purple-500',
  'border-l-rose-500',
  'border-l-sky-500',
]
