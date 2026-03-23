'use client'

import { useState } from 'react'
import { ArrowLeft, Copy, Bookmark, Share2, Loader2, Check, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { PromptPack, PackPrompt } from '@/types/studio'

interface PromptWorkspaceProps {
  pack: PromptPack
  onBack: () => void
  onOutputCreated?: () => void
}

export function PromptWorkspace({ pack, onBack, onOutputCreated }: PromptWorkspaceProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<PackPrompt | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [outputId, setOutputId] = useState<string | null>(null)

  function selectPrompt(prompt: PackPrompt) {
    setSelectedPrompt(prompt)
    setFieldValues({})
    setOutput('')
    setError('')
  }

  function buildPromptText(): string {
    if (!selectedPrompt) return ''
    let text = selectedPrompt.template
    for (const field of selectedPrompt.fields) {
      const value = fieldValues[field.name] || field.placeholder
      text = text.replace(`{${field.name}}`, value)
    }
    return text
  }

  async function handleGenerate() {
    if (!selectedPrompt) return
    const promptText = buildPromptText()
    setIsGenerating(true)
    setError('')
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_text: promptText, pack_id: pack.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? data.error ?? 'Something went wrong.')
        return
      }

      setOutput(data.output?.output_text ?? '')
      setOutputId(data.output?.id ?? null)
      onOutputCreated?.()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    if (!outputId) return
    try {
      await fetch('/api/studio/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: outputId, is_saved: true }),
      })
      setSaved(true)
    } catch {
      // ignore
    }
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: 'AI Studio Output', text: output })
    } else {
      await handleCopy()
    }
  }

  const allFieldsFilled = selectedPrompt
    ? selectedPrompt.fields.every((f) => (fieldValues[f.name] ?? '').trim())
    : false

  return (
    <div className="space-y-4">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1B2A4A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to packs
      </button>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#1B2A4A]">{pack.title}</h2>
        <p className="text-sm text-slate-500">{pack.description}</p>
      </div>

      {/* Prompt selector */}
      {!selectedPrompt ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(pack.prompts ?? []).map((prompt) => (
            <Card
              key={prompt.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-[#C9A84C]/40"
              onClick={() => selectPrompt(prompt)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#1B2A4A] mb-1">{prompt.title}</h3>
                <p className="text-sm text-slate-500">{prompt.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Field inputs */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1B2A4A]">{selectedPrompt.title}</h3>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Choose different prompt
                </button>
              </div>
              <p className="text-sm text-slate-500">{selectedPrompt.description}</p>

              {selectedPrompt.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-[#1B2A4A] mb-1 capitalize">
                    {field.name.replace(/_/g, ' ')}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={fieldValues[field.name] ?? ''}
                      onChange={(e) =>
                        setFieldValues((v) => ({ ...v, [field.name]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fieldValues[field.name] ?? ''}
                      onChange={(e) =>
                        setFieldValues((v) => ({ ...v, [field.name]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !allFieldsFilled}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating something great...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <p className="text-sm text-amber-800">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Output */}
          {output && (
            <Card className="border-2 border-[#C9A84C]/30">
              <CardContent className="p-5">
                <p className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wide mb-3">
                  Here&apos;s what we came up with together
                </p>
                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap mb-4">
                  {output}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B2A4A] transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      saved
                        ? 'text-[#C9A84C] font-semibold'
                        : 'text-slate-500 hover:text-[#C9A84C]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#C9A84C]' : ''}`} />
                    {saved ? 'Saved!' : 'Save to Vault'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B2A4A] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
