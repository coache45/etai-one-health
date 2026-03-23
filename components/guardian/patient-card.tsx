import { Card } from '@/components/ui/card';
import type { GuardianPatient } from '@/types/guardian';
import { getAlertTier } from '@/types/guardian';

const tierColors = {
  info: 'bg-blue-100 text-blue-800',
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
  emergency: 'bg-red-200 text-red-900',
} as const;

interface PatientCardProps {
  patient: GuardianPatient;
  currentCPR: number | null;
}

export function PatientCard({ patient, currentCPR }: PatientCardProps) {
  const tier = currentCPR !== null ? getAlertTier(currentCPR) : null;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">
            Patient {patient.id.slice(0, 8)}
          </h3>
          <p className="text-sm text-text-muted">{patient.diagnosis_type}</p>
          <p className="text-xs text-text-muted">Stage: {patient.diagnosis_stage}</p>
        </div>
        {tier && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tierColors[tier]}`}
          >
            {tier.toUpperCase()}
          </span>
        )}
      </div>
      {currentCPR !== null && (
        <div className="mt-4">
          <p className="text-xs text-text-muted">CPR Score</p>
          <p className="text-2xl font-bold text-navy">
            {(currentCPR * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </Card>
  );
}
