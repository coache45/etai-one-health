import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  countUserOutputsThisWeek,
  insertOutput,
} from '@/lib/studio/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import { FREE_TIER_WEEKLY_LIMIT } from '@/types/studio'

/** POST /api/generate — Claude-powered generation with tier limits */
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const promptText = (body.prompt_text ?? '').trim()
    const packId = body.pack_id ?? null

    if (!promptText || promptText.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt is required (max 10,000 chars)' },
        { status: 400 }
      )
    }

    // Get user profile for tier check
    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = (profile as unknown as { subscription_tier: string })?.subscription_tier ?? 'free'

    // Enforce free tier limits
    if (tier === 'free') {
      const weeklyCount = await countUserOutputsThisWeek(user.id)
      if (weeklyCount >= FREE_TIER_WEEKLY_LIMIT) {
        return NextResponse.json(
          {
            error: 'limit_reached',
            message:
              "You've used your 3 free sessions this week — you're on a roll! Upgrade to Builder for unlimited access.",
            used: weeklyCount,
            limit: FREE_TIER_WEEKLY_LIMIT,
          },
          { status: 403 }
        )
      }
    }

    // Call Claude API
    const claudeApiKey = process.env.ANTHROPIC_API_KEY
    if (!claudeApiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system:
          'You are a helpful AI assistant for ET AI ONE Health — a platform that brings AI down to earth for everyday people, couples, and families. ' +
          'Write in a warm, encouraging tone. Use clear language, no jargon. ' +
          'Format your response with clear sections, bullet points where helpful, and actionable next steps. ' +
          'Always end with an encouraging note.',
        messages: [{ role: 'user', content: promptText }],
      }),
    })

    if (!claudeResponse.ok) {
      const errBody = await claudeResponse.text()
      console.error('Claude API error:', claudeResponse.status, errBody)
      return NextResponse.json(
        { error: 'AI generation failed. Please try again.' },
        { status: 502 }
      )
    }

    const claudeData = await claudeResponse.json()
    const outputText =
      claudeData.content?.[0]?.text ?? 'Something went wrong — no output generated.'

    // Save to prompt_outputs
    const saved = await insertOutput({
      user_id: user.id,
      pack_id: packId,
      prompt_text: promptText,
      output_text: outputText,
    })

    return NextResponse.json({
      output: saved,
      message: "Here's what we came up with together.",
    })
  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
