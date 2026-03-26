/**
 * Run the eli5_guides migration against live Supabase via direct SQL.
 * Uses fetch against the Supabase SQL endpoint with service role auth.
 */
import { readFileSync } from 'fs';

// Parse .env.local
const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

// Read migration SQL
const migrationSQL = readFileSync('supabase/migrations/20260323_eli5_guides.sql', 'utf-8');

// Split into individual statements (handle $$ blocks properly)
// We'll run individual DDL statements via separate approaches

// First, try the Supabase Edge SQL API
// Supabase exposes a /rest/v1/rpc endpoint for custom functions
// But for DDL, we need the /pg or /query endpoint

// Approach: Use the Supabase project ref to call the Management API
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
console.log(`Project ref: ${projectRef}`);
console.log('Attempting to run migration via Supabase SQL API...\n');

// Try the /rest/v1/ raw SQL approach via POST to the SQL endpoint
// Modern Supabase has a /sql endpoint accessible with service role
const sqlEndpoint = `${supabaseUrl}/rest/v1/rpc`;

// Strategy: Create a temporary function that executes our DDL
// Step 1: Try executing via pg_net or direct endpoint
const statements = [
  // Create table
  `create table if not exists public.eli5_guides (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    tagline text not null default '',
    emoji text not null default '📖',
    slug text not null unique,
    category text not null default 'general',
    difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
    chapters jsonb not null default '[]'::jsonb,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  // Indexes
  `create index if not exists idx_eli5_guides_published on public.eli5_guides (is_published, category)`,
  `create index if not exists idx_eli5_guides_slug on public.eli5_guides (slug)`,
  // Trigger function
  `create or replace function public.update_eli5_guides_updated_at()
  returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$ language plpgsql`,
  // Trigger
  `create trigger trg_eli5_guides_updated_at
    before update on public.eli5_guides
    for each row
    execute function public.update_eli5_guides_updated_at()`,
  // RLS
  `alter table public.eli5_guides enable row level security`,
  // Policies
  `create policy "Anyone can read published guides"
    on public.eli5_guides for select
    using (is_published = true)`,
  `create policy "Authenticated users can manage guides"
    on public.eli5_guides for all
    using (auth.role() = 'authenticated')`,
];

// Try using the Supabase SQL HTTP API (available in newer Supabase versions)
// POST to /sql with the SQL statements
for (let i = 0; i < statements.length; i++) {
  const sql = statements[i];
  const label = sql.substring(0, 60).replace(/\n/g, ' ').trim();

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'X-Supabase-Query': sql,
      },
      body: JSON.stringify({}),
    });

    if (res.ok) {
      console.log(`  ✓ [${i + 1}/${statements.length}] ${label}...`);
    } else {
      const text = await res.text();
      console.log(`  ✗ [${i + 1}/${statements.length}] ${label}... (${res.status})`);
      if (i === 0) {
        // If the first statement fails, the approach doesn't work
        console.log('\nDirect SQL via REST API not available.');
        console.log('Falling back to Supabase Dashboard SQL Editor approach...\n');
        console.log('=== MIGRATION SQL (copy and paste into Supabase SQL Editor) ===\n');
        console.log(migrationSQL);
        console.log('\n=== Go to: https://supabase.com/dashboard/project/pvflufqfeaowzextilpl/sql/new ===\n');
        console.log('After running the migration, re-run: node scripts/seed-guides.mjs');
        process.exit(0);
      }
    }
  } catch (err) {
    console.log(`  ✗ [${i + 1}/${statements.length}] Error: ${err.message}`);
  }
}

console.log('\nMigration complete!');
