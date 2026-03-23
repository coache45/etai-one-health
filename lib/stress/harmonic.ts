import type { UnifiedStressVector, HarmonicIndex } from '@/types/stress';
import { clampToUnit } from '@/lib/utils';

/**
 * Calculates the Human-Machine Harmonic Index (HMHI).
 * Measures alignment between a human and machine stress profile.
 * 1.0 = perfect harmony, 0.0 = maximum dissonance.
 */
export function calculateHMHI(
  human: UnifiedStressVector,
  machine: UnifiedStressVector,
  pairingId: string
): HarmonicIndex {
  // Dimensional distance (lower distance = higher harmony)
  const acuteDelta = Math.abs(human.stress_index_acute - machine.stress_index_acute);
  const chronicDelta = Math.abs(human.stress_index_chronic - machine.stress_index_chronic);
  const failureDelta = Math.abs(human.failure_probability - machine.failure_probability);
  const recoveryDelta = Math.abs(human.recovery_coefficient - machine.recovery_coefficient);

  const avgDelta = (acuteDelta + chronicDelta + failureDelta + recoveryDelta) / 4;
  const score = clampToUnit(1 - avgDelta);

  let risk_flag: 'green' | 'yellow' | 'red';
  let recommendation: string;

  if (score >= 0.7) {
    risk_flag = 'green';
    recommendation = 'Pairing is well-aligned. Continue normal operations.';
  } else if (score >= 0.4) {
    risk_flag = 'yellow';
    recommendation = 'Moderate dissonance detected. Consider adjustment or monitoring.';
  } else {
    risk_flag = 'red';
    recommendation = 'High dissonance. Recommend immediate reassignment or intervention.';
  }

  return {
    pairing_id: pairingId,
    human_id: human.entity_id,
    machine_id: machine.entity_id,
    hmhi_score: score,
    risk_flag,
    recommendation,
    calculated_at: new Date().toISOString(),
  };
}
