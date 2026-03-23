/**
 * Server-side data access for ELI5 guides.
 * Uses the admin client to bypass RLS for admin/generate operations.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { ELI5Guide, ELI5GuideInsert, ELI5GuideUpdate, GuideCategory } from '@/types/guides'

export async function fetchPublishedGuides(category?: GuideCategory): Promise<ELI5Guide[]> {
  const supabase = createAdminClient()

  let query = supabase
    .from('eli5_guides')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'general') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error || !data) return []
  return data as unknown as ELI5Guide[]
}

export async function fetchAllGuides(): Promise<ELI5Guide[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('eli5_guides')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as ELI5Guide[]
}

export async function fetchGuideBySlug(slug: string): Promise<ELI5Guide | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('eli5_guides')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as unknown as ELI5Guide
}

export async function insertGuide(guide: ELI5GuideInsert): Promise<ELI5Guide | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('eli5_guides')
    .insert(guide as Record<string, unknown>)
    .select('*')
    .single()

  if (error || !data) return null
  return data as unknown as ELI5Guide
}

export async function updateGuide(id: string, updates: ELI5GuideUpdate): Promise<ELI5Guide | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('eli5_guides')
    .update(updates as Record<string, unknown>)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) return null
  return data as unknown as ELI5Guide
}

export async function deleteGuide(id: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('eli5_guides')
    .delete()
    .eq('id', id)

  return !error
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}
