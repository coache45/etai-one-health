import OpenAI from 'openai'
import { INSIGHT_GENERATION_PROMPT } from './prompts'
import type { AIInsight } from '@/types/ai'
import type { DailyHealthLog } from '@/types/health'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDailyInsight(
  userId: string,
  todayLog: DailyHealthLog,
  recentLogs: DailyHealthLog[]
): Promise<Omit<AIInsight, 'id' | 'generated_at'>> {
  const dataContext = `
TODAY'S LOG (${todayLog.log_date}):
- Sleep: ${todayLog.sleep_hours ?? 'N/A'} hours, quality ${todayLog.sleep_quality ?? 'N/A'}/10
- Energy: ${todayLog.energy_level ?? 'N/A'}/10
- Mood: ${todayLog.mood ?? 'N/A'}/10
- Stress: ${todayLog.stress_level ?? 'N/A'}/10
- Steps: ${todayLog.steps ?? 'N/A'}
- Readiness Score: ${todayLog.readiness_score ?? 'N/A'}

7-DAY AVERAGES:
- Avg sleep: ${getAvg(recentLogs, 'sleep_hours')}h
- Avg stress: ${getAvg(recentLogs, 'stress_level')}/10
- Avg steps: ${getAvg(recentLogs, 'steps')}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: INSIGHT_GENERATION_PROMPT },
      {
        role: 'user',
        content: `Generate a daily insight for this user's health data:\n${dataContext}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content ?? '{}'

  try {
    const parsed = JSON.parse(content)
    return {
      user_id: userId,
      couple_id: null,
      insight_type: 'daily',
      title: parsed.title ?? 'Your Daily Check-In',
      body: parsed.body ?? 'Log more data to see personalized insights.',
      priority: parsed.priority ?? 0,
      is_read: false,
    }
  } catch {
    return {
      user_id: userId,
      couple_id: null,
      insight_type: 'daily',
      title: 'Your Daily Check-In',
      body: 'Great job logging your health data today. Keep building the habit.',
      priority: 0,
      is_read: false,
    }
  }
}

function getAvg(
  logs: DailyHealthLog[],
  key: keyof DailyHealthLog
): string {
  const values = logs
    .map((l) => l[key])
    .filter((v): v is number => v !== null && typeof v === 'number')

  if (values.length === 0) return 'N/A'
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
}
