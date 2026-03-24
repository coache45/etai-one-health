import Link from 'next/link'
import { Target, Sparkles, GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const tiles = [
  {
    href: '/goals',
    icon: Target,
    label: 'Work on our goals',
    description: 'Track milestones and celebrate wins',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  {
    href: '/studio',
    icon: Sparkles,
    label: 'Try the AI Studio',
    description: 'Generate ideas, plans, and content',
    color: 'bg-[#C9A84C]/5 text-[#C9A84C] border-[#C9A84C]/20',
    iconBg: 'bg-[#C9A84C]/10',
  },
  {
    href: '/guides',
    icon: GraduationCap,
    label: 'ET AI Academy',
    description: 'Learn at your pace',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    iconBg: 'bg-blue-100',
  },
]

export function QuickStartTiles() {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
        Quick start
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href}>
            <Card className={`border-2 ${tile.color} hover:shadow-md transition-all cursor-pointer h-full`}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${tile.iconBg} flex items-center justify-center mb-3`}>
                  <tile.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1B2A4A] text-sm mb-1">{tile.label}</h3>
                <p className="text-xs text-slate-500">{tile.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
