'use client'

import { useState } from 'react'
import { Users, Copy, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function InvitePartner() {
  const [inviteLink, setInviteLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')

  async function generateInvite() {
    setLoading(true)
    try {
      const res = await fetch('/api/couples/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.inviteUrl) {
        setInviteLink(data.inviteUrl)
      } else {
        toast.error('Could not generate invite link.')
      }
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Invite link copied!')
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-[#1B2A4A]/10 dark:bg-[#F5C842]/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-[#1B2A4A] dark:text-[#F5C842]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1B2A4A] dark:text-white mb-1">
              Connect with your partner
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              The Couples dashboard is ET AI's #1 feature. Track your health together,
              see your Sync Score, and grow as a unit.
            </p>
          </div>

          {!inviteLink ? (
            <div className="w-full max-w-sm space-y-3">
              <div>
                <Label htmlFor="partner-email" className="text-left block mb-1">
                  Partner's email (optional)
                </Label>
                <Input
                  id="partner-email"
                  type="email"
                  placeholder="partner@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                variant="gold"
                onClick={generateInvite}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Invite Link'}
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-3">
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly className="text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Share this link with your partner. The invite expires in 7 days.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
