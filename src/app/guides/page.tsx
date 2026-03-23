import Link from 'next/link'
import { fetchPublishedGuides } from '@/lib/guides/queries'
import { DIFFICULTY_CONFIG, CATEGORY_CONFIG } from '@/types/guides'
import type { GuideCategory, ELI5Guide } from '@/types/guides'

interface PageProps {
  searchParams: { category?: string }
}

function GuideCard({ guide }: { guide: ELI5Guide }) {
  const diffConfig = DIFFICULTY_CONFIG[guide.difficulty]

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#C9A84C]/30 hover:-translate-y-0.5"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-4xl">{guide.emoji}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${diffConfig.bg} ${diffConfig.color}`}>
          {diffConfig.label}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#1B2A4A] group-hover:text-[#C9A84C] transition-colors">
        {guide.title}
      </h3>
      <p className="mt-1 flex-1 text-sm text-[#1B2A4A]/50 line-clamp-2">
        {guide.tagline}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#1B2A4A]/30">
          {guide.chapters.length} {guide.chapters.length === 1 ? 'chapter' : 'chapters'}
        </span>
        <span className="text-xs font-medium text-[#C9A84C] opacity-0 transition-opacity group-hover:opacity-100">
          Read guide →
        </span>
      </div>
    </Link>
  )
}

const ALL_CATEGORIES = Object.entries(CATEGORY_CONFIG) as [GuideCategory, { label: string; emoji: string }][]

export default async function GuidesLibraryPage({ searchParams }: PageProps) {
  const activeCategory = (searchParams.category as GuideCategory) || undefined
  const guides = await fetchPublishedGuides(activeCategory)

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      {/* Header */}
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C9A84C]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 6V14H2V6L8 2Z" fill="#1B2A4A" />
                </svg>
              </div>
              <span className="text-sm font-bold text-[#1B2A4A]">ET AI ONE Health</span>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <span className="text-4xl">📖</span>
          <h1 className="mt-3 text-3xl font-black text-[#1B2A4A] sm:text-4xl">
            Health Guides
          </h1>
          <p className="mt-2 text-lg text-[#1B2A4A]/50">
            Plain-language guides to help you understand your health — no jargon, no judgment.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/guides"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-[#1B2A4A] text-white'
                : 'bg-white text-[#1B2A4A]/60 border border-[#1B2A4A]/10 hover:bg-[#1B2A4A]/5'
            }`}
          >
            All
          </Link>
          {ALL_CATEGORIES.map(([key, config]) => (
            <Link
              key={key}
              href={`/guides?category=${key}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === key
                  ? 'bg-[#1B2A4A] text-white'
                  : 'bg-white text-[#1B2A4A]/60 border border-[#1B2A4A]/10 hover:bg-[#1B2A4A]/5'
              }`}
            >
              {config.emoji} {config.label}
            </Link>
          ))}
        </div>

        {/* Guide grid */}
        {guides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1B2A4A]/10 bg-white/50 p-12 text-center">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-3 text-lg font-bold text-[#1B2A4A]">No guides yet</h3>
            <p className="mt-1 text-sm text-[#1B2A4A]/40">
              {activeCategory
                ? `No published guides in this category yet. Check back soon!`
                : 'Guides are being created. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[#1B2A4A]/30">
            Want personalized guidance?
          </p>
          <Link
            href="/signup"
            className="mt-2 inline-block rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
          >
            Join ONE Health
          </Link>
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">
          ET AI ONE Health &middot; Bringing AI Down to Earth
        </p>
      </footer>
    </div>
  )
}
