'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Mic,
  Zap,
  BookOpen,
  Brain,
  Music,
  Apple,
  Youtube,
} from 'lucide-react';

interface Segment {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const segments: Segment[] = [
  {
    icon: <Zap className="w-8 h-8 text-[#F5C842]" />,
    title: 'We Tried It',
    description:
      "Ernest and Tanja try an AI tool live and react together. Unscripted. Unfiltered.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-[#1E6FBF]" />,
    title: 'ELI5',
    description:
      "One AI concept. One analogy. If Tanja's grandmother wouldn't get it, we rewrite it.",
  },
  {
    icon: <Brain className="w-8 h-8 text-[#1B2A4A]" />,
    title: 'Human in the Loop',
    description:
      'Ernest explains the technical layer. How does it actually work under the hood?',
  },
];

interface Host {
  name: string;
  role: string;
  title: string;
}

const hosts: Host[] = [
  {
    name: 'Ernest',
    role: 'CEO, AI Systems Engineer',
    title: 'The Tech Brain',
  },
  {
    name: 'Tanja',
    role: 'COO, Content Strategist',
    title: 'The Human Filter',
  },
];

export default function PodcastPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1B2A4A] to-[#1E6FBF] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Mic className="w-16 h-16 text-[#F5C842]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            The O-Spot
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto">
            Eavesdrop on the best couple's debate about AI.
          </p>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B2A4A] mb-12 text-center">
            Our Segments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="mb-4">{segment.icon}</div>
                <h3 className="text-2xl font-bold text-[#1B2A4A] mb-3">
                  {segment.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {segment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B2A4A] mb-12 text-center">
            Meet Your Hosts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {hosts.map((host, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] rounded-2xl p-8 text-center border border-gray-200"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#1B2A4A] to-[#1E6FBF] mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#F5C842]">
                    {host.name[0]}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1B2A4A] mb-2">
                  {host.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 font-mono">
                  {host.role}
                </p>
                <p className="text-lg font-semibold text-[#1E6FBF] italic">
                  "{host.title}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#F5C842] to-[#F5C842]/80">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-[#1B2A4A] mb-8 max-w-2xl mx-auto">
            Subscribe to get notified when we launch The O-Spot and never miss an
            episode.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-6 py-3 rounded-lg bg-white text-[#1B2A4A] placeholder-gray-400 flex-1 max-w-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            />
            <Button className="bg-[#1B2A4A] hover:bg-[#0f1620] text-white px-8 py-3">
              Notify Me
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <p className="text-[#1B2A4A] font-semibold text-sm">
              Subscribe on your platform:
            </p>
            <div className="flex gap-4">
              <a
                href="#spotify"
                className="bg-white hover:bg-gray-100 rounded-lg p-3 transition-colors"
                aria-label="Spotify"
              >
                <Music className="w-6 h-6 text-[#1DB954]" />
              </a>
              <a
                href="#apple"
                className="bg-white hover:bg-gray-100 rounded-lg p-3 transition-colors"
                aria-label="Apple Podcasts"
              >
                <Apple className="w-6 h-6 text-[#1B2A4A]" />
              </a>
              <a
                href="#youtube"
                className="bg-white hover:bg-gray-100 rounded-lg p-3 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6 text-red-600" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
