import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          30-day workforce wellness trends.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Program Completions', value: '68%', delta: '+12%' },
          { label: 'Avg Readiness Score', value: '72', delta: '+5pts' },
          { label: 'Daily Active Users', value: '84%', delta: '+3%' },
        ].map(({ label, value, delta }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-[#1B2A4A] dark:text-white">{value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{label}</p>
              <p className="text-xs text-green-500 font-medium mt-1">{delta} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">30-Day Wellness Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart logs={[]} />
        </CardContent>
      </Card>
    </div>
  )
}
