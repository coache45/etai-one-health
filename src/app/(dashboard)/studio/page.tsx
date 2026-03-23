'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { CategorySelector } from '@/components/studio/category-selector'
import { PackCard } from '@/components/studio/pack-card'
import { PromptWorkspace } from '@/components/studio/prompt-workspace'
import { SessionHistory } from '@/components/studio/session-history'
import { PartnerPresence } from '@/components/partnerships/partner-presence'
import { SharedSession } from '@/components/partnerships/shared-session'
import type { PromptPack, GoalCategory } from '@/types/studio'

export default function StudioPage() {
  const [packs, setPacks] = useState<PromptPack[]>([])
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null)
  const [selectedPack, setSelectedPack] = useState<PromptPack | null>(null)
  const [tier, setTier] = useState('free')
  const [isLoading, setIsLoading] = useState(true)
  const [historyRefresh, setHistoryRefresh] = useState(0)

  const loadPacks = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)

      const res = await fetch(`/api/studio/packs?${params}`)
      if (res.ok) {
        const data = await res.json()
        setPacks(data.packs ?? [])
        setTier(data.tier ?? 'free')
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    loadPacks()
  }, [loadPacks])

  function handleOutputCreated() {
    setHistoryRefresh((n) => n + 1)
  }

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="flex">
        {/* Main content */}
        <div className="flex-1 max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#1B2A4A]">AI Studio</h1>
                <p className="text-sm text-slate-500">
                  Let&apos;s make something together. Pick a category to start.
                </p>
              </div>
              <PartnerPresence />
            </div>
          </div>

          {/* Active workspace (when a pack is selected) */}
          {selectedPack ? (
            <PromptWorkspace
              pack={selectedPack}
              onBack={() => setSelectedPack(null)}
              onOutputCreated={handleOutputCreated}
            />
          ) : (
            <>
              {/* Category selector */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                  What are you working on?
                </h2>
                <CategorySelector
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>

              {/* Pack browser */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {selectedCategory
                    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Packs`
                    : 'All Prompt Packs'}
                </h2>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
                    <span className="ml-2 text-sm text-slate-400">Loading packs...</span>
                  </div>
                ) : packs.length === 0 ? (
                  <div className="text-center py-16">
                    <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      You haven&apos;t started anything yet — and that&apos;s about to change.
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      New packs are coming soon for this category.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {packs.map((pack) => (
                      <PackCard
                        key={pack.id}
                        pack={pack}
                        isLocked={!pack.is_free && tier === 'free'}
                        onSelect={(p) => setSelectedPack(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Session history sidebar (desktop only) */}
        <aside className="hidden xl:block w-72 border-l border-slate-200 bg-white p-4 min-h-screen space-y-6">
          <SessionHistory
            refreshTrigger={historyRefresh}
          />
          <SharedSession refreshTrigger={historyRefresh} />
        </aside>
      </div>
    </div>
  )
}
