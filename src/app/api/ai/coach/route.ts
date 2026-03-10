import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streamCoachResponse } from '@/lib/ai/coach'
import type { CoachContext } from '@/types/ai'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message, conversationId, history = [] } = await request.json()

  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  try {
    // Load user profile and today's health data for context
    const [profileRes, todayLogRes] = await Promise.all([
      supabase.from('profiles').select('full_name, display_name, subscription_tier').eq('id', user.id).single(),
      supabase
        .from('daily_health_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', new Date().toISOString().split('T')[0])
        .single(),
    ])

    const profileData = profileRes.data
    const todayLog = todayLogRes.data

    const context: CoachContext = {
      userName: profileData?.display_name ?? profileData?.full_name ?? 'Friend',
      todayLog: todayLog ?? null,
      recentTrends: null,
      activeProgram: null,
      subscriptionTier: profileData?.subscription_tier ?? 'free',
    }

    // Save user message to DB
    if (conversationId) {
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
      })
    }

    const messages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const stream = await streamCoachResponse(messages, context)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 500 }
    )
  }
}
