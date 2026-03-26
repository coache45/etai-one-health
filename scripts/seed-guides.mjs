/**
 * Seed ELI5 guides into the live Supabase database.
 * Uses the service role key to bypass RLS.
 *
 * Usage: node scripts/seed-guides.mjs
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually (no dotenv dependency)
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
  console.error('Missing SUPABASE env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Step 1: Check if eli5_guides table exists by trying a query ──
console.log('Checking if eli5_guides table exists...');
const { data: tableCheck, error: tableErr } = await supabase
  .from('eli5_guides')
  .select('id')
  .limit(1);

if (tableErr && tableErr.message.includes('does not exist')) {
  console.log('Table eli5_guides does not exist. Running migration via SQL...');

  // Read and execute the migration
  const migrationSQL = readFileSync('supabase/migrations/20260323_eli5_guides.sql', 'utf-8');
  const { error: migErr } = await supabase.rpc('exec_sql', { sql: migrationSQL }).single();

  if (migErr) {
    console.log('Cannot run migration via RPC (expected). Trying direct SQL via REST...');

    // Use the Supabase Management API or just create the table inline
    const createTableSQL = `
      create table if not exists public.eli5_guides (
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
      );
    `;

    // Try via PostgREST RPC
    const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: createTableSQL }),
    });

    if (!resp.ok) {
      console.error('Cannot create table via API. Please run the migration manually:');
      console.error('  Go to Supabase Dashboard → SQL Editor → paste supabase/migrations/20260323_eli5_guides.sql');
      console.error('  Then re-run: node scripts/seed-guides.mjs');
      process.exit(1);
    }
  }

  console.log('Migration applied successfully.');
} else if (tableErr) {
  console.error('Error checking table:', tableErr.message);
  console.log('The table may not exist. Please run the migration in Supabase SQL Editor:');
  console.log('  Paste the contents of: supabase/migrations/20260323_eli5_guides.sql');
  console.log('  Then re-run: node scripts/seed-guides.mjs');
  process.exit(1);
} else {
  console.log(`Table exists. Current row count: ${tableCheck.length === 0 ? '0' : '1+'}`);
}

// ── Step 2: Check for existing guides to avoid duplicates ──
const { data: existing } = await supabase
  .from('eli5_guides')
  .select('slug');

const existingSlugs = new Set((existing || []).map(g => g.slug));
console.log(`Existing guides: ${existingSlugs.size}`);

// ── Step 3: Define the seed guides ──
const guides = [
  {
    title: 'Why Your Brain Needs Sleep',
    tagline: "The beginner's guide to understanding why sleep matters more than you think",
    emoji: '😴',
    slug: 'why-your-brain-needs-sleep',
    category: 'sleep',
    difficulty: 'beginner',
    is_published: true,
    chapters: [
      {
        title: 'Your Brain Has a Cleaning Crew',
        emoji: '🧹',
        content: "While you sleep, your brain activates something called the glymphatic system. Think of it as a tiny cleaning crew that only works the night shift.\n\nDuring the day, your brain cells produce waste — byproducts of all that thinking, remembering, and decision-making. When you sleep, your brain cells actually shrink a little bit, creating more space between them. This lets cerebrospinal fluid rush through and wash away the waste.\n\nOne of the things it cleans up? A protein called beta-amyloid, which is linked to Alzheimer's disease. So sleep isn't just rest — it's maintenance.",
        analogy: "Imagine a busy restaurant kitchen. During service (your waking hours), the cooks are working so fast they can't clean up. When the restaurant closes (sleep), the cleaning crew comes in, mops the floors, scrubs the counters, and gets everything ready for tomorrow. Skip the cleaning? Things get gross fast.",
        steps: [
          { title: 'Set a consistent bedtime', description: "Your cleaning crew works best on a schedule. Pick a bedtime and stick to it — even on weekends." },
          { title: 'Give your brain 7-9 hours', description: "That's how long the full cleaning cycle takes for most adults. Less than 6 hours means the crew can't finish." },
        ],
      },
      {
        title: 'The Four Stages of Sleep',
        emoji: '🎭',
        content: "Sleep isn't one thing — it's four stages that repeat in cycles throughout the night. Each cycle takes about 90 minutes.\n\nStage 1 is the doorway. You're drifting off. Easy to wake up.\n\nStage 2 is light sleep. Your heart rate slows, temperature drops. This is where you spend about half the night.\n\nStage 3 is deep sleep — the heavy-duty repair stage. Growth hormone gets released. Your immune system recharges. This is the sleep that makes you feel physically restored.\n\nStage 4 is REM (Rapid Eye Movement). This is dream time. Your brain is almost as active as when you're awake, but your body is paralyzed. REM is critical for memory, learning, and emotional processing.",
        analogy: "Think of a 90-minute sleep cycle like a car wash. Stage 1 is pulling in. Stage 2 is the pre-rinse. Stage 3 is the heavy scrub. REM is the wax and polish. You need all four to come out clean.",
        steps: [
          { title: "Don't hit snooze", description: "Snoozing fragments your last sleep cycle. Better to set your alarm for when you actually need to get up." },
          { title: 'Track your cycles', description: "Try to sleep in 90-minute multiples (6h, 7.5h, 9h) so you wake between cycles, not during deep sleep." },
        ],
      },
      {
        title: "What Happens When You Don't Sleep",
        emoji: '⚡',
        content: "After just one night of poor sleep, your brain's prefrontal cortex — the part responsible for decision-making, impulse control, and focus — starts to struggle.\n\nAfter 24 hours without sleep, your cognitive impairment is roughly equivalent to having a blood alcohol concentration of 0.10%. That's legally drunk in every US state.\n\nChronic sleep deprivation (consistently getting less than 6 hours) is linked to heart disease, diabetes, obesity, depression, and weakened immunity. Your body treats it as a state of emergency.",
        steps: [
          { title: 'Audit your sleep this week', description: "Write down when you go to bed and wake up for 7 days. Be honest. Most people overestimate their sleep by about 45 minutes." },
          { title: 'Identify your biggest sleep thief', description: "Is it screens? Caffeine after 2 PM? Stress? Inconsistent schedule? Pick one to fix first." },
          { title: 'Start small', description: "Move your bedtime earlier by just 15 minutes this week. That's it. Small wins compound." },
        ],
      },
    ],
  },
  {
    title: "Stress: Your Body's Alarm System",
    tagline: 'Understanding why stress exists and how to work with it, not against it',
    emoji: '🚨',
    slug: 'stress-your-bodys-alarm-system',
    category: 'stress',
    difficulty: 'beginner',
    is_published: true,
    chapters: [
      {
        title: 'Stress Is Not the Enemy',
        emoji: '🤝',
        content: "Here's the thing most people get wrong: stress itself isn't bad. It's your body's built-in alarm system, and it has kept humans alive for 200,000 years.\n\nWhen you encounter something challenging — a deadline, a confrontation, a near-miss in traffic — your brain triggers the fight-or-flight response. Cortisol and adrenaline flood your system. Your heart rate increases. Your muscles tense. Your focus sharpens.\n\nThis is acute stress, and it's useful. It helps you perform, react, and survive. The problem isn't the alarm going off. The problem is when the alarm won't turn off.",
        analogy: "Stress is like a smoke detector. When there's actual smoke (a real threat), you WANT it to go off — it could save your life. But if it starts blaring every time you make toast (minor daily hassles), that's a problem. The detector isn't broken. It just needs recalibration.",
        steps: [
          { title: 'Name your stress', description: "When you feel stressed, pause and say: 'I'm stressed because ___'. Naming it engages your prefrontal cortex and starts calming the alarm." },
        ],
      },
      {
        title: 'Acute vs. Chronic Stress',
        emoji: '⏰',
        content: "Acute stress is short-term. You have a presentation, you nail it, your stress drops. Your body recovers. This is healthy.\n\nChronic stress is long-term. Financial pressure, a toxic job, caregiving burnout, unresolved relationship tension. The alarm never fully shuts off. Cortisol stays elevated. Your body stays in emergency mode.\n\nOver weeks and months, chronic stress physically changes your brain. The amygdala (fear center) gets larger. The hippocampus (memory center) shrinks. The prefrontal cortex (decision-making) gets weaker. This isn't metaphorical — these are measurable changes on brain scans.",
        analogy: "Imagine running your car engine at redline RPMs. For a few seconds on a race track? Fine, it's designed for that. But driving to work at redline every day? The engine will burn out. Your body works the same way.",
        steps: [
          { title: 'Do the 2-minute check-in', description: "Three times a day, rate your stress from 1-10. Notice patterns. Are mornings always high? Do meetings spike you? Data beats guessing." },
          { title: 'Find your recovery signals', description: "After a stressful event, what helps you come back down? A walk? Music? Calling a friend? Know your reset buttons before you need them." },
        ],
      },
      {
        title: 'Three Things That Actually Help',
        emoji: '🛠️',
        content: "Forget \"stress management tips\" that tell you to take a bath. Here are three evidence-based interventions that measurably lower chronic stress:\n\n1. Physiological sigh: Two quick inhales through the nose, then one long exhale through the mouth. This activates your parasympathetic nervous system in real-time. One rep. Takes 5 seconds.\n\n2. Non-sleep deep rest (NSDR): 10-20 minutes of guided body relaxation (not meditation — you're following instructions, not emptying your mind). Studies show this restores dopamine levels by up to 65%.\n\n3. Regular movement: Not CrossFit. Not running a marathon. Just 30 minutes of walking. Movement metabolizes stress hormones. It literally burns off the cortisol.",
        steps: [
          { title: 'Practice the physiological sigh right now', description: "Two quick sniffs in through your nose, then one slow exhale through your mouth. Do it three times. Notice how your shoulders drop." },
          { title: 'Schedule a 10-minute walk today', description: "Not tomorrow. Today. Put your shoes on and walk. No podcast, no phone call. Just walk and let your brain process." },
          { title: 'Try NSDR tonight', description: "Search 'NSDR' on YouTube. Pick a 10-minute one. Do it before bed or during a midday break. Most people feel the difference after one session." },
        ],
      },
    ],
  },
  {
    title: 'Understanding Cognitive Health',
    tagline: "A gentle guide to how your brain stays sharp — and what to watch for",
    emoji: '🧠',
    slug: 'understanding-cognitive-health',
    category: 'cognition',
    difficulty: 'beginner',
    is_published: true,
    chapters: [
      {
        title: 'Your Brain is a Living Thing',
        emoji: '🌱',
        content: "Your brain isn't a computer that either works or doesn't. It's more like a garden — constantly growing, pruning, and adapting.\n\nEvery day, your brain forms new connections (synapses) and prunes old ones. This process is called neuroplasticity, and it continues throughout your entire life. Yes, even at 80.\n\nThe things you do every day — sleep, movement, social connection, learning new things — are like water, sunlight, and fertilizer for your brain garden. Neglect them, and the garden doesn't die overnight. It just slowly gets a little more overgrown, a little harder to navigate.",
        analogy: "Think of your brain like a garden path. The paths you walk frequently stay clear and easy to use. The paths you ignore get overgrown. But here's the good news: you can always clear a path again. It might take some effort, but the trail is still there underneath.",
        steps: [
          { title: 'Learn one new thing this week', description: "A word in another language, a card trick, a new recipe. Novelty is fertilizer for your brain. It doesn't have to be hard — just new." },
        ],
      },
      {
        title: 'The Five Dimensions of Cognitive Health',
        emoji: '📊',
        content: "At ET AI, we track cognitive health across five key dimensions. Together, they give a complete picture of how your brain is doing:\n\nCognitive Load: How hard your brain is working right now. Like CPU usage on a computer. Some load is normal. Too much for too long is a problem.\n\nCircadian Rhythm: Your brain has a 24-hour clock that regulates alertness, memory formation, and repair. Disrupting it is like jet lag — everything runs worse.\n\nMovement Patterns: How you move reflects how your brain is coordinating. Changes in gait, balance, or activity patterns can be early signals.\n\nSpeech Patterns: The words you choose, your speaking speed, and word-finding ability are windows into cognitive function.\n\nIdentity Coherence: Your sense of self — recognizing people, knowing where you are, remembering your story. This is the deepest indicator.",
        analogy: "Think of these five dimensions like the vital signs a doctor checks. Temperature, blood pressure, heart rate, oxygen, respiration. No single number tells the whole story, but together they paint a clear picture. Our CPR (Cognitive Pattern Recognition) score combines all five into one number, like a credit score for your brain health.",
      },
      {
        title: 'Early Signs to Watch For',
        emoji: '👀',
        content: "Cognitive changes are usually gradual, which makes them easy to miss or dismiss. Here are early signs worth paying attention to — in yourself or someone you care about:\n\nRepeatedly asking the same question in one conversation. Forgetting recent events while clearly remembering things from years ago. Getting confused in familiar places. Struggling to follow a recipe or instructions you've used many times.\n\nImportant: Everyone forgets things sometimes. That's normal. What matters is the pattern and the trend. One forgotten name isn't a concern. A steady increase in forgotten names over months might be worth discussing with a doctor.",
        steps: [
          { title: 'Start a simple weekly journal', description: "Once a week, write down: How's my memory this week? Any moments of confusion? How's my sleep? Three sentences is enough. Patterns emerge over months." },
          { title: 'Know the difference', description: "Normal: forgetting where you put your keys. Worth watching: forgetting what keys are for. If you're worried, talk to your doctor. Early intervention matters more than anything." },
          { title: 'Talk about it', description: "Cognitive health shouldn't be a taboo topic. If you notice changes in a loved one, bring it up with compassion, not alarm. 'I've noticed X — how are you feeling about your memory lately?'" },
        ],
      },
    ],
  },
];

// ── Step 4: Insert guides (skip duplicates) ──
let inserted = 0;
let skipped = 0;

for (const guide of guides) {
  if (existingSlugs.has(guide.slug)) {
    console.log(`  SKIP: "${guide.title}" (slug already exists)`);
    skipped++;
    continue;
  }

  const { data, error } = await supabase
    .from('eli5_guides')
    .insert(guide)
    .select('id, title, slug')
    .single();

  if (error) {
    console.error(`  FAIL: "${guide.title}" — ${error.message}`);
  } else {
    console.log(`  ✓ Inserted: "${data.title}" (${data.id})`);
    inserted++;
  }
}

console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);

// ── Step 5: Verify by listing all guides ──
const { data: allGuides, error: listErr } = await supabase
  .from('eli5_guides')
  .select('id, title, slug, category, difficulty, is_published, chapters')
  .order('created_at', { ascending: true });

if (listErr) {
  console.error('Failed to list guides:', listErr.message);
} else {
  console.log(`\n=== All guides in database (${allGuides.length}) ===`);
  for (const g of allGuides) {
    const chapterCount = Array.isArray(g.chapters) ? g.chapters.length : 0;
    console.log(`  ${g.is_published ? '🟢' : '⚪'} ${g.emoji || '📖'} ${g.title} [${g.category}/${g.difficulty}] — ${chapterCount} chapters — /guides/${g.slug}`);
  }
}
