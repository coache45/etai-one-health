'use client'

import { useState } from 'react'
import { Shield, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCouplesStore } from '@/stores/couples-store'
import { useUserStore } from '@/stores/user-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { SharingPreferences } from '@/types/couples'

const shareableMetrics: { key: keyof SharingPreferences; label: string; description: string }[] = [
  { key: 'sleep', label: 'Sleep Data', description: 'Hours, quality, and schedule' },
  { key: 'stress', label: 'Stress Level', description: 'Your daily stress rating' },
  { key: 'activity', label: 'Activity', description: 'Steps and active minutes' },
  { key: 'mood', label: 'Mood', description: 'Your daily mood rating' },
  { key: 'heart_rate', label: 'Heart Rate', description: 'Resting heart rate and HRV' },
]

export default function CouplesSettingsPage() {
  const { profile } = useUserStore()
  const { couplesData } = useCouplesStore()
  const [saving, setSaving] = useState(false)

  const isPartnerA = couplesData?.couple.partner_a_id === profile?.id
  const currentSharing = isPartnerA
    ? couplesData?.couple.partner_a_shares
    : couplesData?.couple.partner_b_shares

  const [sharing, setSharing] = useState<SharingPreferences>(
    currentSharing ?? {
      sleep: true,
      stress: true,
      activity: true,
      heart_rate: false,
      mood: true,
    }
  )

  function toggle(key: keyof SharingPreferences) {
    setSharing((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function save() {
    if (!couplesData || !profile) return
    setSaving(true)
    const supabase = createClient()
    const field = isPartnerA ? 'partner_a_shares' : 'partner_b_shares'

    try {
      const { error } = await supabase
        .from('couples')
        .update({ [field]: sharing })
        .eq('id', couplesData.couple.id)

      if (error) throw error
      toast.success('Privacy settings saved.')
    } catch {
      toast.error('Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#1B2A4A] dark:text-white" />
        <div>
          <h1 className="text-xl font-bold text-[#1B2A4A] dark:text-white">Privacy Controls</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose what your partner can see
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Data You Share</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {shareableMetrics.map((metric) => (
            <div key={metric.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-[#1B2A4A] dark:text-white">{metric.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
              </div>
              <button
                onClick={() => toggle(metric.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sharing[metric.key] ? 'bg-[#F5C842]' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sharing[metric.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="gold" className="w-full gap-2" onClick={save} disabled={saving}>
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}
