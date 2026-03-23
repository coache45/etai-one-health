import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchPacks } from '@/lib/studio/queries'
import type { GoalCategory } from '@/types/studio'

const VALID_CATEGORIES = ['business', 'relationships', 'health', 'finance', 'creativity', 'learning']

/** GET /api/studio/packs?category=business */
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as GoalCategory | null

    // Get user tier
    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = (profile as unknown as { subscription_tier: string })?.subscription_tier ?? 'free'
    const freeOnly = tier === 'free'

    const packs = await fetchPacks({
      category: category && VALID_CATEGORIES.includes(category) ? category : undefined,
      freeOnly,
    })

    return NextResponse.json({ packs, tier })
  } catch (err) {
    console.error('Packs GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch packs' }, { status: 500 })
  }
}
