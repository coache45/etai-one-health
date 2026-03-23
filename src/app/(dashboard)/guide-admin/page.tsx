'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DIFFICULTY_CONFIG, CATEGORY_CONFIG } from '@/types/guides'
import type { ELI5Guide, GuideCategory } from '@/types/guides'

type ModalMode = 'closed' | 'generate' | 'create' | 'edit'

interface GenerateForm {
  topic: string
  category: GuideCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  publish: boolean
}

export default function GuidesAdminPage() {
  const [guides, setGuides] = useState<ELI5Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<ModalMode>('closed')
  const [generating, setGenerating] = useState(false)
  const [genForm, setGenForm] = useState<GenerateForm>({
    topic: '',
    category: 'general',
    difficulty: 'beginner',
    publish: false,
  })
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadGuides = useCallback(async () => {
    try {
      const res = await fetch('/api/guides/crud')
      const data = await res.json()
      setGuides(data.guides || [])
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load guides' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGuides()
  }, [loadGuides])

  const handleGenerate = async () => {
    if (!genForm.topic.trim()) return
    setGenerating(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/guides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genForm),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatusMessage({ type: 'error', text: data.error || 'Generation failed' })
        return
      }

      setStatusMessage({
        type: 'success',
        text: `Generated "${data.title}" (${data.chapters_count} chapters) → ${data.url}`,
      })
      setModalMode('closed')
      setGenForm({ topic: '', category: 'general', difficulty: 'beginner', publish: false })
      loadGuides()
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error during generation' })
    } finally {
      setGenerating(false)
    }
  }

  const handleTogglePublish = async (guide: ELI5Guide) => {
    try {
      const res = await fetch('/api/guides/crud', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: guide.id, is_published: !guide.is_published }),
      })

      if (res.ok) {
        loadGuides()
        setStatusMessage({
          type: 'success',
          text: `"${guide.title}" ${guide.is_published ? 'unpublished' : 'published'}`,
        })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to update' })
    }
  }

  const handleDelete = async (guide: ELI5Guide) => {
    if (!confirm(`Delete "${guide.title}"? This cannot be undone.`)) return

    try {
      const res = await fetch('/api/guides/crud', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: guide.id }),
      })

      if (res.ok) {
        loadGuides()
        setStatusMessage({ type: 'success', text: `Deleted "${guide.title}"` })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">ELI5 Guides</h1>
          <p className="text-sm text-[#1B2A4A]/50">
            Create and manage plain-language health guides
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalMode('generate')}
            className="rounded-xl bg-[#C9A84C] px-4 py-2.5 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
          >
            ✨ Generate with AI
          </button>
        </div>
      </div>

      {/* Status message */}
      {statusMessage && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.text}
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-3 opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black text-[#1B2A4A]">{guides.length}</p>
            <p className="text-xs text-[#1B2A4A]/40">Total Guides</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black text-emerald-600">
              {guides.filter((g) => g.is_published).length}
            </p>
            <p className="text-xs text-[#1B2A4A]/40">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black text-amber-600">
              {guides.filter((g) => !g.is_published).length}
            </p>
            <p className="text-xs text-[#1B2A4A]/40">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Guides table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Guides</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-[#1B2A4A]/30">Loading...</p>
          ) : guides.length === 0 ? (
            <div className="py-8 text-center">
              <span className="text-3xl">📝</span>
              <p className="mt-2 text-sm text-[#1B2A4A]/40">
                No guides yet. Click &quot;Generate with AI&quot; to create your first one.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1B2A4A]/5">
              {guides.map((guide) => {
                const diffConfig = DIFFICULTY_CONFIG[guide.difficulty]
                const catConfig = CATEGORY_CONFIG[guide.category as GuideCategory] ?? CATEGORY_CONFIG.general

                return (
                  <div key={guide.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="text-2xl">{guide.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/guides/${guide.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-semibold text-[#1B2A4A] hover:text-[#C9A84C] transition-colors"
                        >
                          {guide.title}
                        </a>
                        {guide.is_published ? (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            LIVE
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-400">
                            DRAFT
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-[#1B2A4A]/40">
                        <span>{catConfig.emoji} {catConfig.label}</span>
                        <span className={`${diffConfig.color}`}>{diffConfig.label}</span>
                        <span>{guide.chapters.length} chapters</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(guide)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          guide.is_published
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {guide.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(guide)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate modal */}
      {modalMode === 'generate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1B2A4A]">✨ Generate ELI5 Guide</h2>
              <button
                onClick={() => setModalMode('closed')}
                className="text-[#1B2A4A]/30 hover:text-[#1B2A4A]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#1B2A4A]/50">
                  Topic
                </label>
                <input
                  type="text"
                  value={genForm.topic}
                  onChange={(e) => setGenForm({ ...genForm, topic: e.target.value })}
                  placeholder="e.g., How sleep affects your immune system"
                  className="w-full rounded-lg border border-[#1B2A4A]/10 px-3 py-2.5 text-sm text-[#1B2A4A] placeholder:text-[#1B2A4A]/30 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  disabled={generating}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1B2A4A]/50">
                    Category
                  </label>
                  <select
                    value={genForm.category}
                    onChange={(e) => setGenForm({ ...genForm, category: e.target.value as GuideCategory })}
                    className="w-full rounded-lg border border-[#1B2A4A]/10 px-3 py-2.5 text-sm text-[#1B2A4A] focus:border-[#C9A84C] focus:outline-none"
                    disabled={generating}
                  >
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.emoji} {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1B2A4A]/50">
                    Difficulty
                  </label>
                  <select
                    value={genForm.difficulty}
                    onChange={(e) => setGenForm({ ...genForm, difficulty: e.target.value as 'beginner' })}
                    className="w-full rounded-lg border border-[#1B2A4A]/10 px-3 py-2.5 text-sm text-[#1B2A4A] focus:border-[#C9A84C] focus:outline-none"
                    disabled={generating}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={genForm.publish}
                  onChange={(e) => setGenForm({ ...genForm, publish: e.target.checked })}
                  className="rounded border-[#1B2A4A]/20"
                  disabled={generating}
                />
                <span className="text-sm text-[#1B2A4A]/60">Publish immediately</span>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalMode('closed')}
                className="flex-1 rounded-xl border border-[#1B2A4A]/10 px-4 py-2.5 text-sm font-medium text-[#1B2A4A]/60 transition-colors hover:bg-gray-50"
                disabled={generating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !genForm.topic.trim()}
                className="flex-1 rounded-xl bg-[#C9A84C] px-4 py-2.5 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a] disabled:opacity-50"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  '✨ Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
