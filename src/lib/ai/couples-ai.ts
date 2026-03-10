import OpenAI from 'openai'
import { COUPLES_AI_SYSTEM_PROMPT } from './prompts'
import type { DailyHealthLog } from '@/types/health'
import type { SharingPreferences } from '@/types/couples'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCouplesInsight(data: {
  partnerAName: string
  partnerBName: string
  partnerALog: DailyHealthLog | null
  partnerBLog: DailyHealthLog | null
  syncScore: number
  sharingA: SharingPreferences
  sharingB: SharingPreferences
}): Promise<{ title: string; body: string }> {
  const aData = buildSharedData(data.partnerALog, data.sharingA)
  const bData = buildSharedData(data.partnerBLog, data.sharingB)

  const prompt = `
Couples data for ${data.partnerAName} and ${data.partnerBName}:
Couples Sync Score: ${data.syncScore}/100

${data.partnerAName}'s shared data:
${JSON.stringify(aData, null, 2)}

${data.partnerBName}'s shared data:
${JSON.stringify(bData, null, 2)}

Generate a warm, specific couples insight in this JSON format:
{"title": "short title", "body": "2-3 sentence insight"}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: COUPLES_AI_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    max_tokens: 200,
    temperature: 0.75,
    response_format: { type: 'json_object' },
  })

  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content ?? '{}')
    return {
      title: parsed.title ?? 'Your Couples Check-In',
      body: parsed.body ?? 'Keep moving together. Shared habits build stronger relationships.',
    }
  } catch {
    return {
      title: 'Your Couples Check-In',
      body: 'Keep moving together. Shared habits build stronger relationships.',
    }
  }
}

function buildSharedData(
  log: DailyHealthLog | null,
  prefs: SharingPreferences
): Record<string, unknown> {
  if (!log) return {}

  const data: Record<string, unknown> = {}
  if (prefs.sleep) {
    data.sleep_hours = log.sleep_hours
    data.sleep_quality = log.sleep_quality
    data.sleep_bedtime = log.sleep_bedtime
  }
  if (prefs.stress) data.stress_level = log.stress_level
  if (prefs.activity) {
    data.steps = log.steps
    data.active_minutes = log.active_minutes
  }
  if (prefs.mood) data.mood = log.mood
  if (prefs.heart_rate) data.resting_heart_rate = log.resting_heart_rate

  return data
}
