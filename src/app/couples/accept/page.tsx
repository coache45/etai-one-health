'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Heart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function acceptInvite() {
    if (!token) return
    setAccepting(true)

    try {
      const res = await fetch('/api/couples/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success("You are now connected! Let's build healthy together.")
      router.push('/couples')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to accept invite'
      setError(msg)
      toast.error(msg)
    } finally {
      setAccepting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid invite link.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-[#F5C842]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-[#F5C842]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-[#F5C842]" />
          <span className="font-bold text-[#1B2A4A] dark:text-white">ET AI ONE</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white mb-2">
          You have been invited!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Your partner wants to track your health together. Accept to connect your dashboards
          and see your Couples Sync Score.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="space-y-3">
          <Button
            variant="gold"
            className="w-full"
            onClick={acceptInvite}
            disabled={accepting}
          >
            {accepting ? 'Connecting...' : 'Accept & Connect'}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={() => router.push('/dashboard')}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  )
}
