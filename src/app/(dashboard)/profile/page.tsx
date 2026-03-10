'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/stores/user-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, updateProfile } = useUserStore()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  async function saveProfile() {
    if (!profile?.id) return
    setSaving(true)
    const supabase = createClient()

    try {
      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', profile.id)
      updateProfile({ display_name: displayName })
      toast.success('Profile updated.')
    } catch {
      toast.error('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const tierBadges = {
    free: 'outline' as const,
    pro: 'gold' as const,
    couples: 'success' as const,
    enterprise: 'default' as const,
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">Profile</h1>
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <Avatar className="w-16 h-16 text-xl">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-lg text-[#1B2A4A] dark:text-white">{profile?.full_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
          <Badge
            variant={tierBadges[profile?.subscription_tier ?? 'free']}
            className="mt-1 capitalize"
          >
            {profile?.subscription_tier ?? 'free'} plan
          </Badge>
        </div>
      </div>

      {/* Edit Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div>
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should your coach address you?"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile?.email ?? ''} readOnly className="mt-1 bg-gray-50 dark:bg-gray-900" />
          </div>
          <Button
            variant="gold"
            className="w-full gap-2"
            onClick={saveProfile}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      {profile?.subscription_tier === 'free' && (
        <Card className="bg-[#1B2A4A] text-white border-0">
          <CardContent className="p-5">
            <p className="font-bold mb-1">Upgrade to Pro</p>
            <p className="text-sm text-white/70 mb-3">
              Unlock unlimited AI coaching, all programs, and advanced insights for $19/month.
            </p>
            <Button variant="gold" className="w-full">
              View Plans
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sign Out */}
      <Button
        variant="outline"
        className="w-full gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
        onClick={signOut}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  )
}
