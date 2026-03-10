'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1B2A4A] dark:text-white mb-2">
          Something went sideways.
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          We had a hiccup. Your data is safe — just try again.
        </p>
        <Button variant="gold" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
