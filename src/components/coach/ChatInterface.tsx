'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatBubble } from './ChatBubble'
import { CoachTyping } from './CoachTyping'
import { SuggestedPrompts } from './SuggestedPrompts'
import { useAICoach } from '@/hooks/useAICoach'
import { useCoachStore } from '@/stores/coach-store'

interface ChatInterfaceProps {
  conversationId: string
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const { messages, isStreaming, sendMessage } = useAICoach()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  async function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    await sendMessage(text, conversationId)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-[#F5C842] rounded-full flex items-center justify-center mb-4 animate-pulse-gold">
              <span className="text-2xl font-bold text-[#1B2A4A]">ET</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1B2A4A] dark:text-white mb-2">
              Your Health Coach
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Ask me anything about your health. I have your recent data and I am here to help.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <CoachTyping />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <SuggestedPrompts onSelect={(p) => setInput(p)} disabled={isStreaming} />
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-[#2D2D2D] dark:text-white placeholder:text-gray-400 resize-none outline-none py-1 max-h-32"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = target.scrollHeight + 'px'
            }}
          />
          <div className="flex items-center gap-1 pb-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400"
              title="Voice input (coming soon)"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="gold"
              className="w-8 h-8 rounded-full"
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
