'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Loader2, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CategorySelector } from '@/components/studio/category-selector'
import { GOAL_CATEGORIES, DIFFICULTY_LABELS } from '@/types/studio'
import type { PromptPack, GoalCategory } from '@/types/studio'

export default function PacksPage() {
  const router = useRouter()
  const [packs, setPacks] = useState<PromptPack[]>([])
  const [allPacks, setAllPacks] = useState<PromptPack[]>([])
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null)
  const [tier, setTier] = useState('free')
  const [isLoading, setIsLoading] = useState(true)

  const loadPacks = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/studio/packs')
      if (res.ok) {
        const data = await res.json()
        setAllPacks(data.packs ?? [])
        setTier(data.tier ?? 'free')
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPacks()
  }, [loadPacks])

  useEffect(() => {
    if (selectedCategory) {
      setPacks(allPacks.filter((p) => p.category === selectedCategory))
    } else {
      setPacks(allPacks)
    }
  }, [selectedCategory, allPacks])

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center">
              <Package className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Prompt Packs</h1>
              <p className="text-sm text-slate-500">
                Ready-made AI prompts to help you get things done — no expertise needed.
              </p>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Tier info */}
        {tier === 'free' && (
          <div className="mb-6 p-4 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20">
            <p className="text-sm text-[#1B2A4A]">
              <strong>Free plan:</strong> You can see and use free packs.
              Upgrade to <strong>Builder</strong> to unlock everything.
            </p>
          </div>
        )}

        {/* Packs grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
            <span className="ml-2 text-sm text-slate-400">Loading packs...</span>
          </div>
        ) : packs.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">
              No packs here yet — we&apos;re building more every week.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack) => {
              const catConfig = GOAL_CATEGORIES[pack.category]
              const diffConfig = DIFFICULTY_LABELS[pack.difficulty]
              const isLocked = !pack.is_free && tier === 'free'

              return (
                <Card
                  key={pack.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                  onClick={() => !isLocked && router.push('/studio')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{catConfig.emoji}</span>
                      {isLocked && <Lock className="w-5 h-5 text-slate-400" />}
                    </div>

                    <h3 className="font-bold text-[#1B2A4A] text-lg mb-1">{pack.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{pack.description}</p>

                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.bgColor} ${catConfig.color} font-medium`}>
                        {catConfig.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffConfig.color}`}>
                        {diffConfig.label}
                      </span>
                      {pack.is_free ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                          Free
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] font-medium">
                          Builder
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      {pack.prompts?.length ?? 0} prompts inside
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
