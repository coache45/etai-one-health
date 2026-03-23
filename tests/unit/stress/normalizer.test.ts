import { describe, it, expect } from 'vitest';
import { normalizeToStressVector } from '@/lib/stress/normalizer';

describe('normalizeToStressVector', () => {
  it('returns all dimensions clamped between 0 and 1', () => {
    const result = normalizeToStressVector({
      entity_id: '00000000-0000-0000-0000-000000000001',
      entity_type: 'human',
      source_signals: { hrv: 0.8, cortisol: 0.6, skin_conductance: 0.7 },
    });

    expect(result.stress_index_acute).toBeGreaterThanOrEqual(0);
    expect(result.stress_index_acute).toBeLessThanOrEqual(1);
    expect(result.stress_index_chronic).toBeGreaterThanOrEqual(0);
    expect(result.stress_index_chronic).toBeLessThanOrEqual(1);
    expect(result.failure_probability).toBeGreaterThanOrEqual(0);
    expect(result.failure_probability).toBeLessThanOrEqual(1);
    expect(result.recovery_coefficient).toBeGreaterThanOrEqual(0);
    expect(result.recovery_coefficient).toBeLessThanOrEqual(1);
  });

  it('handles empty source signals', () => {
    const result = normalizeToStressVector({
      entity_id: '00000000-0000-0000-0000-000000000002',
      entity_type: 'machine',
      source_signals: {},
    });

    expect(result.stress_index_acute).toBe(0);
    expect(result.recovery_coefficient).toBe(1);
  });

  it('preserves entity metadata', () => {
    const result = normalizeToStressVector({
      entity_id: '00000000-0000-0000-0000-000000000003',
      entity_type: 'human',
      source_signals: { hrv: 0.5 },
    });

    expect(result.entity_id).toBe('00000000-0000-0000-0000-000000000003');
    expect(result.entity_type).toBe('human');
    expect(result.timestamp).toBeTruthy();
  });
});
