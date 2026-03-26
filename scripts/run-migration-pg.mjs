/**
 * Run ELI5 guides migration via direct Postgres connection.
 */
import { readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

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

const projectRef = 'pvflufqfeaowzextilpl';

// Try multiple connection approaches
const connectionConfigs = [
  {
    label: 'Direct connection (port 5432)',
    connectionString: `postgresql://postgres.${projectRef}:${env.SUPABASE_DB_PASSWORD || env.POSTGRES_PASSWORD || ''}@db.${projectRef}.supabase.co:5432/postgres`,
  },
  {
    label: 'Pooler connection (port 6543)',
    connectionString: `postgresql://postgres.${projectRef}:${env.SUPABASE_DB_PASSWORD || env.POSTGRES_PASSWORD || ''}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  },
];

// Also check if there's a DATABASE_URL
if (env.DATABASE_URL) {
  connectionConfigs.unshift({
    label: 'DATABASE_URL from .env.local',
    connectionString: env.DATABASE_URL,
  });
}

// Read migration SQL
const migrationSQL = readFileSync('supabase/migrations/20260323_eli5_guides.sql', 'utf-8');

let connected = false;

for (const config of connectionConfigs) {
  if (!config.connectionString || config.connectionString.includes(':@')) {
    console.log(`  Skip: ${config.label} (no password available)`);
    continue;
  }

  console.log(`Trying: ${config.label}...`);
  const client = new Client({ connectionString: config.connectionString, connectionTimeoutMillis: 10000 });

  try {
    await client.connect();
    console.log('  Connected!\n');

    // Run migration
    console.log('Running migration SQL...');
    await client.query(migrationSQL);
    console.log('  ✓ Migration complete!\n');

    // Verify table
    const result = await client.query("SELECT count(*) FROM public.eli5_guides");
    console.log(`  ✓ Table eli5_guides exists with ${result.rows[0].count} rows`);

    connected = true;
    await client.end();
    break;
  } catch (err) {
    console.log(`  Failed: ${err.message}\n`);
    try { await client.end(); } catch {}
  }
}

if (!connected) {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Could not connect to database directly.                ║');
  console.log('║  Please run the migration manually:                     ║');
  console.log('║                                                         ║');
  console.log('║  1. Go to Supabase Dashboard → SQL Editor               ║');
  console.log('║  2. Paste the contents of:                              ║');
  console.log('║     supabase/migrations/20260323_eli5_guides.sql        ║');
  console.log('║  3. Click "Run"                                         ║');
  console.log('║  4. Then re-run: node scripts/seed-guides.mjs           ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\nDirect link: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
}
