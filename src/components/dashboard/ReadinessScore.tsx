'use client'

import { useEffect, useState } from 'react'
import { getScoreColor, getScoreLabel } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ReadinessScoreProps {
  score: number | null
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function ReadinessScore({ score, size = 'lg', isLoading = false }: ReadinessScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (score === null) return
    const timer = setTimeout(() => {
      let current = 0
      const increment = score / 60
      const interval = setInterval(() => {
        current += increment
        if (current >= score) {
          setAnimatedScore(score)
          clearInterval(interval)
        } else {
          setAnimatedScore(Math.floor(current))
        }
      }, 16)
      return () => clearInterval(interval)
    }, 200)
    return () => clearTimeout(timer)
  }, [score])

  const dimensions = {
    sm: { size: 80, stroke: 6, textSize: 'text-lg', labelSize: 'text-xs' },
    md: { size: 120, stroke: 8, textSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { size: 180, stroke: 10, textSize: 'text-4xl', labelSize: 'text-sm' },
  }[size]

  const r = (dimensions.size - dimensions.stroke * 2) / 2
  const circumference = 2 * Math.PI * r
  const displayed = score ?? 0
  const offset = circumference - (animatedScore / 100) * circumference
  const color = getScoreColor(displayed)
  const label = getScoreLabel(displayed)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton
          className="rounded-full"
          style={{ width: dimensions.size, height: dimensions.size }}
        />
      </div>
    )
  }

  if (score === null) {
    return (
      <div
        className="flex items-center justify-center rounded-full border-4 border-gray-100 dark:border-gray-800"
        style={{ width: dimensions.size, height: dimensions.size }}
      >
        <div className="text-center">
          <p className="text-gray-400 text-xs">No data</p>
          <p className="text-gray-300 text-[10px]">Log today</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={dimensions.size}
        height={dimensions.size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={dimensions.stroke}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* Animated progress circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={dimensions.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-[1200ms] ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className={`font-bold leading-none ${dimensions.textSize}`}
          style={{ color }}
        >
          {animatedScore}
        </span>
        <span className={`text-gray-500 dark:text-gray-400 font-medium mt-1 ${dimensions.labelSize}`}>
          {label}
        </span>
      </div>
    </div>
  )
}
