'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  Users,
  Moon,
  Brain,
  Activity,
  Heart,
  Sparkles,
  Rocket,
  Globe,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-[#1B2A4A]">ET AI</div>
            </div>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#one-health"
                className="text-gray-700 hover:text-[#1E6FBF] transition"
              >
                ONE Health
              </Link>
              <Link
                href="#academy"
                className="text-gray-700 hover:text-[#1E6FBF] transition"
              >
                Academy
              </Link>
              <Link
                href="#community"
                className="text-gray-700 hover:text-[#1E6FBF] transition"
              >
                Community
              </Link>
              <Link
                href="#products"
                className="text-gray-700 hover:text-[#1E6FBF] transition"
              >
                Products
              </Link>
              <Link
                href="#podcast"
                className="text-gray-700 hover:text-[#1E6FBF] transition"
              >
                Podcast
              </Link>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-gray-700 hover:text-[#1E6FBF] transition"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button variant="gold">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pill Badge */}
          <div className="inline-block mb-6">
            <span className="bg-[#F5C842]/20 text-[#1B2A4A] px-4 py-2 rounded-full text-sm font-semibold">
              Bringing AI Down to Earth
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1B2A4A] mb-6 leading-tight">
            AI for{' '}
            <span className="text-[#F5C842]">real people.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Health tools, education, community, and wearables — built by a real couple from Charlotte, NC.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="gold" size="lg">
                Start Free Today
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('one-health')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Our World
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: ONE Health */}
      <section id="one-health" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] mb-4">
              The health app that actually knows you.
            </h2>
            <p className="text-lg text-gray-600">
              AI that learns your body and helps you thrive.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: MessageCircle,
                title: 'AI Health Coach',
                description: 'Personalized guidance powered by AI.',
              },
              {
                icon: Users,
                title: 'Couples Dashboard',
                description: 'Track health together. Grow together.',
              },
              {
                icon: Moon,
                title: 'Sleep Intelligence',
                description: 'Understand your sleep. Improve your rest.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition"
                >
                  <Icon className="w-12 h-12 text-[#1E6FBF] mb-4" />
                  <h3 className="text-xl font-bold text-[#1B2A4A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/one-health">
              <Button variant="default" size="lg">
                Start Your Health Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: AI Academy */}
      <section id="academy" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] mb-4">
              Learn AI at your own pace.
            </h2>
            <p className="text-lg text-gray-600">
              Courses built for real people with real questions.
            </p>
          </div>

          {/* Track Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Sparkles,
                title: 'AI Essentials',
                description: 'What is AI and how do I actually use it?',
              },
              {
                icon: Rocket,
                title: 'AI for Your Hustle',
                description: 'How do I use AI to build something and make money?',
              },
              {
                icon: Globe,
                title: 'Language Academy',
                description: 'Learn languages with AI-powered coaching.',
              },
            ].map((track, idx) => {
              const Icon = track.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition"
                >
                  <Icon className="w-12 h-12 text-[#F5C842] mb-4" />
                  <h3 className="text-xl font-bold text-[#1B2A4A] mb-2">
                    {track.title}
                  </h3>
                  <p className="text-gray-600">{track.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/academy">
              <Button variant="gold" size="lg">
                Browse All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Earth Station */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1B2A4A] to-[#1E6FBF] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Join the community that actually builds.
          </h2>
          <p className="text-lg text-gray-100 mb-10 max-w-2xl mx-auto">
            Real people sharing real wins. 10-minute AI shorts. Live workshops. No gatekeeping.
          </p>

          <a href="https://www.skool.com/earth-station-by-et-ai-5562" target="_blank" rel="noopener noreferrer">
            <Button variant="gold" size="lg">
              Join Earth Station
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* Section 5: Products */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] mb-4">
              Intelligence You Can Wear.
            </h2>
            <p className="text-lg text-gray-600">
              A complete ecosystem of AI-powered devices.
            </p>
          </div>

          {/* Hero Product Card */}
          <div className="bg-white rounded-2xl border-2 border-[#F5C842] p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-[#1B2A4A] mb-4">Ring One</h3>
                <p className="text-lg text-gray-700 mb-6">
                  AI Smart Ring. HRV, SpO2, temperature, sleep, stress. Your health, always with you.
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-[#1B2A4A]">$149</span>
                  <span className="text-[#F5C842] font-semibold">Pre-Order Coming Q2 2026</span>
                </div>
                <Link href="/products">
                  <Button variant="default">Explore Products</Button>
                </Link>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-[#1E6FBF] to-[#00B89C] rounded-2xl h-64 flex items-center justify-center">
                  <div className="text-8xl text-white">◯</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Ecosystem Note */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center mb-12">
            <p className="text-lg text-gray-700">
              And 9 more devices in our complete ecosystem. Buds. Glasses. Smartwatch. Phone.
            </p>
            <Link href="/products">
              <Button variant="outline" className="mt-6">
                View All Products <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: O-Spot Podcast */}
      <section id="podcast" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] mb-4">
              Eavesdrop on the best couple's debate about AI.
            </h2>
            <p className="text-lg text-gray-600">
              The O-Spot Podcast. Where AI gets real.
            </p>
          </div>

          {/* Segment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Hot Takes',
                description: 'Our spiciest opinions on AI trends, tools, and the future.',
              },
              {
                title: 'Real People, Real AI',
                description: 'Interviews with creators, entrepreneurs, and AI builders.',
              },
              {
                title: 'What\'s Next?',
                description: 'Predictions and deep dives into AI\'s biggest questions.',
              },
            ].map((segment, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-[#1B2A4A] mb-3">
                  {segment.title}
                </h3>
                <p className="text-gray-600">{segment.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/podcast">
              <Button variant="gold" size="lg">
                Listen Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B2A4A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Footer Top */}
          <div className="mb-12 pb-12 border-b border-gray-700">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">ET AI</h3>
              <p className="text-gray-300">Bringing AI Down to Earth.</p>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Platform */}
            <div>
              <h4 className="font-bold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/one-health" className="hover:text-white transition">
                    ONE Health
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    AI Studio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Prompt Packs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Guardian
                  </a>
                </li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h4 className="font-bold mb-4 text-white">Learn</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/academy" className="hover:text-white transition">
                    Academy
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    ELI5 Library
                  </a>
                </li>
                <li>
                  <a href="https://et-ai-language-academy.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Language Academy
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="https://www.skool.com/earth-station-by-et-ai-5562" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Earth Station
                  </a>
                </li>
                <li>
                  <Link href="/podcast" className="hover:text-white transition">
                    O-Spot Podcast
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-bold mb-4 text-white">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    Ring One
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>
              © ET AI, LLC. Charlotte, NC. Bringing AI Down to Earth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
