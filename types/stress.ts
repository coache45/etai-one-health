/**
 * Unified Stress Model (USM) type definitions.
 * The Golden Thread: human and machine stress are isomorphic degradation signals.
 */

export type USMDimension =
  | 'stress_index_acute'
  | 'stress_index_chronic'
  | 'failure_probability'
  | 'recovery_coefficient';

export type StressLevel = 'nominal' | 'elevated' | 'high' | 'critical';

export interface UnifiedStressVector {
  entity_id: string;
  entity_type: 'human' | 'machine';
  timestamp: string; // ISO 8601
  stress_index_acute: number;    // 0.0 - 1.0
  stress_index_chronic: number;  // 0.0 - 1.0
  failure_probability: number;   // 0.0 - 1.0
  recovery_coefficient: number;  // 0.0 - 1.0
  source_signals: Record<string, number>;
  confidence: number;            // 0.0 - 1.0
}

export interface HarmonicIndex {
  pairing_id: string;
  human_id: string;
  machine_id: string;
  hmhi_score: number;          // 0.0 - 1.0 (1.0 = perfect harmony)
  risk_flag: 'green' | 'yellow' | 'red';
  recommendation: string;
  calculated_at: string;
}

export interface TemporalResonance {
  entity_id: string;
  resonance_type: string;
  frequency_hz: number;
  amplitude: number;
  phase_offset: number;
  analysis_window_start: string;
  analysis_window_end: string;
}

export interface StressVectorInput {
  entity_id: string;
  entity_type: 'human' | 'machine';
  source_signals: Record<string, number>;
}

export function getStressLevel(value: number): StressLevel {
  if (value < 0.3) return 'nominal';
  if (value < 0.6) return 'elevated';
  if (value < 0.8) return 'high';
  return 'critical';
}
