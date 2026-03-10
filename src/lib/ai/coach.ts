import OpenAI from 'openai'
import { HEALTH_COACH_SYSTEM_PROMPT, buildCoachContext } from './prompts'
import type { ChatMessage, CoachContext } from '@/types/ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function streamCoachResponse(
  messages: ChatMessage[],
  context: CoachContext
): Promise<ReadableStream> {
  const systemMessage = {
    role: 'system' as const,
    content:
      HEALTH_COACH_SYSTEM_PROMPT +
      '\n\n' +
      buildCoachContext({
        userName: context.userName,
        todayLog: context.todayLog,
        activeProgram: context.activeProgram,
        subscriptionTier: context.subscriptionTier,
      }),
  }

  const formattedMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [systemMessage, ...formattedMessages],
    stream: true,
    max_tokens: 800,
    temperature: 0.75,
  })

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? ''
          if (delta) {
            controller.enqueue(encoder.encode(delta))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}

export async function generateQuickInsight(
  prompt: string,
  context: CoachContext
): Promise<string> {
  const systemMessage =
    HEALTH_COACH_SYSTEM_PROMPT +
    '\n\n' +
    buildCoachContext({
      userName: context.userName,
      todayLog: context.todayLog,
      activeProgram: context.activeProgram,
      subscriptionTier: context.subscriptionTier,
    })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt },
    ],
    max_tokens: 300,
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content ?? 'Unable to generate insight.'
}
