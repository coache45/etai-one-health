/**
 * Shared alert escalation constants for the Guardian CPR pipeline.
 * Used by both the /api/guardian/alert route and the dashboard UI.
 */
import type { AlertTier } from '@/types/guardian'
import type { CareNetworkRole } from '@/types/usm-database'

// Escalation matrix: which care network roles get notified at each tier
export const ESCALATION_MATRIX: Record<AlertTier, CareNetworkRole[]> = {
  info: ['primary_caregiver'],
  caution: ['primary_caregiver', 'secondary_caregiver', 'poa'],
  warning: ['primary_caregiver', 'secondary_caregiver', 'poa', 'medical'],
  critical: ['primary_caregiver', 'secondary_caregiver', 'poa', 'medical', 'emergency'],
  emergency: ['primary_caregiver', 'secondary_caregiver', 'poa', 'medical', 'emergency'],
}

// Recommended actions per alert tier
export const RECOMMENDED_ACTIONS: Record<AlertTier, string[]> = {
  info: [
    'Log observation in patient record',
    'Schedule follow-up check within 24 hours',
  ],
  caution: [
    'Notify primary caregiver via push notification',
    'Increase monitoring frequency to every 30 minutes',
    'Review recent memory prompt effectiveness',
  ],
  warning: [
    'Notify caregiver and POA via push + SMS',
    'Activate continuous monitoring mode',
    'Prepare identity reinforcement prompts',
    'Review medication compliance',
  ],
  critical: [
    'Notify all care network via push + SMS + call',
    'Activate geofence monitoring if not already active',
    'Prepare emergency contact information',
    'Begin 5-minute check-in cycle',
  ],
  emergency: [
    'Notify all care network immediately via all channels',
    'Contact emergency services (911) if SOS triggered',
    'Activate full location tracking',
    'Dispatch nearest care network member',
    'Record all sensor data for medical review',
  ],
}
