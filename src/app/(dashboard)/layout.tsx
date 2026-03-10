'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/stores/user-store'
import { useHealthData } from '@/hooks/useHealthData'
import { DashboardShell } from '@/components/layout/DashboardShell'
import type { Profile } from '@/types/database'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { setProfile, setLoading } = useUserStore()
  const { profile } = useUserStore()

  useHealthData(profile?.id)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data as Profile)
        if (!data.onboarding_completed) {
          router.push('/onboarding')
        }
      } else {
        setLoading(false)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, setProfile, setLoading])

  return <DashboardShell>{children}</DashboardShell>
}
