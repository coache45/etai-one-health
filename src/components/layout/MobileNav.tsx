'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  BookOpen,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/coach', label: 'Coach', icon: MessageCircle },
  { href: '/couples', label: 'Couples', icon: Users },
  { href: '/programs', label: 'Programs', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1B2A4A] border-t border-gray-100 dark:border-white/10 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                active ? 'text-[#1B2A4A] dark:text-[#F5C842]' : 'text-gray-400'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'dark:text-[#F5C842]')} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
