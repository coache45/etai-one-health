/**
 * Guardian Device -- Cognitive Pattern Recognition (CPR) type definitions.
 * Extends USM with cognitive-specific degradation dimensions.
 */

export type CPRDimension =
  | 'cognitive_load_index'
  | 'circadian_disruption'
  | 'movement_entropy'
  | 'speech_degradation'
  | 'identity_coherence'

export type GuardianFormFactor =
  | 'wristband'
  | 'ring'
  | 'pin'
  | 'earring'
  | 'pendant'

export type AlertTier = 'info' | 'caution' | 'warning' | 'critical' | 'emergency'

export interface CognitiveVector {
  patient_id: string
  entity_id: string
  recorded_at: string
  cognitive_load_index: number // 0.0 - 1.0
  circadian_disruption: number // 0.0 - 1.0
  movement_entropy: number // 0.0 - 1.0
  speech_degradation: number // 0.0 - 1.0
  identity_coherence: number // 0.0 - 1.0
  cpr_score: number // 0.0 - 1.0 (weighted composite)
  source_signals: Record<string, number>
  confidence: number
}

export interface GuardianPatient {
  id: string
  entity_id: string
  diagnosis_type: string | null
  diagnosis_date: string | null
  diagnosis_stage: string | null
  primary_caregiver_id: string | null
  emergency_contact_phone: string | null
  baseline_cognitive_load: number | null
}

export interface MemoryPrompt {
  id: string
  patient_id: string
  prompt_type: string
  prompt_text: string
  prompt_priority: number
  effectiveness_score: number | null
  is_active: boolean
}

export interface GeofenceEvent {
  patient_id: string
  event_type: 'entered' | 'exited' | 'wandering'
  latitude: number
  longitude: number
  geofence_zone_id: string | null
  recorded_at: string
  alert_sent: boolean
}

export interface CareNetworkMember {
  patient_id: string
  contact_user_id: string | null
  contact_name: string
  contact_phone: string | null
  contact_email: string | null
  role: 'caregiver' | 'poa' | 'medical' | 'emergency'
  permissions: Record<string, boolean>
  receives_alerts: boolean
  is_active: boolean
}

export interface AgentConversation {
  patient_id: string
  session_id: string
  role: 'assistant' | 'user' | 'system'
  message_text: string
  message_type: string
  patient_sentiment: string | null
}

// CPR score weights (from CLAUDE.md spec)
export const CPR_WEIGHTS: Record<CPRDimension, number> = {
  cognitive_load_index: 0.15,
  circadian_disruption: 0.20,
  movement_entropy: 0.15,
  speech_degradation: 0.25,
  identity_coherence: 0.25,
} as const

// Alert tier thresholds (CPR composite score)
export const ALERT_THRESHOLDS: Record<AlertTier, { min: number; max: number }> = {
  info: { min: 0.50, max: 0.64 },
  caution: { min: 0.65, max: 0.79 },
  warning: { min: 0.80, max: 0.84 },
  critical: { min: 0.85, max: 0.89 },
  emergency: { min: 0.90, max: 1.00 },
} as const

export function getAlertTier(cprScore: number): AlertTier | null {
  if (cprScore >= 0.90) return 'emergency'
  if (cprScore >= 0.85) return 'critical'
  if (cprScore >= 0.80) return 'warning'
  if (cprScore >= 0.65) return 'caution'
  if (cprScore >= 0.50) return 'info'
  return null // Score below alert threshold
}
