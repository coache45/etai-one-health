import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod/v4';

const BiometricPayloadSchema = z.object({
  entity_id: z.string().uuid(),
  signals: z.record(z.string(), z.number()),
  device_type: z.string().optional(),
  timestamp: z.iso.datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BiometricPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // TODO: Normalize signals via USM normalizer and persist to Supabase
    return NextResponse.json(
      { error: 'Not implemented', message: 'Health data ingestion endpoint stub' },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: 'ok', endpoint: '/api/health' },
    { status: 200 }
  );
}
