/**
 * Seed 3 Prompt Packs into live Supabase for AI Studio
 * Run: node scripts/seed-prompt-packs.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Parse .env.local
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim()
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Seed data ───

const packs = [
  {
    title: 'Start Your Side Hustle',
    description: 'Turn your idea into a real plan. Four AI-powered prompts to validate, name, plan, and pitch your next venture.',
    category: 'business',
    difficulty: 'beginner',
    is_free: true,
    prompts: [
      {
        id: 'biz-01',
        title: 'Idea Validator',
        description: 'Find out if your business idea has legs — get honest feedback and next steps.',
        template: 'I have a business idea: {business_idea}. My target audience is {target_audience}. My starting budget is around {budget}. Please evaluate this idea honestly. Tell me: 1) Is there real demand for this? 2) Who are my closest competitors? 3) What are the biggest risks? 4) What should I do in the first 30 days? Be encouraging but real with me.',
        fields: [
          { name: 'business_idea', placeholder: 'e.g., Custom meal prep delivery for busy parents', type: 'text' },
          { name: 'target_audience', placeholder: 'e.g., Working parents aged 30-45', type: 'text' },
          { name: 'budget', placeholder: 'e.g., $500', type: 'text' },
        ],
      },
      {
        id: 'biz-02',
        title: 'Business Name Generator',
        description: 'Get 10 creative name ideas that fit your brand — plus domain availability tips.',
        template: 'I need a business name for my venture: {business_idea}. The vibe I want is {brand_vibe}. Generate 10 creative business name options. For each name, explain why it works and whether the .com domain is likely available.',
        fields: [
          { name: 'business_idea', placeholder: 'e.g., Eco-friendly cleaning products', type: 'text' },
          { name: 'brand_vibe', placeholder: 'e.g., Modern, approachable, trustworthy', type: 'text' },
        ],
      },
      {
        id: 'biz-03',
        title: 'First 100 Customers Plan',
        description: 'A step-by-step playbook to get your first 100 paying customers.',
        template: 'My business is {business_idea} targeting {target_audience}. My budget for marketing is {budget}. Create a detailed 30-day plan to get my first 100 customers.',
        fields: [
          { name: 'business_idea', placeholder: 'e.g., Online tutoring for high schoolers', type: 'text' },
          { name: 'target_audience', placeholder: 'e.g., Parents of high school students', type: 'text' },
          { name: 'budget', placeholder: 'e.g., $200/month', type: 'text' },
        ],
      },
      {
        id: 'biz-04',
        title: 'Elevator Pitch Writer',
        description: 'Craft a 30-second pitch that makes people want to know more.',
        template: 'My business is {business_idea}. The problem I solve is {problem}. What makes me different is {differentiator}. Write me 3 versions of a 30-second elevator pitch.',
        fields: [
          { name: 'business_idea', placeholder: 'e.g., AI-powered resume builder', type: 'text' },
          { name: 'problem', placeholder: 'e.g., Job seekers spend hours writing resumes', type: 'text' },
          { name: 'differentiator', placeholder: 'e.g., We tailor each resume to the specific job', type: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Build With Your Person',
    description: 'Strengthen your relationship with AI-assisted conversations, plans, and letters. Made for couples who want to grow together.',
    category: 'relationships',
    difficulty: 'beginner',
    is_free: false,
    prompts: [
      {
        id: 'rel-01',
        title: 'Conversation Starter Kit',
        description: '10 deep, fun questions to spark a real conversation tonight.',
        template: "My partner's name is {partner_name}. We've been together {relationship_length}. Something we both enjoy is {shared_interest}. Generate 10 conversation starters for us.",
        fields: [
          { name: 'partner_name', placeholder: 'e.g., Alex', type: 'text' },
          { name: 'relationship_length', placeholder: 'e.g., 3 years', type: 'text' },
          { name: 'shared_interest', placeholder: 'e.g., cooking, hiking', type: 'text' },
        ],
      },
      {
        id: 'rel-02',
        title: 'Date Night Planner',
        description: 'Get a personalized date night plan based on your interests and budget.',
        template: 'Plan a date night for me and {partner_name}. We enjoy {shared_interest}. Our budget is {budget}. We live in {location}. Give us 3 date night options.',
        fields: [
          { name: 'partner_name', placeholder: 'e.g., Jordan', type: 'text' },
          { name: 'shared_interest', placeholder: 'e.g., live music', type: 'text' },
          { name: 'budget', placeholder: 'e.g., $75', type: 'text' },
          { name: 'location', placeholder: 'e.g., Austin, TX', type: 'text' },
        ],
      },
      {
        id: 'rel-03',
        title: 'Shared Goal Builder',
        description: 'Create a goal you can chase together — with a plan you can both follow.',
        template: 'My partner {partner_name} and I want to work on: {shared_goal}. Our timeline is {timeline}. Help us build a plan we can do together.',
        fields: [
          { name: 'partner_name', placeholder: 'e.g., Sam', type: 'text' },
          { name: 'shared_goal', placeholder: 'e.g., Save $5,000 for a vacation', type: 'textarea' },
          { name: 'timeline', placeholder: 'e.g., 6 months', type: 'text' },
        ],
      },
      {
        id: 'rel-04',
        title: 'Appreciation Letter Writer',
        description: 'Write a heartfelt letter to your person — we help you find the right words.',
        template: 'Help me write a heartfelt letter to {partner_name}. The occasion is {occasion}. Something I appreciate: {appreciation}. A memory to mention: {memory}.',
        fields: [
          { name: 'partner_name', placeholder: 'e.g., Taylor', type: 'text' },
          { name: 'occasion', placeholder: 'e.g., our anniversary', type: 'text' },
          { name: 'appreciation', placeholder: 'e.g., They always make me laugh', type: 'textarea' },
          { name: 'memory', placeholder: 'e.g., That road trip where we got lost', type: 'textarea' },
        ],
      },
    ],
  },
  {
    title: 'AI for the Everyday',
    description: 'Not sure where to start with AI? These four prompts make it simple. Explain things, compare options, make decisions, and optimize your day.',
    category: 'learning',
    difficulty: 'beginner',
    is_free: true,
    prompts: [
      {
        id: 'learn-01',
        title: "Explain Like I'm 5",
        description: 'Get a simple, jargon-free explanation of anything.',
        template: 'Explain {topic} to me like I\'m 5 years old. Use a simple analogy. Give me: 1) The one-sentence version, 2) The 3-minute version, 3) Why it matters in everyday life.',
        fields: [
          { name: 'topic', placeholder: 'e.g., How the stock market works', type: 'text' },
        ],
      },
      {
        id: 'learn-02',
        title: 'Compare Two Things',
        description: "Can't decide between two options? Get an honest, side-by-side breakdown.",
        template: 'Compare {thing_a} vs {thing_b} for me. I\'m deciding for {context}. Give me pros/cons, who each is best for, and your honest recommendation.',
        fields: [
          { name: 'thing_a', placeholder: 'e.g., iPhone 16', type: 'text' },
          { name: 'thing_b', placeholder: 'e.g., Samsung Galaxy S25', type: 'text' },
          { name: 'context', placeholder: 'e.g., a first-time smartphone buyer', type: 'text' },
        ],
      },
      {
        id: 'learn-03',
        title: 'Decision Helper',
        description: 'Stuck on a big decision? Walk through it step by step.',
        template: "I'm trying to decide: {decision}. Here's what I'm weighing: {considerations}. Give me pros/cons, the regret test, and a clear recommendation.",
        fields: [
          { name: 'decision', placeholder: 'e.g., Should I go back to school?', type: 'text' },
          { name: 'considerations', placeholder: 'e.g., I have 2 kids, $10k savings', type: 'textarea' },
        ],
      },
      {
        id: 'learn-04',
        title: 'Daily Routine Optimizer',
        description: 'Share your current routine and get a better one — tailored to your life.',
        template: 'My routine: {current_routine}. My goals: {goals}. Biggest challenge: {challenge}. Redesign my daily routine to be more productive and sustainable.',
        fields: [
          { name: 'current_routine', placeholder: 'e.g., Wake 7am, scroll phone 30min...', type: 'textarea' },
          { name: 'goals', placeholder: 'e.g., Exercise more, read before bed', type: 'text' },
          { name: 'challenge', placeholder: 'e.g., I hit a wall at 2pm', type: 'text' },
        ],
      },
    ],
  },
]

async function seed() {
  console.log('Checking if prompt_packs table exists...')

  const { error: checkError } = await supabase.from('prompt_packs').select('id').limit(1)
  if (checkError) {
    console.error('Table check error:', checkError.message)
    console.log('Run the migration first: supabase/migrations/20260323_ai_studio.sql')
    process.exit(1)
  }

  for (const pack of packs) {
    // Check for duplicates
    const { data: existing } = await supabase
      .from('prompt_packs')
      .select('id')
      .eq('title', pack.title)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`  SKIP: "${pack.title}" already exists`)
      continue
    }

    const { error } = await supabase.from('prompt_packs').insert(pack)
    if (error) {
      console.error(`  ERROR inserting "${pack.title}":`, error.message)
    } else {
      console.log(`  OK: "${pack.title}" inserted`)
    }
  }

  // Verify
  const { data: allPacks } = await supabase
    .from('prompt_packs')
    .select('id, title, category, is_free')
    .order('created_at', { ascending: true })

  console.log('\nAll prompt packs in database:')
  for (const p of allPacks ?? []) {
    console.log(`  - ${p.title} (${p.category}, ${p.is_free ? 'free' : 'paid'})`)
  }
  console.log(`\nTotal: ${allPacks?.length ?? 0} packs`)
}

seed().catch(console.error)
