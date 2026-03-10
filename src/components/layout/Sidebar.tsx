'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Moon,
  Activity,
  Brain,
  MessageCircle,
  Users,
  BookOpen,
  BarChart3,
  User,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/user-store'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sleep', label: 'Sleep', icon: Moon },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/stress', label: 'Stress', icon: Brain },
  { href: '/coach', label: 'AI Coach', icon: MessageCircle },
  { href: '/couples', label: 'Couples', icon: Users },
  { href: '/programs', label: 'Programs', icon: BookOpen },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
]

const bottomItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useUserStore()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#1B2A4A] text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F5C842] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#1B2A4A]" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">ET AI ONE</p>
            <p className="text-xs text-white/50 mt-0.5">Health Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
              {label === 'Couples' && (
                <span className="ml-auto text-xs bg-[#F5C842] text-[#1B2A4A] px-1.5 py-0.5 rounded-full font-bold">
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        {bottomItems.map(({ href, label, icon: Icon }) => (
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

        {profile && (
          <div className="pt-3 mt-2 border-t border-white/10">
            <p className="text-xs text-white/40 px-3 truncate">{profile.full_name}</p>
            <p className="text-xs text-[#F5C842] px-3 capitalize">{profile.subscription_tier}</p>
          </div>
        )}
      </div>
    </aside>
  )
}
