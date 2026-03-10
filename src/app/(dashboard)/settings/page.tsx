'use client'

import { useState } from 'react'
import { Bell, Shield, Smartphone, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ToggleRowProps {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-[#1B2A4A] dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-[#F5C842]' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    insightAlerts: true,
    couplesUpdates: true,
    programReminders: true,
    weeklyReport: false,
  })

  const [privacy, setPrivacy] = useState({
    showInLeaderboards: false,
    anonymousDataSharing: true,
  })

  function saveSettings() {
    toast.success('Settings saved.')
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Settings</h1>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-0.5">
          <ToggleRow
            label="Daily Check-In Reminder"
            description="Nudge to log your health each morning"
            value={notifications.dailyReminder}
            onChange={(v) => setNotifications((p) => ({ ...p, dailyReminder: v }))}
          />
          <ToggleRow
            label="Insight Alerts"
            description="Get notified when your AI coach flags something important"
            value={notifications.insightAlerts}
            onChange={(v) => setNotifications((p) => ({ ...p, insightAlerts: v }))}
          />
          <ToggleRow
            label="Couples Updates"
            description="When your partner logs their data"
            value={notifications.couplesUpdates}
            onChange={(v) => setNotifications((p) => ({ ...p, couplesUpdates: v }))}
          />
          <ToggleRow
            label="Program Reminders"
            description="Daily action reminders for active programs"
            value={notifications.programReminders}
            onChange={(v) => setNotifications((p) => ({ ...p, programReminders: v }))}
          />
          <ToggleRow
            label="Weekly Report"
            description="Your 7-day summary every Sunday"
            value={notifications.weeklyReport}
            onChange={(v) => setNotifications((p) => ({ ...p, weeklyReport: v }))}
          />
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-0.5">
          <ToggleRow
            label="Show in Enterprise Leaderboards"
            description="Allow your anonymized score to appear in team rankings"
            value={privacy.showInLeaderboards}
            onChange={(v) => setPrivacy((p) => ({ ...p, showInLeaderboards: v }))}
          />
          <ToggleRow
            label="Anonymous Research Data"
            description="Help improve ET AI by sharing anonymized usage data"
            value={privacy.anonymousDataSharing}
            onChange={(v) => setPrivacy((p) => ({ ...p, anonymousDataSharing: v }))}
          />
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Connected Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Apple Health, Google Health, and Ring One integrations coming soon.
          </p>
        </CardContent>
      </Card>

      <Button variant="gold" className="w-full gap-2" onClick={saveSettings}>
        <Save className="w-4 h-4" />
        Save Settings
      </Button>
    </div>
  )
}
