/**
 * Service-role Supabase client -- BYPASSES ROW LEVEL SECURITY.
 * Server-only. Never import this in client components or expose to the browser.
 * Use only for admin operations, webhooks, and background jobs.
 */
import { createClient } from '@supabase/supabase-js'
import type { USMDatabase } from '@/types/usm-database'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. ' +
      'Admin client can only be used on the server.'
    )
  }

  return createClient<USMDatabase>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
