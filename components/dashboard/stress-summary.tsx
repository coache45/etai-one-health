import { Card } from '@/components/ui/card';
import type { UnifiedStressVector } from '@/types/stress';
import { getStressLevel } from '@/types/stress';

const levelColors = {
  nominal: 'text-success',
  elevated: 'text-gold',
  high: 'text-warning',
  critical: 'text-danger',
} as const;

interface StressSummaryProps {
  vector: UnifiedStressVector | null;
}

export function StressSummary({ vector }: StressSummaryProps) {
  if (!vector) {
    return (
      <Card>
        <p className="text-sm text-text-muted">No stress data available</p>
      </Card>
    );
  }

  const dimensions = [
    { label: 'Acute Stress', value: vector.stress_index_acute },
    { label: 'Chronic Stress', value: vector.stress_index_chronic },
    { label: 'Failure Probability', value: vector.failure_probability },
    { label: 'Recovery', value: vector.recovery_coefficient },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dimensions.map(({ label, value }) => {
        const level = getStressLevel(value);
        return (
          <Card key={label} padding="sm">
            <p className="text-xs font-medium text-text-muted">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${levelColors[level]}`}>
              {(value * 100).toFixed(1)}%
            </p>
            <p className="mt-0.5 text-xs capitalize text-text-muted">{level}</p>
          </Card>
        );
      })}
    </div>
  );
}
