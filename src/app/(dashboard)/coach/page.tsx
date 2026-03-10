/* eslint-disable */
'use client'

import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCoachStore } from '@/stores/coach-store'
import { useUserStore } from '@/stores/user-store'
import { ChatInterface } from '@/components/coach/ChatInterface'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function CoachPage() {
  const { profile } = useUserStore()
  const { activeConversationId, setActiveConversation, clearMessages } = useCoachStore()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.id) return

    async function getOrCreateConversation() {
      setLoading(true)
      const supabase = createClient()

      // Get the most recent active conversation
      const { data: existing } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', profile!.id)
        .eq('is_active', true)
        .eq('conversation_type', 'coaching')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existing) {
        setConversationId(existing.id)
        setActiveConversation(existing.id)
      } else {
        // Create new conversation
        const { data: newConv } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: profile!.id,
            conversation_type: 'coaching',
            title: `Session ${new Date().toLocaleDateString()}`,
          })
          .select('id')
          .single()

        if (newConv) {
          setConversationId(newConv.id)
          setActiveConversation(newConv.id)
        }
      }
      setLoading(false)
    }

    getOrCreateConversation()
  }, [profile?.id, setActiveConversation])

  async function startNewConversation() {
    if (!profile?.id) return
    const supabase = createClient()

    const { data: newConv } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: profile.id,
        conversation_type: 'coaching',
        title: `Session ${new Date().toLocaleDateString()}`,
      })
      .select('id')
      .single()

    if (newConv) {
      clearMessages()
      setConversationId(newConv.id)
      setActiveConversation(newConv.id)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1B2A4A] dark:text-white">ET AI Health Coach</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Your coach has your recent health data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs">Online</Badge>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={startNewConversation}>
            <PlusCircle className="w-3 h-3" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        {loading || !conversationId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <span className="font-bold text-[#1B2A4A]">ET</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading your coach...</p>
            </div>
          </div>
        ) : (
          <ChatInterface conversationId={conversationId} />
        )}
      </div>
    </div>
  )
}

