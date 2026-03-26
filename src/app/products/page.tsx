'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Watch,
  Headphones,
  Cloud,
  Shield,
  Eye,
  Smartphone,
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  codename: string;
  price: string;
  releaseQuarter: string;
  description: string;
  status: 'Pre-Order Soon' | 'Coming Soon' | 'In Development' | 'Planned';
  icon: React.ReactNode;
  isFlangship?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Ring One',
    codename: 'ORBIT',
    price: '$149',
    releaseQuarter: 'Q2 2026',
    description: 'AI Smart Ring. HRV, SpO2, temperature, sleep, stress.',
    status: 'Pre-Order Soon',
    icon: <Watch className="w-8 h-8" />,
    isFlangship: true,
  },
  {
    id: 2,
    name: 'Buds',
    codename: 'ECHO',
    price: '$119',
    releaseQuarter: 'Q4 2026',
    description: 'AI Earbuds. ANC, real-time translation, AI voice coach.',
    status: 'Coming Soon',
    icon: <Headphones className="w-8 h-8" />,
  },
  {
    id: 3,
    name: 'SaaS',
    codename: 'CORTEX',
    price: '$199/yr',
    releaseQuarter: 'Q1 2027',
    description: 'Cloud AI Platform. Health dashboards, anomaly detection.',
    status: 'In Development',
    icon: <Cloud className="w-8 h-8" />,
  },
  {
    id: 4,
    name: 'Guardian',
    codename: 'SENTINEL',
    price: 'Coming 2027',
    releaseQuarter: 'Q3 2027',
    description: 'Dementia care monitor. 5 wearable forms. Intelligence that remembers.',
    status: 'In Development',
    icon: <Shield className="w-8 h-8" />,
  },
  {
    id: 5,
    name: 'Lens',
    codename: 'PRISM',
    price: '$299',
    releaseQuarter: 'Q1 2028',
    description: 'Smart Glasses. AR-enhanced daily intelligence.',
    status: 'Planned',
    icon: <Eye className="w-8 h-8" />,
  },
  {
    id: 6,
    name: 'Phone',
    codename: 'SIGNAL',
    price: '$399',
    releaseQuarter: 'Q2 2028',
    description: 'AI Smartphone. Built from the ground up for AI.',
    status: 'Planned',
    icon: <Smartphone className="w-8 h-8" />,
  },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Pre-Order Soon':
      return 'bg-[#1E6FBF] text-white';
    case 'Coming Soon':
      return 'bg-[#F5C842] text-[#1B2A4A]';
    case 'In Development':
      return 'bg-gray-300 text-[#1B2A4A]';
    case 'Planned':
      return 'bg-gray-200 text-[#1B2A4A]';
    default:
      return 'bg-gray-100 text-[#1B2A4A]';
  }
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1B2A4A] to-[#1E6FBF] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Intelligence You Can Wear. Everywhere. Always.
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            The ET AI ONE Suite: Your entire technology life. 10 devices. One vision.
          </p>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-2xl p-8 bg-white transition-all hover:shadow-lg ${
                  product.isFlangship ? 'ring-2 ring-[#F5C842]' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-[#1E6FBF]">{product.icon}</div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#1B2A4A] mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 font-mono mb-4">{product.codename}</p>

                <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-6 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PRICE</p>
                    <p className="text-xl font-bold text-[#1B2A4A]">{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">LAUNCH</p>
                    <p className="text-lg font-semibold text-[#1E6FBF]">{product.releaseQuarter}</p>
                  </div>
                </div>

                <Button className="w-full bg-[#1E6FBF] hover:bg-[#165aa5] text-white">
                  Learn More
                </Button>
              </div>
            ))}
          </div>

          {/* Roadmap Note */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-12">
            <p className="text-center text-gray-700 text-lg">
              And 4 more products in our 10-phase roadmap.{' '}
              <span className="font-bold text-[#1B2A4A]">
                The only brand that can sell you your entire technology life.
              </span>
            </p>
          </div>

          {/* Bundle Section */}
          <div className="bg-gradient-to-r from-[#F5C842] to-[#F5C842]/80 rounded-2xl p-12 text-[#1B2A4A]">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">ET AI ONE Suite</h2>
              <p className="text-lg mb-6">All 10 devices. Everything you need to live smarter.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div>
                  <p className="text-sm text-gray-700 mb-1">COMPLETE SUITE</p>
                  <p className="text-4xl font-bold">$2,999</p>
                  <p className="text-sm text-gray-700 mt-1">saves $1,061</p>
                </div>
                <Button
                  variant="default"
                  className="bg-[#1B2A4A] hover:bg-[#0f1620] text-white px-8 py-6 text-lg"
                >
                  Pre-Order Suite
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
