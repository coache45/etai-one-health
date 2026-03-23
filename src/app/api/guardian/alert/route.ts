import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAlertTier, ALERT_THRESHOLDS } from '@/types/guardian'
import { ESCALATION_MATRIX, RECOMMENDED_ACTIONS } from '@/lib/guardian/alert-actions'

const AlertSchema = z.object({
  cognitive_vector_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = AlertSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { cognitive_vector_id } = parsed.data
    const supabase = createAdminClient()

    // Look up the cognitive vector
    const { data: vector, error: vectorError } = await supabase
      .from('guardian_cognitive_vectors')
      .select('*')
      .eq('id', cognitive_vector_id)
      .single()

    if (vectorError || !vector) {
      return NextResponse.json(
        { error: 'Cognitive vector not found', id: cognitive_vector_id },
        { status: 404 }
      )
    }

    // Determine alert tier
    const alertTier = getAlertTier(vector.cpr_score)

    if (!alertTier) {
      return NextResponse.json({
        alert: false,
        cpr_score: vector.cpr_score,
        message: 'CPR score below alert threshold (< 0.50)',
        patient_id: vector.patient_id,
      })
    }

    // Get the escalation roles for this tier
    const requiredRoles = ESCALATION_MATRIX[alertTier]

    // Query care network for this patient's active members matching escalation roles
    const { data: careNetwork, error: networkError } = await supabase
      .from('guardian_care_network')
      .select('id, contact_user_id, contact_name, contact_phone, contact_email, role, permissions, receives_alerts, is_active')
      .eq('patient_id', vector.patient_id)
      .eq('is_active', true)
      .in('role', requiredRoles)

    if (networkError) {
      return NextResponse.json(
        { error: 'Failed to query care network', code: networkError.code },
        { status: 500 }
      )
    }

    // Build recipients list
    const recipients = (careNetwork ?? []).map((member) => ({
      contact_name: member.contact_name,
      contact_phone: member.contact_phone,
      contact_email: member.contact_email,
      role: member.role,
      permissions: member.permissions,
      receives_alerts: member.receives_alerts,
    }))

    // Get threshold info for this tier
    const threshold = ALERT_THRESHOLDS[alertTier]

    return NextResponse.json({
      alert: true,
      cognitive_vector_id: vector.id,
      patient_id: vector.patient_id,
      cpr_score: vector.cpr_score,
      tier: alertTier,
      threshold: {
        min: threshold.min,
        max: threshold.max,
      },
      recorded_at: vector.recorded_at,
      recipients,
      recipient_count: recipients.length,
      escalation_roles: requiredRoles,
      recommended_actions: RECOMMENDED_ACTIONS[alertTier],
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
