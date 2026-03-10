'use client'

import { Bell, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/stores/user-store'
import { useHealthStore } from '@/stores/health-store'
import { getGreeting } from '@/lib/utils'
import Link from 'next/link'

export function TopNav() {
  const { profile } = useUserStore()
  const { insights } = useHealthStore()
  const unreadCount = insights.filter((i) => !i.is_read).length
  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1B2A4A]/80 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          {profile && (
            <h1 className="text-base font-semibold text-[#1B2A4A] dark:text-white">
              {getGreeting(profile.full_name)}
            </h1>
          )}
          <p className="text-xs text-gray-500 dark:text-white/50">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/insights">
              <Bell className="w-5 h-5 text-[#1B2A4A] dark:text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#F5C842] text-[#1B2A4A] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Avatar */}
          <Link href="/profile">
            <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-[#F5C842]">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
