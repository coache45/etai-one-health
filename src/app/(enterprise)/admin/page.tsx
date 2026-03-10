'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkforceScore } from '@/components/enterprise/WorkforceScore'
import { TeamHealth } from '@/components/enterprise/TeamHealth'
import { FatigueAlert } from '@/components/enterprise/FatigueAlert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkforceHealthScore } from '@/types/enterprise'

// Mock data — replace with real API calls
const mockScore: WorkforceHealthScore = {
  orgId: 'demo',
  overallScore: 72,
  sleepScore: 68,
  stressScore: 74,
  activityScore: 78,
  engagementRate: 84,
  atRiskPercentage: 12,
  teamBreakdown: [
    { team: 'Engineering', score: 75, memberCount: 24, riskLevel: 'low' },
    { team: 'Sales', score: 61, memberCount: 18, riskLevel: 'medium' },
    { team: 'Operations', score: 69, memberCount: 31, riskLevel: 'low' },
    { team: 'Night Shift', score: 44, memberCount: 12, riskLevel: 'high' },
    { team: 'Customer Success', score: 80, memberCount: 15, riskLevel: 'low' },
  ],
}

export default function EnterpriseAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">
            Workforce Wellness Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Anonymous aggregate data — no individual health data is exposed.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Workforce Score */}
      <div className="grid md:grid-cols-2 gap-5">
        <WorkforceScore score={mockScore} />
        <div className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Active Users', value: '84%', sub: 'of workforce enrolled' },
                  { label: 'At Risk', value: `${mockScore.atRiskPercentage}%`, sub: 'need attention' },
                  { label: 'Programs Active', value: '247', sub: 'enrollments this month' },
                  { label: 'Avg Session', value: '8m', sub: 'daily engagement' },
                ].map(({ label, value, sub }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-[#1B2A4A] dark:text-white">{value}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fatigue Alerts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          Fatigue Signals
        </h2>
        <div className="space-y-3">
          <FatigueAlert
            department="Night Shift"
            affectedPercent={67}
            message="Sleep scores have dropped 18 points over the last 14 days. Consider reviewing shift rotation patterns."
          />
          <FatigueAlert
            department="Sales"
            affectedPercent={28}
            message="Stress levels elevated ahead of Q4 close. Consider scheduling a team recovery day."
          />
        </div>
      </div>

      {/* Team Breakdown */}
      <TeamHealth teams={mockScore.teamBreakdown} />
    </div>
  )
}
