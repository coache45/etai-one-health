import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod/v4';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAlertTier } from '@/types/guardian';

const TIMERANGE_MS: Record<string, number> = {
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

const QuerySchema = z.object({
  patient_id: z.string().uuid(),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  timerange: z.enum(['1h', '6h', '24h', '7d', '30d']).optional().default('24h'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = QuerySchema.safeParse({
      patient_id: searchParams.get('patient_id'),
      limit: searchParams.get('limit'),
      timerange: searchParams.get('timerange'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { patient_id, limit, timerange } = parsed.data;
    const supabase = createAdminClient();

    // Calculate time window
    const windowMs = TIMERANGE_MS[timerange] ?? 24 * 60 * 60 * 1000;
    const since = new Date(Date.now() - windowMs).toISOString();

    // Query cognitive vectors within time window
    const { data: vectors, error: queryError } = await supabase
      .from('guardian_cognitive_vectors')
      .select('*')
      .eq('patient_id', patient_id)
      .gte('recorded_at', since)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (queryError) {
      return NextResponse.json(
        { error: 'Query failed', code: queryError.code },
        { status: 500 }
      );
    }

    if (!vectors || vectors.length === 0) {
      return NextResponse.json({
        patient_id,
        latest: null,
        history: [],
        trend: 'no_data',
        alert: null,
        timerange,
        count: 0,
      });
    }

    const latest = vectors[0]!;
    const latestScore = latest.cpr_score;
    const alertTier = getAlertTier(latestScore);

    // Calculate trend: compare latest to average of remaining readings
    let trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
    if (vectors.length < 2) {
      trend = 'insufficient_data';
    } else {
      const previousScores = vectors.slice(1).map((v) => v.cpr_score);
      const avgPrevious =
        previousScores.reduce((sum, s) => sum + s, 0) / previousScores.length;
      const delta = latestScore - avgPrevious;

      if (delta > 0.05) {
        trend = 'declining'; // Higher CPR = worse cognitive state
      } else if (delta < -0.05) {
        trend = 'improving'; // Lower CPR = better cognitive state
      } else {
        trend = 'stable';
      }
    }

    return NextResponse.json({
      patient_id,
      latest: {
        id: latest.id,
        recorded_at: latest.recorded_at,
        cpr_score: latestScore,
        cognitive_load_index: latest.cognitive_load_index,
        circadian_disruption: latest.circadian_disruption,
        movement_entropy: latest.movement_entropy,
        speech_degradation: latest.speech_degradation,
        identity_coherence: latest.identity_coherence,
        confidence: latest.confidence,
        alert_triggered: latest.alert_triggered,
        alert_level: latest.alert_level,
      },
      history: vectors.map((v) => ({
        id: v.id,
        recorded_at: v.recorded_at,
        cpr_score: v.cpr_score,
        alert_triggered: v.alert_triggered,
      })),
      trend,
      alert: alertTier
        ? { tier: alertTier, score: latestScore }
        : null,
      timerange,
      count: vectors.length,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
