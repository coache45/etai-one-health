import {
  fetchPatientWithEntity,
  fetchLatestCognitiveVector,
  fetchCognitiveHistory,
  fetchRecentMemoryPrompts,
} from '@/lib/guardian/queries'
import { getAlertTier } from '@/types/guardian'
import { RECOMMENDED_ACTIONS } from '@/lib/guardian/alert-actions'
import { PatientHeader } from '@/components/guardian/patient-header'
import { CPRScoreGauge } from '@/components/guardian/cpr-score-gauge'
import { RadarChart } from '@/components/guardian/radar-chart'
import { TrendTimeline } from '@/components/guardian/trend-timeline'
import { AlertBanner } from '@/components/guardian/alert-banner'
import { MemoryPromptsList } from '@/components/guardian/memory-prompts-list'

// Hardcoded for now -- will be dynamic via route params or patient selector
const PATIENT_ID = 'af2d38d6-61a7-4e35-81cc-e11bf13b7578'

export default async function GuardianDashboardPage() {
  const [patient, latestVector, history, prompts] = await Promise.all([
    fetchPatientWithEntity(PATIENT_ID),
    fetchLatestCognitiveVector(PATIENT_ID),
    fetchCognitiveHistory(PATIENT_ID, 24),
    fetchRecentMemoryPrompts(PATIENT_ID, 5),
  ])

  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1B2A4A]">Patient Not Found</h2>
          <p className="mt-2 text-sm text-[#1B2A4A]/50">
            No patient record found for the configured ID.
          </p>
        </div>
      </div>
    )
  }

  const cprScore = latestVector?.cpr_score ?? 0
  const confidence = latestVector?.confidence ?? 0
  const alertTier = getAlertTier(cprScore)
  const actions = alertTier ? RECOMMENDED_ACTIONS[alertTier] : []

  const currentDimensions = latestVector
    ? {
        cognitive_load_index: latestVector.cognitive_load_index,
        circadian_disruption: latestVector.circadian_disruption,
        movement_entropy: latestVector.movement_entropy,
        speech_degradation: latestVector.speech_degradation,
        identity_coherence: latestVector.identity_coherence,
      }
    : {
        cognitive_load_index: 0,
        circadian_disruption: 0,
        movement_entropy: 0,
        speech_degradation: 0,
        identity_coherence: 0,
      }

  const baselineValue = patient.baselineCognitiveLoad
  const baselineDimensions = baselineValue !== null
    ? {
        cognitive_load_index: baselineValue,
        circadian_disruption: baselineValue * 0.9,
        movement_entropy: baselineValue * 0.7,
        speech_degradation: baselineValue * 0.8,
        identity_coherence: baselineValue * 0.75,
      }
    : null

  const timelineData = history.map((v) => ({
    recorded_at: v.recorded_at,
    cpr_score: v.cpr_score,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Guardian Monitor</h1>
        <p className="text-sm text-[#1B2A4A]/50">
          Cognitive Pattern Recognition Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PatientHeader
            displayName={patient.displayName}
            diagnosisType={patient.diagnosisType}
            diagnosisStage={patient.diagnosisStage}
            activeDeviceCount={patient.activeDeviceCount}
            emergencyPhone={patient.emergencyContactPhone}
          />
        </div>
        <div className="lg:col-span-1">
          <CPRScoreGauge score={cprScore} confidence={confidence} />
        </div>
      </div>

      {alertTier && (
        <AlertBanner tier={alertTier} cprScore={cprScore} actions={actions} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RadarChart current={currentDimensions} baseline={baselineDimensions} />
        </div>
        <div className="lg:col-span-2">
          <TrendTimeline history={timelineData} />
        </div>
      </div>

      <MemoryPromptsList prompts={prompts} />

      <p className="text-right text-[10px] text-[#1B2A4A]/30">
        Last updated: {latestVector?.recorded_at
          ? new Date(latestVector.recorded_at).toLocaleString()
          : '--'}
      </p>
    </div>
  )
}
