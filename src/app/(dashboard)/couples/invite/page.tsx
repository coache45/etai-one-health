import { InvitePartner } from '@/components/couples/InvitePartner'

export default function CouplesInvitePage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Invite Your Partner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your health together and see your Couples Sync Score.
        </p>
      </div>
      <InvitePartner />
    </div>
  )
}
