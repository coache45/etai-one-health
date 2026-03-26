'use client';

import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  Calendar,
  Trophy,
  BookOpen,
  Globe,
  Mic,
  ExternalLink,
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: Feature[] = [
  {
    id: 'discussions',
    title: 'Community Discussions',
    description: 'Share ideas, ask questions, learn from each other',
    icon: MessageCircle,
  },
  {
    id: 'workshops',
    title: 'AI Workshops',
    description: 'Live sessions and 10-minute shorts from Ernest and Tanja',
    icon: Calendar,
  },
  {
    id: 'leaderboards',
    title: 'Leaderboards',
    description: 'Track your progress and celebrate wins',
    icon: Trophy,
  },
  {
    id: 'courses',
    title: 'Course Library',
    description: 'Structured AI Academy courses at your own pace',
    icon: BookOpen,
  },
  {
    id: 'language',
    title: 'Language Challenges',
    description: 'Weekly multilingual practice with the community',
    icon: Globe,
  },
  {
    id: 'ospot',
    title: 'O-Spot Discussions',
    description: 'React to episodes and ask your questions',
    icon: Mic,
  },
];

const SKOOL_URL = 'https://www.skool.com/earth-station-by-et-ai-5562';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Main Heading */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Earth Station
          </h1>

          {/* Subtext */}
          <p className="text-center text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Real people. Real AI. No jargon, no gatekeeping.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group relative h-full rounded-2xl bg-white border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300"
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-lg bg-signal-blue/10">
                      <IconComponent className="w-6 h-6 text-signal-blue" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 lg:py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Built by a husband-and-wife team from Charlotte, NC
            </h2>
            <p className="text-slate-600 mb-6">
              Join thousands of learners building AI skills together
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100">
              <span className="text-sm font-mono text-slate-700">
                {SKOOL_URL}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-gradient-to-r from-cosmic-navy to-slate-800 p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
              Join Earth Station
            </h2>
            <p className="text-slate-200 text-center mb-8">
              Connect with a community of real people learning AI together
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={SKOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button className="w-full bg-glow-gold hover:bg-yellow-500 text-cosmic-navy font-semibold">
                  Join Earth Station
                </Button>
              </a>

              <a
                href={SKOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                >
                  Already a member? Sign In
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
