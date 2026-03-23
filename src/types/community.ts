// ─── Earth Station Community Types ───

export type PostCategory = 'general' | 'wins' | 'questions' | 'resources' | 'introductions'

export interface CommunityPost {
  id: string
  user_id: string
  content: string
  category: PostCategory
  likes_count: number
  replies_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author_name?: string
  author_avatar?: string | null
  user_has_liked?: boolean
}

export interface CommunityReply {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  // Joined fields
  author_name?: string
  author_avatar?: string | null
}

export interface CommunityLike {
  post_id: string
  user_id: string
  created_at: string
}

// ─── Category Config ───

export const CATEGORY_CONFIG: Record<
  PostCategory,
  { label: string; emoji: string; color: string; bgColor: string }
> = {
  general: {
    label: 'General',
    emoji: '💬',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  wins: {
    label: 'Wins',
    emoji: '🏆',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  questions: {
    label: 'Questions',
    emoji: '❓',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  resources: {
    label: 'Resources',
    emoji: '🔗',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  introductions: {
    label: 'Introductions',
    emoji: '👋',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
}

export const ALL_CATEGORIES: PostCategory[] = [
  'general',
  'wins',
  'questions',
  'resources',
  'introductions',
]
