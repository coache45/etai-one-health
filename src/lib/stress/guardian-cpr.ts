import { clampToUnit } from '@/lib/utils'
import { CPR_WEIGHTS, getAlertTier } from '@/types/guardian'
import type { CognitiveVector, AlertTier } from '@/types/guardian'

interface CPRInput {
  cognitive_load_index: number
  circadian_disruption: number
  movement_entropy: number
  speech_degradation: number
  identity_coherence: number
}

/**
 * Calculates the Cognitive Pattern Recognition (CPR) composite score.
 * Weighted average of 5 cognitive degradation dimensions.
 * Speech degradation and identity coherence are strongest indicators (25% each).
 */
export function calculateCPRScore(input: CPRInput): number {
  const score =
    clampToUnit(input.cognitive_load_index) * CPR_WEIGHTS.cognitive_load_index +
    clampToUnit(input.circadian_disruption) * CPR_WEIGHTS.circadian_disruption +
    clampToUnit(input.movement_entropy) * CPR_WEIGHTS.movement_entropy +
    clampToUnit(input.speech_degradation) * CPR_WEIGHTS.speech_degradation +
    clampToUnit(input.identity_coherence) * CPR_WEIGHTS.identity_coherence

  return clampToUnit(score)
}

/**
 * Evaluates a cognitive vector and returns the alert tier (if any).
 */
export function evaluateCognitiveAlert(
  vector: CognitiveVector
): { tier: AlertTier | null; score: number } {
  const score = calculateCPRScore(vector)
  return { tier: getAlertTier(score), score }
}
