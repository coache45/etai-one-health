import { Card, CardContent } from '@/components/ui/card'

interface PatientHeaderProps {
  displayName: string
  diagnosisType: string | null
  diagnosisStage: string | null
  activeDeviceCount: number
  emergencyPhone: string | null
}

const stageLabels: Record<string, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  mci: 'MCI',
}

const diagnosisLabels: Record<string, string> = {
  alzheimers: "Alzheimer's Disease",
  vascular: 'Vascular Dementia',
  lewy_body: 'Lewy Body Dementia',
  frontotemporal: 'Frontotemporal Dementia',
  mixed: 'Mixed Dementia',
}

export function PatientHeader({
  displayName,
  diagnosisType,
  diagnosisStage,
  activeDeviceCount,
  emergencyPhone,
}: PatientHeaderProps) {
  const diagLabel = diagnosisType
    ? diagnosisLabels[diagnosisType] ?? diagnosisType
    : 'Undiagnosed'
  const stageLabel = diagnosisStage
    ? stageLabels[diagnosisStage] ?? diagnosisStage
    : '--'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#1B2A4A]">{displayName}</h2>
            <p className="text-sm text-[#1B2A4A]/70">{diagLabel}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#1B2A4A]/5 px-3 py-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[#C9A84C]"
            >
              <circle cx="8" cy="8" r="3" fill="currentColor" />
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
            </svg>
            <span className="text-sm font-semibold text-[#1B2A4A]">
              {activeDeviceCount} {activeDeviceCount === 1 ? 'Device' : 'Devices'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-lg bg-[#1B2A4A]/5 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#1B2A4A]/50">
              Stage
            </p>
            <p className="text-sm font-semibold text-[#1B2A4A]">{stageLabel}</p>
          </div>
          {emergencyPhone && (
            <div className="rounded-lg bg-red-50 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-red-400">
                Emergency
              </p>
              <p className="text-sm font-semibold text-red-700">{emergencyPhone}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
