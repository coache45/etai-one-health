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
  Crown,
} from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'AI Health Coach',
    description: 'Get personalized guidance tailored to your unique health profile and goals.',
    icon: <MessageCircle className="w-8 h-8" />,
  },
  {
    id: 2,
    title: 'Couples Health Tracking',
    description: 'Track health together as a couple. See patterns, celebrate wins, grow stronger.',
    icon: <Users className="w-8 h-8" />,
    badge: '#1 Market Differentiator',
  },
  {
    id: 3,
    title: 'Sleep Intelligence',
    description: 'Understand your sleep cycles and get actionable insights to improve rest quality.',
    icon: <Moon className="w-8 h-8" />,
  },
  {
    id: 4,
    title: 'Stress Mastery',
    description: 'Monitor stress levels and unlock techniques to manage your nervous system.',
    icon: <Brain className="w-8 h-8" />,
  },
  {
    id: 5,
    title: 'Readiness Score',
    description: 'Know if you\'re ready to crush it today with real-time readiness insights.',
    icon: <Activity className="w-8 h-8" />,
  },
  {
    id: 6,
    title: 'Guided Programs',
    description: 'Follow science-backed programs designed to transform your health habits.',
    icon: <Heart className="w-8 h-8" />,
  },
];

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    description: 'Start your health journey',
    features: [
      'Basic health tracking',
      'Daily insights',
      'Community access',
      'Limited AI coaching',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: 19,
    description: 'Unlock full AI potential',
    features: [
      'Everything in Free',
      'Unlimited AI coaching',
      'Advanced analytics',
      'Sleep & stress mastery',
      'Wearable integration',
      'Priority support',
    ],
    cta: 'Start Pro',
    highlighted: true,
  },
  {
    name: 'Couples',
    price: 29,
    description: 'Health for you and your partner',
    features: [
      'Everything in Pro',
      'Couples dashboard',
      'Shared insights',
      'Partner coaching',
      'Relationship health tracking',
      'Couple challenges & rewards',
    ],
    cta: 'Start Couples',
  },
];

export default function OneHealthPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1B2A4A] to-[#1E6FBF] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              The health app that{' '}
              <span className="text-[#F5C842]">actually knows you.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-10">
              AI that learns your body, understands your goals, and helps you thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg hover:border-[#1E6FBF] transition"
              >
                <div className="relative mb-4">
                  <div className="text-[#1E6FBF] mb-4">{feature.icon}</div>
                  {feature.badge && (
                    <div className="absolute top-0 right-0 bg-[#F5C842] text-[#1B2A4A] px-3 py-1 rounded-full text-xs font-semibold">
                      {feature.badge}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#1B2A4A] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-gray-600">
              Start free. Upgrade when you're ready for more.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition ${
                  tier.highlighted
                    ? 'bg-white ring-2 ring-[#F5C842] shadow-lg scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <div className="flex items-center justify-center mb-4">
                    <span className="bg-[#F5C842] text-[#1B2A4A] px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[#1B2A4A] mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 mb-6 text-sm">{tier.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-[#1B2A4A]">
                    ${tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-600 ml-2">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#00B89C] mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button
                    variant={tier.highlighted ? 'gold' : 'outline'}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E6FBF] to-[#00B89C] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-lg text-gray-100 mb-10">
            Join thousands of people who are already using ONE Health to take control of their wellness.
          </p>

          <Link href="/signup">
            <Button variant="gold" size="lg">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
