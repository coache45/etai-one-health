import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { insertGuide, generateSlug } from '@/lib/guides/queries'
import type { GuideCategory, GuideDifficulty, GuideChapter } from '@/types/guides'

const GenerateSchema = z.object({
  topic: z.string().min(3).max(200),
  category: z.enum(['general', 'sleep', 'stress', 'nutrition', 'movement', 'cognition', 'guardian', 'couples', 'ai_basics', 'health', 'business', 'relationships', 'tools', 'manufacturing']).optional().default('general'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  publish: z.boolean().optional().default(false),
})

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = GenerateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { topic, category, difficulty, publish } = parsed.data

    // Check for Claude/Anthropic API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured. Set it in Vercel environment variables.' },
        { status: 500 }
      )
    }

    // Call Claude API directly via fetch (no SDK dependency needed)
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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

    if (!claudeResponse.ok) {
      const errBody = await claudeResponse.text()
      return NextResponse.json(
        { error: 'Claude API error', status: claudeResponse.status, details: errBody },
        { status: 502 }
      )
    }

    const claudeData = await claudeResponse.json()
    const responseText = claudeData?.content?.[0]?.text

    if (!responseText) {
      return NextResponse.json(
        { error: 'Empty response from Claude API' },
        { status: 502 }
      )
    }

    // Parse the generated guide JSON
    let guideContent: {
      title: string
      tagline: string
      emoji: string
      chapters: GuideChapter[]
    }

    try {
      // Handle case where Claude wraps in markdown code fences
      const cleaned = responseText.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
      guideContent = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse Claude response as JSON', raw: responseText.slice(0, 500) },
        { status: 502 }
      )
    }

    // Validate required fields
    if (!guideContent.title || !guideContent.chapters || !Array.isArray(guideContent.chapters)) {
      return NextResponse.json(
        { error: 'Generated content missing required fields (title, chapters)' },
        { status: 502 }
      )
    }

    // Save to Supabase
    const slug = generateSlug(guideContent.title)
    const saved = await insertGuide({
      title: guideContent.title,
      tagline: guideContent.tagline || '',
      emoji: guideContent.emoji || '📖',
      slug,
      category: category as GuideCategory,
      difficulty: difficulty as GuideDifficulty,
      chapters: guideContent.chapters,
      is_published: publish,
    })

    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to save guide to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: saved.id,
      title: saved.title,
      slug: saved.slug,
      chapters_count: saved.chapters.length,
      is_published: saved.is_published,
      url: `/guides/${saved.slug}`,
    }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error', message: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    )
  }
}
