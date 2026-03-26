'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Smile,
  Users,
  Zap,
} from 'lucide-react';

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: <Globe className="w-8 h-8 text-[#1E6FBF]" />,
    title: 'Accessible',
    description: "If Tanja's grandmother wouldn't understand it, we rewrite it.",
  },
  {
    icon: <Users className="w-8 h-8 text-[#F5C842]" />,
    title: 'Couple-Powered',
    description: 'Built by a husband-and-wife team who argue about AI at dinner.',
  },
  {
    icon: <Zap className="w-8 h-8 text-[#1B2A4A]" />,
    title: 'Practical First',
    description: 'You can use this today, right now, for free.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1B2A4A] to-[#1E6FBF] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            We're Ernest and Tanja.
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 font-mono">
            E&T • Charlotte, NC
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200">
            <p className="text-lg sm:text-xl leading-relaxed text-gray-800 mb-6">
              We met 27 years ago, built a life, raised a daughter, and kept finding
              our way back to entrepreneurship no matter what life threw at us. In
              December, Tanja had a heart attack, and everything we thought we knew
              about time and priorities got rewritten overnight.
            </p>
            <p className="text-lg sm:text-xl leading-relaxed text-gray-800">
              What came out of that season was a clearer mission than ever:{' '}
              <span className="font-bold text-[#1B2A4A]">
                use AI to help real people live better, healthier, more connected lives.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm sm:text-base font-bold text-[#1E6FBF] mb-3 tracking-wide uppercase">
            Our Mission
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B2A4A] mb-4">
            Bringing AI Down to Earth
          </h2>
          <p className="text-lg sm:text-xl text-gray-700">
            <span className="font-bold">AI doesn't have to be scary or complicated.</span>{' '}
            We prove that.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B2A4A] mb-12 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all text-center"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1B2A4A] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#F8F9FA] rounded-2xl p-8 sm:p-12 border border-gray-200 mb-8">
            <p className="text-sm text-gray-600 mb-2 font-mono">COMPANY</p>
            <h3 className="text-3xl font-bold text-[#1B2A4A] mb-4">
              ET AI, LLC
            </h3>
            <p className="text-lg text-gray-700 mb-2">
              Charlotte, North Carolina
            </p>
            <a
              href="https://etaiworld.ai"
              className="text-[#1E6FBF] hover:text-[#165aa5] font-semibold transition-colors"
            >
              etaiworld.ai
            </a>
          </div>

          {/* CTA */}
          <div>
            <p className="text-lg text-gray-700 mb-6">
              Interested in building with us?
            </p>
            <Link href="/earth-station">
              <Button className="bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#1B2A4A] font-bold px-8 py-6 text-lg">
                Come build with us.
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
