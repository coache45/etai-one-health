import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateCPRScore } from '@/lib/stress/guardian-cpr'
import { getAlertTier } from '@/types/guardian'
import { clampToUnit } from '@/lib/utils'

const IngestSchema = z.object({
  patient_id: z.string().uuid(),
  cognitive_load_index: z.number().min(0).max(1),
  circadian_disruption: z.number().min(0).max(1),
  movement_entropy: z.number().min(0).max(1),
  speech_degradation: z.number().min(0).max(1),
  identity_coherence: z.number().min(0).max(1),
  source_signals: z.record(z.string(), z.number()).optional().default({}),
  device_type: z.string().optional().default('wristband'),
  confidence: z.number().min(0).max(1).optional().default(0.8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = IngestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data
    const supabase = createAdminClient()

    // Look up patient to get entity_id and verify existence
    const { data: patient, error: patientError } = await supabase
      .from('guardian_patients')
      .select('id, entity_id')
      .eq('id', data.patient_id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Patient not found', patient_id: data.patient_id },
        { status: 404 }
      )
    }

    // Calculate CPR composite score
    const cprScore = calculateCPRScore({
      cognitive_load_index: data.cognitive_load_index,
      circadian_disruption: data.circadian_disruption,
      movement_entropy: data.movement_entropy,
      speech_degradation: data.speech_degradation,
      identity_coherence: data.identity_coherence,
    })

    // Map CPR dimensions to USM stress dimensions
    const stressAcute = clampToUnit(
      data.cognitive_load_index * 0.6 + data.movement_entropy * 0.4
    )
    const stressChronic = clampToUnit(
      data.circadian_disruption * 0.5 + data.speech_degradation * 0.5
    )
    const failureProbability = cprScore
    const recoveryCoefficient = clampToUnit(1 - data.identity_coherence)

    // Insert into usm_stress_vectors (unified layer)
    const { error: usmError } = await supabase
      .from('usm_stress_vectors')
      .insert({
        entity_id: patient.entity_id,
        entity_type: 'guardian_patient' as const,
        stress_index_acute: stressAcute,
        stress_index_chronic: stressChronic,
        failure_probability: failureProbability,
        recovery_coefficient: recoveryCoefficient,
        source_signals: data.source_signals,
        signal_source: data.device_type,
        confidence: data.confidence,
      })

    if (usmError) {
      return NextResponse.json(
        { error: 'Failed to insert USM stress vector', code: usmError.code },
        { status: 500 }
      )
    }

    // Insert into guardian_cognitive_vectors (Guardian-specific layer)
    const alertTier = getAlertTier(cprScore)
    const { data: cogVector, error: cogError } = await supabase
      .from('guardian_cognitive_vectors')
      .insert({
        patient_id: data.patient_id,
        entity_id: patient.entity_id,
        cognitive_load_index: data.cognitive_load_index,
        circadian_disruption: data.circadian_disruption,
        movement_entropy: data.movement_entropy,
        speech_degradation: data.speech_degradation,
        identity_coherence: data.identity_coherence,
        cpr_score: cprScore,
        source_signals: data.source_signals,
        confidence: data.confidence,
        alert_level: alertTier,
      })
      .select('*')
      .single()

    if (cogError || !cogVector) {
      return NextResponse.json(
        { error: 'Failed to insert cognitive vector', code: cogError?.code },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: cogVector.id,
      patient_id: data.patient_id,
      cpr_score: cprScore,
      alert_tier: alertTier,
      alert_triggered: cogVector.alert_triggered,
      recorded_at: cogVector.recorded_at,
      usm_mapping: {
        stress_index_acute: stressAcute,
        stress_index_chronic: stressChronic,
        failure_probability: failureProbability,
        recovery_coefficient: recoveryCoefficient,
      },
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
