import { Card, CardContent } from '@/components/ui/card'

interface MemoryPrompt {
  id: string
  prompt_type: string
  prompt_text: string
  prompt_priority: number
  effectiveness_score: number | null
  total_deliveries: number | null
  positive_responses: number | null
  is_active: boolean
}

interface MemoryPromptsListProps {
  prompts: MemoryPrompt[]
}

const typeColors: Record<string, string> = {
  identity: 'bg-purple-100 text-purple-700',
  orientation: 'bg-blue-100 text-blue-700',
  routine: 'bg-green-100 text-green-700',
  social: 'bg-pink-100 text-pink-700',
  medication: 'bg-orange-100 text-orange-700',
}

function EffectivenessBar({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-xs text-[#1B2A4A]/30">--</span>
  }

  const pct = Math.round(score * 100)
  const color =
    score >= 0.7
      ? 'bg-emerald-500'
      : score >= 0.4
        ? 'bg-[#C9A84C]'
        : 'bg-red-400'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#1B2A4A]/10">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-[#1B2A4A]/60">{pct}%</span>
    </div>
  )
}

export function MemoryPromptsList({ prompts }: MemoryPromptsListProps) {
  if (prompts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]/50">
            Memory Prompts
          </h3>
          <p className="text-sm text-[#1B2A4A]/40">
            No memory prompts configured for this patient.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]/50">
          Recent Memory Prompts
        </h3>
        <div className="space-y-3">
          {prompts.map((prompt) => {
            const typeColor =
              typeColors[prompt.prompt_type] ?? 'bg-gray-100 text-gray-600'
            const deliveries = prompt.total_deliveries ?? 0
            const positive = prompt.positive_responses ?? 0

            return (
              <div
                key={prompt.id}
                className="flex items-start gap-3 rounded-lg border border-[#1B2A4A]/5 bg-[#1B2A4A]/[0.02] p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeColor}`}
                    >
                      {prompt.prompt_type}
                    </span>
                    {!prompt.is_active && (
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-[#1B2A4A]/80">
                    {prompt.prompt_text}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <EffectivenessBar score={prompt.effectiveness_score} />
                  {deliveries > 0 && (
                    <p className="mt-1 text-[10px] text-[#1B2A4A]/40">
                      {positive}/{deliveries} positive
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
