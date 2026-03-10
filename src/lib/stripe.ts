import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  pro: {
    name: 'ET AI Pro',
    monthlyPriceId: 'price_pro_monthly',
    yearlyPriceId: 'price_pro_yearly',
    monthlyPrice: 19,
    yearlyPrice: 149,
    features: [
      'Full AI Health Coach access',
      'Unlimited coaching conversations',
      'All health programs',
      'Weekly AI insights reports',
      'Advanced trend analysis',
      'Apple Health & Google Health sync',
    ],
  },
  couples: {
    name: 'ET AI Couples',
    monthlyPriceId: 'price_couples_monthly',
    yearlyPriceId: 'price_couples_yearly',
    monthlyPrice: 29,
    yearlyPrice: 229,
    features: [
      'Everything in Pro',
      'Couples Sync Score',
      'Side-by-side health dashboard',
      'Couples AI Coach',
      'Shared goals & challenges',
      'All couples programs',
      'Privacy controls',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
