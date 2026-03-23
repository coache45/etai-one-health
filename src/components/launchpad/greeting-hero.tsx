import { Sparkles } from 'lucide-react'

interface GreetingHeroProps {
  greeting: string
  userName: string
  partnerName: string | null
}

export function GreetingHero({ greeting, userName, partnerName }: GreetingHeroProps) {
  const displayName = partnerName
    ? `${userName} and ${partnerName}`
    : userName

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#2a3f6b] p-8 text-white">
      {/* Decorative sparkles */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-24 h-24 text-[#C9A84C]" />
      </div>
      <div className="absolute bottom-2 left-6 opacity-10">
        <Sparkles className="w-16 h-16 text-[#C9A84C]" />
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {greeting}, {displayName} <span className="inline-block animate-pulse">✨</span>
        </h1>
        <p className="text-white/70 text-base sm:text-lg">
          Let&apos;s make something together today.
        </p>
      </div>
    </div>
  )
}
