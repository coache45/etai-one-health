import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod/v4';

const StressQuerySchema = z.object({
  entity_id: z.string().uuid(),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = StressQuerySchema.safeParse({
      entity_id: searchParams.get('entity_id'),
      limit: searchParams.get('limit'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // TODO: Query usm_stress_vectors from Supabase
    return NextResponse.json(
      { error: 'Not implemented', message: 'Stress vector query endpoint stub' },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate and ingest stress vector
    void body;

    return NextResponse.json(
      { error: 'Not implemented', message: 'Stress vector ingestion endpoint stub' },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
