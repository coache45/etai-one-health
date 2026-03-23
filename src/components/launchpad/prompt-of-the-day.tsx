import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PromptOfTheDayProps {
  prompt: {
    packId: string
    packTitle: string
    prompt: {
      id: string
      title: string
      description: string
    }
  } | null
}

export function PromptOfTheDay({ prompt }: PromptOfTheDayProps) {
  if (!prompt) return null

  return (
    <Card className="border-2 border-[#C9A84C]/20 bg-gradient-to-r from-[#C9A84C]/5 to-transparent">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider">
                Prompt of the Day
              </span>
            </div>
            <h3 className="font-bold text-[#1B2A4A] text-lg mb-1">
              {prompt.prompt.title}
            </h3>
            <p className="text-sm text-slate-500 mb-1">
              {prompt.prompt.description}
            </p>
            <p className="text-xs text-slate-400">
              from {prompt.packTitle}
            </p>
          </div>
          <Link
            href="/studio"
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 transition-colors shrink-0 ml-4"
          >
            Try it
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
