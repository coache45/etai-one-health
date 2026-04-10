import Link from 'next/link'
import {
  Zap,
  BookOpen,
  Mic,
  GraduationCap,
  Heart,
  Globe,
  Cpu,
  Shield,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const platformSections = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'ELI5 Guides',
    description:
      'AI, health, money, and tech — explained so simply a five-year-old could follow along. No jargon. No gatekeeping.',
    href: '/guides',
    cta: 'Browse Guides',
    count: '130+',
    countLabel: 'lessons live',
    live: true,
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: 'The O-Spot',
    description:
      'Real talk about AI, health, business, and building a life on your own terms. Hosted by Ernest and Tanja Owens.',
    href: '/guides?tab=podcast',
    cta: 'Listen Now',
    count: null,
    countLabel: null,
    live: false,
    comingSoon: true,
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Mini-Courses',
    description:
      'Structured learning paths you can finish in a weekend. Go from curious to confident — no degree required.',
    href: '/guides?tab=courses',
    cta: 'Explore Courses',
    count: null,
    countLabel: null,
    live: false,
    comingSoon: true,
  },
]

const ecosystemApps = [
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'ONE Health',
    description:
      'AI coaching, sleep tracking, stress mastery, and the first couples health dashboard. Your body, your data, your coach.',
    href: 'https://et-ai-one-health.vercel.app',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    external: true,
    status: 'Live',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Language Academy',
    description:
      'Learn English, Italian, and Spanish with AI-powered lessons built on real teaching frameworks. More languages coming.',
    href: 'https://et-ai-language-academy.vercel.app',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    external: true,
    status: 'Live',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'AETHELFORGE',
    description:
      'Parametric CAD engine for designing real hardware. Two patents filed. The tool that builds what ET AI dreams.',
    href: 'https://aethelforge.vercel.app',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    external: true,
    status: 'Live',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Guardian',
    description:
      'Health monitoring and alert system. CPR scores, trend tracking, and real-time alerts when something needs attention.',
    href: 'https://et-ai-guardian.vercel.app',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    external: true,
    status: 'Coming Soon',
  },
]

export default function PlatformHub() {
  return (
    <div className="min-h-screen bg-[#FBF8F1] dark:bg-gray-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#1B2A4A]" />
          </div>
          <span className="font-bold text-[#1B2A4A] dark:text-white">ET AI Academy</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/guides" className="hidden sm:block">
            <Button variant="ghost" className="text-[#1B2A4A] dark:text-white text-sm">
              Guides
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-[#1B2A4A] dark:text-white text-sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="gold">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 text-[#1B2A4A] dark:text-[#C9A84C] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-4 h-4" />
          Bringing AI Down to Earth
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-[#1B2A4A] dark:text-white leading-tight mb-6">
          Learn anything.
          <span className="text-[#C9A84C]"> Understand everything.</span>
        </h1>
        <p className="text-xl text-[#1B2A4A]/60 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          ET AI Academy is where AI stops being scary and starts being useful. Free guides, real
          tools, and a community that speaks plain English — not tech jargon.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/guides">
            <Button variant="gold" size="lg" className="gap-2">
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg">
              Create Account
            </Button>
          </Link>
        </div>
        <p className="text-xs text-[#1B2A4A]/30 mt-4">
          No credit card. No degree required. Just curiosity.
        </p>
      </section>

      {/* Platform Content Sections */}
      <section className="px-6 py-16 bg-white/60 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
              The Academy
            </h2>
            <p className="text-[#1B2A4A]/50 dark:text-gray-400">
              Three ways to learn. All free to start. All explained like you&apos;re five.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {platformSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-[#1B2A4A]/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#1B2A4A]/10 dark:bg-[#C9A84C]/10 rounded-xl flex items-center justify-center text-[#1B2A4A] dark:text-[#C9A84C]">
                    {section.icon}
                  </div>
                  {section.live && section.count && (
                    <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full">
                      {section.count} {section.countLabel}
                    </span>
                  )}
                  {section.comingSoon && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B2A4A]/40 bg-[#1B2A4A]/5 px-2.5 py-1 rounded-full">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A84C] opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                      </span>
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2 text-lg">
                  {section.title}
                </h3>
                <p className="text-sm text-[#1B2A4A]/50 dark:text-gray-400 leading-relaxed mb-4">
                  {section.description}
                </p>
                <span className="text-sm font-semibold text-[#C9A84C] group-hover:underline flex items-center gap-1">
                  {section.cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Apps */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
              The Ecosystem
            </h2>
            <p className="text-[#1B2A4A]/50 dark:text-gray-400 max-w-xl mx-auto">
              One brand. Multiple tools. Each app does one thing really well — and they all talk to each other.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {ecosystemApps.map((app) => (
              <a
                key={app.title}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-[#1B2A4A]/5 hover:border-[#C9A84C]/20"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${app.color}`}
                >
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white">
                      {app.title}
                    </h3>
                    <ExternalLink className="w-3 h-3 text-[#1B2A4A]/20 group-hover:text-[#C9A84C] transition-colors" />
                    <span
                      className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Live'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-[#C9A84C]/10 text-[#C9A84C]'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#1B2A4A]/50 dark:text-gray-400 leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="px-6 py-16 bg-[#1B2A4A] dark:bg-[#0D1B2A]">
        <div className="max-w-3xl mx-auto text-center">
          <Users className="w-10 h-10 text-[#C9A84C] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Earth Station
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
            The community where AI meets real life. Ask questions, share wins, and connect with
            people who are building the future — not just reading about it.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://www.skool.com/earth-station"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gold" size="lg" className="gap-2">
                Join Earth Station <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <a
              href="https://etaiworld.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Visit etaiworld.ai
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* The O-Spot Thread */}
      <section className="px-6 py-12 bg-[#C9A84C]/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-[#C9A84C] mb-2">The Thread That Connects It All</p>
          <h3 className="text-2xl font-bold text-[#1B2A4A] dark:text-white mb-6">
            The O-Spot
          </h3>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-[#1B2A4A]/50">
            <a
              href="https://etaiworld.ai/podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              <Mic className="w-4 h-4" /> Podcast
            </a>
            <span className="text-[#1B2A4A]/10">|</span>
            <Link
              href="/guides?tab=podcast"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Academy
            </Link>
            <span className="text-[#1B2A4A]/10">|</span>
            <a
              href="https://instagram.com/the.o.spot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              Instagram
            </a>
            <span className="text-[#1B2A4A]/10">|</span>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              Spotify
            </a>
            <span className="text-[#1B2A4A]/10">|</span>
            <a
              href="https://youtube.com/@TheOSpotPodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#1B2A4A]/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#C9A84C] rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#1B2A4A]" />
            </div>
            <span className="font-bold text-[#1B2A4A] dark:text-white text-sm">ET AI Academy</span>
          </div>
          <p className="text-xs text-[#1B2A4A]/30">
            &copy; {new Date().getFullYear()} ET AI, LLC. Charlotte, North Carolina.
            Bringing AI Down to Earth.
          </p>
        </div>
      </footer>
    </div>
  )
}
