'use client';

import { Card } from '@/components/ui/card';
import type { CognitiveVector } from '@/types/guardian';

interface CognitiveChartProps {
  vector: CognitiveVector | null;
}

export function CognitiveChart({ vector }: CognitiveChartProps) {
  if (!vector) {
    return (
      <Card>
        <p className="text-sm text-text-muted">No cognitive data available</p>
      </Card>
    );
  }

  const dimensions = [
    { label: 'Cognitive Load', value: vector.cognitive_load_index },
    { label: 'Circadian Disruption', value: vector.circadian_disruption },
    { label: 'Movement Entropy', value: vector.movement_entropy },
    { label: 'Speech Degradation', value: vector.speech_degradation },
    { label: 'Identity Coherence', value: vector.identity_coherence },
  ] as const;

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        CPR Dimensions
      </h3>
      <div className="flex flex-col gap-3">
        {dimensions.map(({ label, value }) => (
          <div key={label}>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">{label}</span>
              <span className="font-medium text-foreground">
                {(value * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-surface-muted">
              <div
                className="h-2 rounded-full bg-gold transition-all"
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
