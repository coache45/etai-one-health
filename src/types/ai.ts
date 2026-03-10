export interface AIConversation {
  id: string
  user_id: string
  title: string | null
  conversation_type: 'coaching' | 'check_in' | 'couples' | 'program' | 'insight'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface AIInsight {
  id: string
  user_id: string
  couple_id: string | null
  insight_type: 'daily' | 'weekly' | 'monthly' | 'alert' | 'couples' | 'celebration'
  title: string
  body: string
  priority: number
  is_read: boolean
  generated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface CoachContext {
  userName: string
  todayLog: Record<string, unknown> | null
  recentTrends: Record<string, unknown> | null
  activeProgram: string | null
  subscriptionTier: string
}
