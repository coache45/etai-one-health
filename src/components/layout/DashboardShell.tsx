'use client'

import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { MobileNav } from './MobileNav'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-y-auto">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
