import Link from 'next/link'
import {
  Zap,
  Heart,
  Users,
  Moon,
  Brain,
  Activity,
  MessageCircle,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'AI Health Coach',
    description:
      'A coach who actually knows you. Powered by your real health data — not generic advice.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Couples Health Tracking',
    description:
      'The only health app built for couples. Track together, see your Sync Score, grow stronger as a unit.',
  },
  {
    icon: <Moon className="w-6 h-6" />,
    title: 'Sleep Intelligence',
    description:
      'Understand your sleep beyond just hours. Deep, REM, stages, and what it means for tomorrow.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Stress Mastery',
    description:
      'HRV-based stress tracking that shows you the pattern before you feel it.',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Readiness Score',
    description:
      'One number. Everything factored in. Know if today is a push day or a recover day.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Guided Programs',
    description:
      '14 to 30-day programs for sleep, stress, energy, and couples — built by wellness experts.',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Start tracking today',
    features: ['Manual health logging', 'Basic Readiness Score', '7-day history', 'Limited AI Coach'],
    cta: 'Get Started Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For the serious self-improver',
    features: [
      'Everything in Free',
      'Unlimited AI Coach',
      'All health programs',
      'Weekly insight reports',
      'Advanced trend analysis',
      'Apple Health sync',
    ],
    cta: 'Start Pro',
    href: '/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Couples',
    price: '$29',
    period: '/mo',
    description: 'For you and your partner',
    features: [
      'Everything in Pro',
      'Couples Sync Score',
      'Side-by-side dashboard',
      'Couples AI Coach',
      'Shared goals',
      'Couples programs',
    ],
    cta: 'Start Together',
    href: '/signup?plan=couples',
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F5C842] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#1B2A4A]" />
          </div>
          <span className="font-bold text-[#1B2A4A] dark:text-white">ET AI ONE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-[#1B2A4A] dark:text-white">
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
        <div className="inline-flex items-center gap-2 bg-[#F5C842]/10 text-[#1B2A4A] dark:text-[#F5C842] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-4 h-4" />
          Bringing AI Down to Earth
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-[#1B2A4A] dark:text-white leading-tight mb-6">
          The health app that
          <span className="text-[#F5C842]"> actually knows you.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          ET AI ONE combines AI coaching, sleep intelligence, stress tracking, and the
          world&apos;s first couples health dashboard — all in one warm, human platform.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button variant="gold" size="lg" className="gap-2">
              Start Free Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          No credit card required. Free plan available.
        </p>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-[#F8F9FA] dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Built for real people with real lives — not elite athletes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-[#1B2A4A]/10 dark:bg-[#F5C842]/10 rounded-xl flex items-center justify-center mb-4 text-[#1B2A4A] dark:text-[#F5C842]">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                {feature.title === 'Couples Health Tracking' && (
                  <span className="inline-block mt-3 text-xs font-bold text-[#F5C842] bg-[#F5C842]/10 px-2 py-1 rounded-full">
                    #1 Market Differentiator
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
              Simple, honest pricing.
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 ${
                  plan.highlighted
                    ? 'bg-[#1B2A4A] text-white ring-4 ring-[#F5C842]'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                }`}
              >
                <h3
                  className={`font-bold text-xl mb-1 ${
                    plan.highlighted ? 'text-white' : 'text-[#1B2A4A] dark:text-white'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.highlighted ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-[#F5C842]' : 'text-[#1B2A4A] dark:text-white'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={plan.highlighted ? 'text-white/60 text-sm' : 'text-gray-400 text-sm'}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        className={`w-4 h-4 shrink-0 ${
                          plan.highlighted ? 'text-[#F5C842]' : 'text-green-500'
                        }`}
                      />
                      <span className={plan.highlighted ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'gold' : 'default'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#F5C842] rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#1B2A4A]" />
            </div>
            <span className="font-bold text-[#1B2A4A] dark:text-white text-sm">ET AI ONE</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ET AI, LLC. Charlotte, North Carolina.
            Bringing AI Down to Earth.
          </p>
        </div>
      </footer>
    </div>
  )
}
