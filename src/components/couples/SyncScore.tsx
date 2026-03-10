'use client'

import { useEffect, useState } from 'react'
import { getSyncScoreLabel } from '@/lib/health/sync-score'

interface SyncScoreProps {
  score: number
  size?: number
}

export function SyncScore({ score, size = 160 }: SyncScoreProps) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const interval = setInterval(() => {
        current += score / 60
        if (current >= score) {
          setAnimated(score)
          clearInterval(interval)
        } else {
          setAnimated(Math.floor(current))
        }
      }, 16)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  const r = size / 2 - 10
  const circumference = 2 * Math.PI * r
  const offset = circumference - (animated / 100) * circumference

  const color = score >= 70 ? '#22C55E' : score >= 45 ? '#F5C842' : '#EF4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-[1200ms] ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {animated}
          </span>
          <span className="text-xs text-gray-500 font-medium">Sync Score</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>
        {getSyncScoreLabel(score)}
      </p>
    </div>
  )
}
