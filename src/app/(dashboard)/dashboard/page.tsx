import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getTimeOfDayGreeting,
  fetchUserProfile,
  fetchPartnerName,
  fetchPromptOfTheDay,
  fetchProgressStats,
  fetchRecentPosts,
  fetchPartnerActivity,
  fetchGuardianStatus,
} from '@/lib/launchpad/queries'
import { GreetingHero } from '@/components/launchpad/greeting-hero'
import { PromptOfTheDay } from '@/components/launchpad/prompt-of-the-day'
import { QuickStartTiles } from '@/components/launchpad/quick-start-tiles'
import { ProgressSummary } from '@/components/launchpad/progress-summary'
import { CommunityPulse } from '@/components/launchpad/community-pulse'
import { GuardianStatus } from '@/components/launchpad/guardian-status'
import { PartnerActivity } from '@/components/launchpad/partner-activity'

export default async function LaunchpadPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all data in parallel — zero loading spinners
  const [
    profile,
    partnerName,
    promptOfTheDay,
    progressStats,
    recentPosts,
    partnerActivity,
    guardianStatus,
  ] = await Promise.all([
    fetchUserProfile(user.id),
    fetchPartnerName(user.id),
    fetchPromptOfTheDay(),
    fetchProgressStats(user.id),
    fetchRecentPosts(),
    fetchPartnerActivity(user.id),
    fetchGuardianStatus(user.id),
  ])

  const greeting = getTimeOfDayGreeting()
  const userName = profile?.display_name || profile?.full_name || 'there'

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting hero */}
        <GreetingHero
          greeting={greeting}
          userName={userName}
          partnerName={partnerName}
        />

        {/* Prompt of the Day */}
        <PromptOfTheDay prompt={promptOfTheDay} />

        {/* Quick start tiles */}
        <QuickStartTiles />

        {/* Progress summary */}
        <ProgressSummary stats={progressStats} />

        {/* Two-column layout for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Community pulse */}
            <CommunityPulse posts={recentPosts} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Guardian status */}
            <GuardianStatus status={guardianStatus} />

            {/* Partner activity */}
            <PartnerActivity data={partnerActivity} />
          </div>
        </div>

        {/* Footer tagline */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-slate-400">
            Bringing AI down to earth — one session at a time.
          </p>
        </div>
      </div>
    </div>
  )
}
