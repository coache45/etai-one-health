import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod/v4';
import { createClient } from '@/lib/supabase/server';
import { getAlertTier, ALERT_THRESHOLDS } from '@/types/guardian';
import type { AlertTier } from '@/types/guardian';
import type { CareNetworkRole } from '@/types/database';

const AlertSchema = z.object({
  cognitive_vector_id: z.string().uuid(),
});

// Escalation matrix: which care network roles get notified at each tier
const ESCALATION_MATRIX: Record<AlertTier, CareNetworkRole[]> = {
  info: ['caregiver'],
  caution: ['caregiver', 'poa'],
  warning: ['caregiver', 'poa', 'medical'],
  critical: ['caregiver', 'poa', 'medical', 'emergency'],
  emergency: ['caregiver', 'poa', 'medical', 'emergency'],
};

// Recommended actions per tier
const RECOMMENDED_ACTIONS: Record<AlertTier, string[]> = {
  info: [
    'Log observation in patient record',
    'Schedule follow-up check within 24 hours',
  ],
  caution: [
    'Notify primary caregiver via push notification',
    'Increase monitoring frequency to every 30 minutes',
    'Review recent memory prompt effectiveness',
  ],
  warning: [
    'Notify caregiver and POA via push + SMS',
    'Activate continuous monitoring mode',
    'Prepare identity reinforcement prompts',
    'Review medication compliance',
  ],
  critical: [
    'Notify all care network via push + SMS + call',
    'Activate geofence monitoring if not already active',
    'Prepare emergency contact information',
    'Begin 5-minute check-in cycle',
  ],
  emergency: [
    'Notify all care network immediately via all channels',
    'Contact emergency services (911) if SOS triggered',
    'Activate full location tracking',
    'Dispatch nearest care network member',
    'Record all sensor data for medical review',
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = AlertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { cognitive_vector_id } = parsed.data;
    const supabase = await createClient();

    // Look up the cognitive vector
    const { data: vector, error: vectorError } = await supabase
      .from('guardian_cognitive_vectors')
      .select('*')
      .eq('id', cognitive_vector_id)
      .single();

    if (vectorError || !vector) {
      return NextResponse.json(
        { error: 'Cognitive vector not found', id: cognitive_vector_id },
        { status: 404 }
      );
    }

    // Determine alert tier
    const alertTier = getAlertTier(vector.cpr_composite_score);

    if (!alertTier) {
      return NextResponse.json({
        alert: false,
        cpr_score: vector.cpr_composite_score,
        message: 'CPR score below alert threshold (< 0.50)',
        patient_id: vector.patient_id,
      });
    }

    // Get the escalation roles for this tier
    const requiredRoles = ESCALATION_MATRIX[alertTier];

    // Query care network for this patient's active members matching escalation roles
    const { data: careNetwork, error: networkError } = await supabase
      .from('guardian_care_network')
      .select('id, member_id, role, permissions, is_active')
      .eq('patient_id', vector.patient_id)
      .eq('is_active', true)
      .in('role', requiredRoles);

    if (networkError) {
      return NextResponse.json(
        { error: 'Failed to query care network', code: networkError.code },
        { status: 500 }
      );
    }

    // Look up entity details for each care network member
    const memberIds = (careNetwork ?? []).map((m) => m.member_id);
    let memberDetails: Record<string, { name: string; metadata: Record<string, unknown> }> = {};

    if (memberIds.length > 0) {
      const { data: entities } = await supabase
        .from('usm_entities')
        .select('id, name, metadata')
        .in('id', memberIds);

      if (entities) {
        memberDetails = Object.fromEntries(
          entities.map((e) => [e.id, { name: e.name, metadata: e.metadata }])
        );
      }
    }

    // Build recipients list
    const recipients = (careNetwork ?? []).map((member) => {
      const details = memberDetails[member.member_id];
      return {
        member_id: member.member_id,
        role: member.role,
        name: details?.name ?? 'Unknown',
        contact: details?.metadata ?? {},
        permissions: member.permissions,
      };
    });

    // Get threshold info for this tier
    const threshold = ALERT_THRESHOLDS[alertTier];

    return NextResponse.json({
      alert: true,
      cognitive_vector_id: vector.id,
      patient_id: vector.patient_id,
      cpr_score: vector.cpr_composite_score,
      tier: alertTier,
      threshold: {
        min: threshold.min,
        max: threshold.max,
      },
      timestamp: vector.timestamp,
      recipients,
      recipient_count: recipients.length,
      escalation_roles: requiredRoles,
      recommended_actions: RECOMMENDED_ACTIONS[alertTier],
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
