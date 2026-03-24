import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchGuideBySlug } from '@/lib/guides/queries'
import { DIFFICULTY_CONFIG, STEP_COLORS } from '@/types/guides'
import type { GuideChapter } from '@/types/guides'

interface PageProps {
  params: { slug: string }
}

const CHAPTER_NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

function ChapterCard({ chapter, index }: { chapter: GuideChapter; index: number }) {
  const numberEmoji = CHAPTER_NUMBER_EMOJIS[index] ?? `${index + 1}.`

  return (
    <div className="rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm">
      {/* Chapter header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{numberEmoji}</span>
        <div>
          <h2 className="text-xl font-bold text-[#1B2A4A]">
            {chapter.emoji} {chapter.title}
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="prose prose-sm max-w-none text-[#1B2A4A]/80 leading-relaxed">
        {chapter.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
        ))}
      </div>

      {/* Analogy box */}
      {chapter.analogy && (
        <div className="mt-5 rounded-xl border-2 border-dashed border-[#C9A84C]/40 bg-[#C9A84C]/5 p-5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">
              Think of it like...
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#1B2A4A]/70 italic">
            {chapter.analogy}
          </p>
        </div>
      )}

      {/* Step cards */}
      {chapter.steps && chapter.steps.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1B2A4A]/40">
            Action Steps
          </p>
          {chapter.steps.map((step, si) => {
            const borderColor = STEP_COLORS[si % STEP_COLORS.length]
            return (
              <div
                key={si}
                className={`rounded-lg border border-[#1B2A4A]/5 border-l-4 ${borderColor} bg-[#1B2A4A]/[0.015] p-4`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A]/5 text-xs font-bold text-[#1B2A4A]/50">
                    {step.icon ?? si + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#1B2A4A] text-sm">{step.title}</p>
                    <p className="mt-0.5 text-sm text-[#1B2A4A]/60">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default async function GuideViewerPage({ params }: PageProps) {
  const guide = await fetchGuideBySlug(params.slug)

  if (!guide) {
    notFound()
  }

  const diffConfig = DIFFICULTY_CONFIG[guide.difficulty]

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      {/* Top nav bar */}
      <header className="sticky top-0 z-10 border-b border-[#1B2A4A]/5 bg-[#FBF8F1]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href="/guides"
            className="flex items-center gap-2 text-sm font-medium text-[#1B2A4A]/50 transition-colors hover:text-[#1B2A4A]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Academy
          </Link>
          <Link href="/dashboard" className="text-xs font-medium text-[#C9A84C] hover:underline">
            ET AI ONE Health
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Guide header */}
        <div className="mb-10 text-center">
          <span className="text-5xl">{guide.emoji}</span>
          <h1 className="mt-4 text-3xl font-black text-[#1B2A4A] sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-2 text-lg text-[#1B2A4A]/50">{guide.tagline}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${diffConfig.bg} ${diffConfig.color}`}>
              {diffConfig.label}
            </span>
            <span className="text-xs text-[#1B2A4A]/30">
              {guide.chapters.length} {guide.chapters.length === 1 ? 'chapter' : 'chapters'}
            </span>
          </div>
        </div>

        {/* Table of contents */}
        {guide.chapters.length > 2 && (
          <div className="mb-8 rounded-2xl border border-[#1B2A4A]/5 bg-white/60 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1B2A4A]/30">
              In this guide
            </p>
            <ol className="space-y-1.5">
              {guide.chapters.map((ch, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#1B2A4A]/60">
                  <span className="text-base">{ch.emoji}</span>
                  <span>{ch.title}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Chapters */}
        <div className="space-y-6">
          {guide.chapters.map((chapter, i) => (
            <ChapterCard key={i} chapter={chapter} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl bg-[#1B2A4A] p-8 text-center text-white">
          <p className="text-sm font-medium text-white/50">Ready to take action?</p>
          <h3 className="mt-1 text-xl font-bold">Start your learning journey today</h3>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/guides"
              className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              More Lessons
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">
          ET AI ONE Health &middot; Bringing AI Down to Earth
        </p>
      </footer>
    </div>
  )
}
