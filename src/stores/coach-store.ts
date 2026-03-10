import { create } from 'zustand'
import type { ChatMessage, AIConversation } from '@/types/ai'

interface CoachState {
  conversations: AIConversation[]
  activeConversationId: string | null
  messages: ChatMessage[]
  isStreaming: boolean
  isLoading: boolean
  setConversations: (conversations: AIConversation[]) => void
  setActiveConversation: (id: string | null) => void
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setStreaming: (streaming: boolean) => void
  setLoading: (loading: boolean) => void
  appendToLastMessage: (content: string) => void
  clearMessages: () => void
}

export const useCoachStore = create<CoachState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  isLoading: false,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (activeConversationId) => set({ activeConversationId }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setLoading: (isLoading) => set({ isLoading }),
  appendToLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      if (messages.length > 0) {
        const last = messages[messages.length - 1]
        if (last.role === 'assistant') {
          messages[messages.length - 1] = {
            ...last,
            content: last.content + content,
          }
        }
      }
      return { messages }
    }),
  clearMessages: () => set({ messages: [], activeConversationId: null }),
}))
