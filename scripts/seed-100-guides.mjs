#!/usr/bin/env node
/**
 * seed-100-guides.mjs
 * Generates 100 ELI5 guides via Claude API and inserts them into Supabase.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/seed-100-guides.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 * Reads ANTHROPIC_API_KEY from environment (pass inline or export first)
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local')
    const lines = readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch { /* ignore */ }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Pass it inline:\n  ANTHROPIC_API_KEY=sk-ant-... node scripts/seed-100-guides.mjs')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// 100 Topics
// ---------------------------------------------------------------------------
const TOPICS = [
  // ai_basics (20)
  { topic: 'How AI Actually Thinks (Spoiler: It Doesn\'t)', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'What Is a Prompt and Why Does Wording Matter?', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'LLMs Explained: The World\'s Fanciest Autocomplete', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'Why AI Hallucinates (And How to Catch It)', category: 'ai_basics', difficulty: 'intermediate' },
  { topic: 'AI Agents: Your New Digital Coworkers', category: 'ai_basics', difficulty: 'intermediate' },
  { topic: 'What Are Tokens and Why Do They Cost Money?', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'The Difference Between AI, Machine Learning, and Deep Learning', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'How to Talk to AI Like a Pro (Prompt Engineering 101)', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'What Is Fine-Tuning and When Do You Need It?', category: 'ai_basics', difficulty: 'intermediate' },
  { topic: 'AI Safety: Why Guardrails Matter', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'Embeddings: How AI Understands Meaning', category: 'ai_basics', difficulty: 'intermediate' },
  { topic: 'RAG Explained: Teaching AI Your Own Data', category: 'ai_basics', difficulty: 'intermediate' },
  { topic: 'Why AI Needs So Much Computing Power', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'Open Source vs Closed Source AI: What\'s the Difference?', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'How AI Sees Images (Computer Vision for Beginners)', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'Voice AI: How Siri and Alexa Understand You', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'AI Bias: Why Machines Inherit Our Prejudices', category: 'ai_basics', difficulty: 'intermediate' },
  { topic: 'The History of AI in 5 Minutes', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'What Multimodal AI Means for Everyday Life', category: 'ai_basics', difficulty: 'beginner' },
  { topic: 'AI Ethics: Who\'s Responsible When AI Gets It Wrong?', category: 'ai_basics', difficulty: 'intermediate' },

  // health (20)
  { topic: 'HRV Explained: Your Body\'s Check Engine Light', category: 'health', difficulty: 'beginner' },
  { topic: 'Sleep Stages: What Happens When You Close Your Eyes', category: 'health', difficulty: 'beginner' },
  { topic: 'Cognitive Load: Why Your Brain Feels Full', category: 'health', difficulty: 'beginner' },
  { topic: 'Understanding Dementia: A Family Guide', category: 'health', difficulty: 'beginner' },
  { topic: 'Caregiver Burnout: How to Help Without Breaking', category: 'health', difficulty: 'beginner' },
  { topic: 'Blood Pressure Numbers: What They Actually Mean', category: 'health', difficulty: 'beginner' },
  { topic: 'Gut Health: Your Second Brain', category: 'health', difficulty: 'beginner' },
  { topic: 'Inflammation: The Fire Inside Your Body', category: 'health', difficulty: 'beginner' },
  { topic: 'How Stress Rewires Your Brain (And How to Undo It)', category: 'health', difficulty: 'beginner' },
  { topic: 'Wearable Health Data: What to Track and What to Ignore', category: 'health', difficulty: 'beginner' },
  { topic: 'Hydration: More Than Just Drinking Water', category: 'health', difficulty: 'beginner' },
  { topic: 'Understanding Blood Sugar Without the Medical Degree', category: 'health', difficulty: 'beginner' },
  { topic: 'The Science of Habit Formation', category: 'health', difficulty: 'beginner' },
  { topic: 'Breathing Techniques That Actually Work', category: 'health', difficulty: 'beginner' },
  { topic: 'What Your Resting Heart Rate Tells You', category: 'health', difficulty: 'beginner' },
  { topic: 'Screen Time and Sleep: The Real Connection', category: 'health', difficulty: 'beginner' },
  { topic: 'Vitamin D: The Sunshine Vitamin Explained', category: 'health', difficulty: 'beginner' },
  { topic: 'How Walking 30 Minutes Changes Your Body', category: 'health', difficulty: 'beginner' },
  { topic: 'Anxiety vs Stress: What\'s the Difference?', category: 'health', difficulty: 'beginner' },
  { topic: 'Meal Timing: When You Eat Matters', category: 'health', difficulty: 'beginner' },

  // business (20)
  { topic: 'Idea Validation: How to Know Before You Build', category: 'business', difficulty: 'beginner' },
  { topic: 'Sales Funnels Explained With a Lemonade Stand', category: 'business', difficulty: 'beginner' },
  { topic: 'Email Marketing: Your Highest-ROI Channel', category: 'business', difficulty: 'beginner' },
  { topic: 'Pricing Psychology: Why $9.99 Beats $10', category: 'business', difficulty: 'beginner' },
  { topic: 'MVP: Build Less, Learn More', category: 'business', difficulty: 'beginner' },
  { topic: 'Customer Avatars: Know Who You\'re Talking To', category: 'business', difficulty: 'beginner' },
  { topic: 'SEO in Plain English: How Google Finds You', category: 'business', difficulty: 'beginner' },
  { topic: 'Social Proof: Why Reviews Run the World', category: 'business', difficulty: 'beginner' },
  { topic: 'Subscription Models: Recurring Revenue 101', category: 'business', difficulty: 'beginner' },
  { topic: 'Cash Flow vs Profit: The Difference That Kills Businesses', category: 'business', difficulty: 'beginner' },
  { topic: 'Landing Pages That Convert: A Step-by-Step Guide', category: 'business', difficulty: 'beginner' },
  { topic: 'Content Marketing: Teaching Sells Better Than Pitching', category: 'business', difficulty: 'beginner' },
  { topic: 'Churn: Why Customers Leave and How to Stop It', category: 'business', difficulty: 'beginner' },
  { topic: 'Unit Economics: Does Your Business Math Work?', category: 'business', difficulty: 'intermediate' },
  { topic: 'How to Write a One-Page Business Plan', category: 'business', difficulty: 'beginner' },
  { topic: 'Partnerships and Affiliates: Growing Without Ads', category: 'business', difficulty: 'beginner' },
  { topic: 'Customer Support as a Growth Strategy', category: 'business', difficulty: 'beginner' },
  { topic: 'AI for Small Business: Where to Start', category: 'business', difficulty: 'beginner' },
  { topic: 'Bootstrapping vs Fundraising: Pros and Cons', category: 'business', difficulty: 'beginner' },
  { topic: 'Building in Public: Why Transparency Wins', category: 'business', difficulty: 'beginner' },

  // relationships (15)
  { topic: 'Setting Couples Goals That Actually Stick', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Love Languages: Finding Your Partner\'s Frequency', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Money Talks: How Couples Can Discuss Finances Without Fighting', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Healthy Boundaries: The Fence That Makes Better Neighbors', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Active Listening: Hearing What\'s Really Being Said', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Conflict Resolution: Fighting Fair 101', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Quality Time in a Busy World', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Co-Parenting With AI Tools', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Emotional Bids: The Tiny Moments That Build Relationships', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Relationship Check-Ins: A Weekly Ritual', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Supporting a Partner Through Career Change', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Digital Wellness for Couples', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Apology Languages: Saying Sorry the Right Way', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Long-Distance Relationship Survival Guide', category: 'relationships', difficulty: 'beginner' },
  { topic: 'Building Trust After It\'s Been Broken', category: 'relationships', difficulty: 'beginner' },

  // tools (15)
  { topic: 'AI for Email: Write Better Messages in Half the Time', category: 'tools', difficulty: 'beginner' },
  { topic: 'Notion for Beginners: Your Digital Second Brain', category: 'tools', difficulty: 'beginner' },
  { topic: 'Zapier: Automate the Boring Stuff', category: 'tools', difficulty: 'beginner' },
  { topic: 'CRM Basics: Why Every Business Needs One', category: 'tools', difficulty: 'beginner' },
  { topic: 'AI Podcast Tools: From Recording to Publishing', category: 'tools', difficulty: 'beginner' },
  { topic: 'Canva + AI: Design Like a Pro Without Design Skills', category: 'tools', difficulty: 'beginner' },
  { topic: 'Google Sheets Formulas That Save Hours', category: 'tools', difficulty: 'beginner' },
  { topic: 'Password Managers: Stop Reusing Passwords', category: 'tools', difficulty: 'beginner' },
  { topic: 'AI Meeting Assistants: Never Take Notes Again', category: 'tools', difficulty: 'beginner' },
  { topic: 'Scheduling Tools: End the Email Ping-Pong', category: 'tools', difficulty: 'beginner' },
  { topic: 'Cloud Storage: Google Drive vs Dropbox vs OneDrive', category: 'tools', difficulty: 'beginner' },
  { topic: 'AI Writing Assistants: Claude, ChatGPT, and Friends', category: 'tools', difficulty: 'beginner' },
  { topic: 'Video Editing With AI: Beginner\'s Guide', category: 'tools', difficulty: 'beginner' },
  { topic: 'Task Management: Todoist vs Asana vs Trello', category: 'tools', difficulty: 'beginner' },
  { topic: 'AI Image Generators: What They Can (and Can\'t) Do', category: 'tools', difficulty: 'beginner' },

  // manufacturing (10)
  { topic: 'Predictive Maintenance: Fix It Before It Breaks', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'OEE Explained: The One Number That Rules the Factory', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'PLCs for Beginners: The Brains of the Factory Floor', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'Digital Twins: Your Factory\'s Virtual Mirror', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'Lean Manufacturing: Doing More With Less', category: 'manufacturing', difficulty: 'beginner' },
  { topic: 'Six Sigma in Plain English', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'SCADA Systems: Watching the Whole Factory at Once', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'IoT on the Factory Floor: Sensors That Talk', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'AI Quality Inspection: When Cameras Replace Clipboards', category: 'manufacturing', difficulty: 'intermediate' },
  { topic: 'Supply Chain Basics: From Raw Material to Your Door', category: 'manufacturing', difficulty: 'beginner' },
]

// ---------------------------------------------------------------------------
// System prompt (matches /api/guides/generate but broader)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are an expert educator writing for ET AI ONE Health — a platform that brings AI down to earth for everyday people.
Your job is to create warm, accessible ELI5 ("Explain Like I'm 5") guides on any topic: AI, health, business, relationships, tools, or manufacturing.

STYLE RULES:
- Write like you're explaining to a smart friend, not a textbook
- Use everyday analogies (kitchens, cars, phone batteries, gardens, LEGO bricks)
- Short paragraphs (2-3 sentences max)
- No jargon without immediately explaining it in plain English
- Warm, encouraging tone — never condescending
- Include actionable steps people can do TODAY
- Each chapter should have exactly one core idea
- Pass the Grandmother Test: would your grandmother understand this?

OUTPUT FORMAT: Return valid JSON matching this exact structure:
{
  "title": "Guide title (catchy, not clinical)",
  "tagline": "One-sentence hook (under 100 chars)",
  "emoji": "Single emoji representing the guide",
  "chapters": [
    {
      "title": "Chapter title",
      "emoji": "Chapter emoji",
      "content": "Main explanation text. Use double newlines for paragraph breaks.",
      "analogy": "A relatable real-world comparison (optional, omit key if not needed)",
      "steps": [
        {
          "title": "Step title",
          "description": "What to do and why"
        }
      ]
    }
  ]
}

Generate 3-5 chapters. Every chapter MUST have content. At least 2 chapters should have analogies. At least 2 chapters should have steps. Return ONLY the JSON object, no markdown fences.`

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ---------------------------------------------------------------------------
// Generate a single guide via Claude API
// ---------------------------------------------------------------------------
async function generateGuide(topic, category, difficulty) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create an ELI5 guide about: "${topic}"\n\nCategory: ${category}\nDifficulty level: ${difficulty}\n\nRemember: warm, accessible, actionable. Pass the Grandmother Test. Return only the JSON.`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Claude API ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text
  if (!text) throw new Error('Empty response from Claude')

  // Parse JSON (handle markdown fences)
  const cleaned = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(cleaned)
}

// ---------------------------------------------------------------------------
// Insert a guide into Supabase via REST API
// ---------------------------------------------------------------------------
async function insertGuide(guide) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/eli5_guides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(guide),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Supabase ${res.status}: ${errText.slice(0, 300)}`)
  }

  const rows = await res.json()
  return rows[0]
}

// ---------------------------------------------------------------------------
// Check for existing guides to skip duplicates
// ---------------------------------------------------------------------------
async function fetchExistingSlugs() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/eli5_guides?select=slug`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  if (!res.ok) return new Set()
  const rows = await res.json()
  return new Set(rows.map((r) => r.slug))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n🚀 ET AI ONE Health — 100 ELI5 Guide Generator`)
  console.log(`   ${TOPICS.length} topics across 6 categories\n`)

  const existingSlugs = await fetchExistingSlugs()
  console.log(`   Found ${existingSlugs.size} existing guides in database\n`)

  let success = 0
  let skipped = 0
  let failed = 0
  const failures = []

  for (let i = 0; i < TOPICS.length; i++) {
    const { topic, category, difficulty } = TOPICS[i]
    const num = `[${String(i + 1).padStart(3, ' ')}/${TOPICS.length}]`

    try {
      // Generate via Claude
      const guideContent = await generateGuide(topic, category, difficulty)

      // Build slug and check for duplicates
      let slug = generateSlug(guideContent.title || topic)
      if (existingSlugs.has(slug)) {
        // Append random suffix
        slug = `${slug}-${Date.now().toString(36).slice(-4)}`
      }

      if (existingSlugs.has(slug)) {
        console.log(`⏭️  ${num} SKIP (duplicate slug): ${topic}`)
        skipped++
        continue
      }

      // Insert into Supabase
      const saved = await insertGuide({
        title: guideContent.title || topic,
        tagline: guideContent.tagline || '',
        emoji: guideContent.emoji || '📖',
        slug,
        category,
        difficulty,
        chapters: guideContent.chapters || [],
        is_published: true,
      })

      existingSlugs.add(slug)
      success++
      console.log(`✅ ${num} ${saved.title} (${category})`)
    } catch (err) {
      failed++
      failures.push({ topic, error: err.message })
      console.log(`❌ ${num} FAILED: ${topic} — ${err.message.slice(0, 100)}`)
    }

    // 2-second delay between API calls
    if (i < TOPICS.length - 1) {
      await sleep(2000)
    }
  }

  // Summary
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`📊 RESULTS`)
  console.log(`   ✅ Success: ${success}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Failed:  ${failed}`)
  console.log(`   📚 Total in DB: ${existingSlugs.size}`)

  if (failures.length > 0) {
    console.log(`\n❌ FAILURES:`)
    for (const f of failures) {
      console.log(`   - ${f.topic}: ${f.error.slice(0, 80)}`)
    }
  }

  console.log(`\n🎉 Done! Visit /guides to see your library.\n`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
