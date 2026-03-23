import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { fetchAllGuides, insertGuide, updateGuide, deleteGuide, generateSlug } from '@/lib/guides/queries'

const ChapterSchema = z.object({
  title: z.string(),
  emoji: z.string(),
  content: z.string(),
  analogy: z.string().optional(),
  steps: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })).optional(),
})

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  tagline: z.string().max(200).optional().default(''),
  emoji: z.string().max(4).optional().default('📖'),
  category: z.string().optional().default('general'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  chapters: z.array(ChapterSchema).optional().default([]),
  is_published: z.boolean().optional().default(false),
})

const UpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  tagline: z.string().max(200).optional(),
  emoji: z.string().max(4).optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  chapters: z.array(ChapterSchema).optional(),
  is_published: z.boolean().optional(),
})

const DeleteSchema = z.object({
  id: z.string().uuid(),
})

// GET: List all guides (admin view — includes unpublished)
export async function GET() {
  try {
    const guides = await fetchAllGuides()
    return NextResponse.json({ guides, count: guides.length })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 })
  }
}

// POST: Create a new guide manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data
    const slug = generateSlug(data.title)

    const guide = await insertGuide({
      title: data.title,
      tagline: data.tagline,
      emoji: data.emoji,
      slug,
      category: data.category as 'general',
      difficulty: data.difficulty,
      chapters: data.chapters,
      is_published: data.is_published,
    })

    if (!guide) {
      return NextResponse.json({ error: 'Failed to create guide' }, { status: 500 })
    }

    return NextResponse.json(guide, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update an existing guide
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = UpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { id, ...updates } = parsed.data
    const guide = await updateGuide(id, updates)

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found or update failed' }, { status: 404 })
    }

    return NextResponse.json(guide)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Remove a guide
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = DeleteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const success = await deleteGuide(parsed.data.id)

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete guide' }, { status: 500 })
    }

    return NextResponse.json({ deleted: true, id: parsed.data.id })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
