import { clampToUnit } from '@/lib/utils';
import type { UnifiedStressVector, StressVectorInput } from '@/types/stress';

/**
 * Normalizes raw biometric/machine signals into a UnifiedStressVector.
 * Phase 1 stub -- returns calculated values from source signals.
 * Full implementation will include signal-specific normalization curves.
 */
export function normalizeToStressVector(
  input: StressVectorInput
): UnifiedStressVector {
  const { entity_id, entity_type, source_signals } = input;
  const values = Object.values(source_signals);
  const avg = values.length > 0
    ? values.reduce((sum, v) => sum + v, 0) / values.length
    : 0;

  return {
    entity_id,
    entity_type,
    timestamp: new Date().toISOString(),
    stress_index_acute: clampToUnit(avg),
    stress_index_chronic: clampToUnit(avg * 0.7),
    failure_probability: clampToUnit(avg * 0.5),
    recovery_coefficient: clampToUnit(1 - avg),
    source_signals,
    confidence: 0.5, // Low confidence for stub implementation
  };
}
