import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod/v4';

const CognitiveVectorSchema = z.object({
  patient_id: z.string().uuid(),
  cognitive_load_index: z.number().min(0).max(1),
  circadian_disruption: z.number().min(0).max(1),
  movement_entropy: z.number().min(0).max(1),
  speech_degradation: z.number().min(0).max(1),
  identity_coherence: z.number().min(0).max(1),
  source_signals: z.record(z.string(), z.number()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CognitiveVectorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // TODO: Calculate CPR score, persist to guardian_cognitive_vectors, trigger alerts
    return NextResponse.json(
      { error: 'Not implemented', message: 'Guardian cognitive data ingestion endpoint stub' },
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
    { status: 'ok', endpoint: '/api/guardian' },
    { status: 200 }
  );
}
