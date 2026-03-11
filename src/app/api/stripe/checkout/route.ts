import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const programId = body.programId

  const priceId = process.env.STRIPE_PRO_PRICE_ID
  if (!priceId) {
    return NextResponse.json({ error: 'Server configuration missing Stripe Price ID' }, { status: 500 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  // BULLETPROOF URL DETECTION (No Vercel variables needed)
  const origin = request.headers.get('origin') || 'https://etai-one-health.vercel.app'

  try {
    const session = await stripe.checkout.sessions.create({
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : (profile?.email ?? user.email),
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/programs?checkout=success`,
      cancel_url: `${origin}/programs`,
      metadata: { userId: user.id, programId: programId || 'pro_upgrade' },
      subscription_data: { metadata: { userId: user.id, programId: programId || 'pro_upgrade' } },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
  }
}