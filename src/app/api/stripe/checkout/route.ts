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

  // 1. Catch the exact payload sent by our custom Enroll button
  const body = await request.json()
  const programId = body.programId

  // 2. Pull the exact $12.99 Price ID we just injected into Vercel
  const priceId = process.env.STRIPE_PRO_PRICE_ID

  if (!priceId) {
    return NextResponse.json({ error: 'Server configuration missing Stripe Price ID' }, { status: 500 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  try {
    // 3. Generate the secure Stripe Checkout URL
    const session = await stripe.checkout.sessions.create({
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : (profile?.email ?? user.email),
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/programs?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/programs`,
      metadata: { userId: user.id, programId: programId || 'pro_upgrade' },
      subscription_data: { metadata: { userId: user.id, programId: programId || 'pro_upgrade' } },
    })

    // 4. Send the URL back to the frontend so it can redirect the user
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
  }
}