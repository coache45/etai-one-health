'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, LayoutDashboard, Users, BarChart3, Trophy, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const enterpriseNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
]

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      setChecking(false)
    })
  }, [router])

  if (checking) return null

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-gray-950">
      {/* Enterprise Sidebar */}
      <aside className="w-64 min-h-screen bg-[#1B2A4A] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F5C842] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#1B2A4A]" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">ET AI ONE</p>
              <p className="text-xs text-white/50 mt-0.5">Enterprise</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {enterpriseNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white text-sm">
            ← Personal Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
