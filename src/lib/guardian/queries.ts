/**
 * Server-only data access layer for the Guardian dashboard.
 * Uses the admin client (service role) to bypass RLS.
 * The dashboard layout already enforces auth -- these run server-side only.
 */
import { createAdminClient } from '@/lib/supabase/admin'

export interface PatientWithEntity {
  patientId: string
  entityId: string
  displayName: string
  diagnosisType: string | null
  diagnosisStage: string | null
  activeDeviceCount: number
  baselineCognitiveLoad: number | null
  emergencyContactPhone: string | null
}

export interface CognitiveVectorRow {
  id: string
  patient_id: string
  recorded_at: string
  cognitive_load_index: number
  circadian_disruption: number
  movement_entropy: number
  speech_degradation: number
  identity_coherence: number
  cpr_score: number
  confidence: number
  alert_triggered: boolean
  alert_level: string | null
}

export interface MemoryPromptRow {
  id: string
  prompt_type: string
  prompt_text: string
  prompt_priority: number
  effectiveness_score: number | null
  total_deliveries: number | null
  positive_responses: number | null
  is_active: boolean
}

export async function fetchPatientWithEntity(
  patientId: string
): Promise<PatientWithEntity | null> {
  const supabase = createAdminClient()

  const { data: patient, error: patErr } = await supabase
    .from('guardian_patients')
    .select('id, entity_id, diagnosis_type, diagnosis_stage, active_devices, baseline_cognitive_load, emergency_contact_phone')
    .eq('id', patientId)
    .single()

  if (patErr || !patient) return null

  const { data: entity } = await supabase
    .from('usm_entities')
    .select('display_name')
    .eq('id', patient.entity_id)
    .single()

  const devices = Array.isArray(patient.active_devices)
    ? patient.active_devices
    : []

  return {
    patientId: patient.id,
    entityId: patient.entity_id,
    displayName: entity?.display_name ?? 'Unknown Patient',
    diagnosisType: patient.diagnosis_type,
    diagnosisStage: patient.diagnosis_stage,
    activeDeviceCount: devices.length,
    baselineCognitiveLoad: patient.baseline_cognitive_load,
    emergencyContactPhone: patient.emergency_contact_phone,
  }
}

export async function fetchLatestCognitiveVector(
  patientId: string
): Promise<CognitiveVectorRow | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('guardian_cognitive_vectors')
    .select('id, patient_id, recorded_at, cognitive_load_index, circadian_disruption, movement_entropy, speech_degradation, identity_coherence, cpr_score, confidence, alert_triggered, alert_level')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data
}

export async function fetchCognitiveHistory(
  patientId: string,
  hours: number
): Promise<CognitiveVectorRow[]> {
  const supabase = createAdminClient()
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('guardian_cognitive_vectors')
    .select('id, patient_id, recorded_at, cognitive_load_index, circadian_disruption, movement_entropy, speech_degradation, identity_coherence, cpr_score, confidence, alert_triggered, alert_level')
    .eq('patient_id', patientId)
    .gte('recorded_at', since)
    .order('recorded_at', { ascending: true })

  if (error || !data) return []
  return data
}

export async function fetchRecentMemoryPrompts(
  patientId: string,
  limit: number
): Promise<MemoryPromptRow[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('guardian_memory_prompts')
    .select('id, prompt_type, prompt_text, prompt_priority, effectiveness_score, total_deliveries, positive_responses, is_active')
    .eq('patient_id', patientId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data
}
