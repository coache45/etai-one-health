'use client'

import { useCallback } from 'react'
import { useCoachStore } from '@/stores/coach-store'
import type { ChatMessage } from '@/types/ai'

export function useAICoach() {
  const {
    messages,
    isStreaming,
    addMessage,
    appendToLastMessage,
    setStreaming,
    setLoading,
  } = useCoachStore()

  const sendMessage = useCallback(
    async (content: string, conversationId: string) => {
      const userMessage: ChatMessage = { role: 'user', content }
      addMessage(userMessage)

      const assistantMessage: ChatMessage = { role: 'assistant', content: '' }
      addMessage(assistantMessage)
      setStreaming(true)

      try {
        const response = await fetch('/api/ai/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            conversationId,
            history: messages.slice(-10),
          }),
        })

        if (!response.ok) throw new Error('Failed to get response')
        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          appendToLastMessage(chunk)
        }
      } catch (error) {
        appendToLastMessage(
          "\n\nSorry, I'm having trouble connecting right now. Try again in a moment."
        )
        console.error('Coach error:', error)
      } finally {
        setStreaming(false)
      }
    },
    [messages, addMessage, appendToLastMessage, setStreaming]
  )

  return { messages, isStreaming, sendMessage, setLoading }
}
