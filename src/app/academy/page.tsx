'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Heart,
  Rocket,
  Briefcase,
  Globe,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface CourseTrack {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  modules: string;
  color: string;
  url: string;
  external?: boolean;
}

const courseTracks: CourseTrack[] = [
  {
    id: 'essentials',
    title: 'AI Essentials',
    description: 'What is AI and how do I actually use it?',
    icon: Sparkles,
    modules: '6 modules',
    color: '#F5C842',
    url: 'https://www.skool.com/earth-station-by-et-ai-5562/classroom',
    external: true,
  },
  {
    id: 'life',
    title: 'AI for Your Life',
    description: 'How can AI help me and my family right now?',
    icon: Heart,
    modules: '5 modules',
    color: '#00B89C',
    url: 'https://www.skool.com/earth-station-by-et-ai-5562/classroom',
    external: true,
  },
  {
    id: 'hustle',
    title: 'AI for Your Hustle',
    description: 'How do I use AI to build something and make money?',
    icon: Rocket,
    modules: '5 modules',
    color: '#F5C842',
    url: 'https://www.skool.com/earth-station-by-et-ai-5562/classroom',
    external: true,
  },
  {
    id: 'career',
    title: 'AI for Your Career',
    description: 'How do I level up at work with AI?',
    icon: Briefcase,
    modules: '5 modules',
    color: '#2E5FA3',
    url: 'https://www.skool.com/earth-station-by-et-ai-5562/classroom',
    external: true,
  },
  {
    id: 'language',
    title: 'Language Academy',
    description: 'Learn a new language with AI-powered practice',
    icon: Globe,
    modules: '3 language tracks',
    color: '#C9A84C',
    url: 'https://et-ai-language-academy.vercel.app',
    external: true,
  },
];

const steps = [
  {
    number: '1',
    title: 'Pick Your Track',
    description: 'Choose from 5 AI learning paths',
  },
  {
    number: '2',
    title: 'Learn at Your Pace',
    description: 'Self-paced modules with real-world exercises',
  },
  {
    number: '3',
    title: 'Practice with Real Tools',
    description: 'Use AI Studio and Prompt Packs to apply what you learn',
  },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-700">
                Bringing AI Down to Earth
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            AI Academy
          </h1>

          {/* Subtext */}
          <p className="text-center text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Learn AI at your own pace. No jargon. No gatekeeping.
          </p>
        </div>
      </section>

      {/* Course Tracks Grid */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseTracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <div
                  key={track.id}
                  className="group relative h-full rounded-2xl bg-white border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300"
                >
                  {/* Accent bar at top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ backgroundColor: track.color }}
                  />

                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className="inline-flex p-3 rounded-lg"
                      style={{ backgroundColor: `${track.color}20` }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: track.color }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {track.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 flex-grow">
                    {track.description}
                  </p>

                  {/* Module count */}
                  <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>{track.modules}</span>
                  </div>

                  {/* Button */}
                  <a
                    href={track.url}
                    target={track.external ? '_blank' : undefined}
                    rel={track.external ? 'noopener noreferrer' : undefined}
                  >
                    <Button
                      className="w-full"
                      style={{
                        backgroundColor: track.color,
                        color: '#1B2A4A',
                      }}
                    >
                      Start Learning
                      {track.external && (
                        <ExternalLink className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 lg:py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                {/* Step number circle */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-glow-gold text-cosmic-navy font-bold text-lg mb-4">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-gradient-to-r from-cosmic-navy to-slate-800 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to start?
            </h2>
            <p className="text-slate-200 mb-8">
              Join Earth Station and get access to AI Essentials free.
            </p>
            <a
              href="https://www.skool.com/earth-station-by-et-ai-5562"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-glow-gold hover:bg-yellow-500 text-cosmic-navy font-semibold px-8 py-3">
                Join Earth Station
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
