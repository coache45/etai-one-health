'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface CPRScoreGaugeProps {
  score: number
  confidence: number
}

function getScoreColor(score: number): string {
  if (score >= 0.80) return '#ef4444'
  if (score >= 0.65) return '#f97316'
  if (score >= 0.50) return '#eab308'
  return '#22c55e'
}

function getScoreLabel(score: number): string {
  if (score >= 0.90) return 'EMERGENCY'
  if (score >= 0.85) return 'CRITICAL'
  if (score >= 0.80) return 'WARNING'
  if (score >= 0.65) return 'CAUTION'
  if (score >= 0.50) return 'INFO'
  return 'NORMAL'
}

export function CPRScoreGauge({ score, confidence }: CPRScoreGaugeProps) {
  const [animatedOffset, setAnimatedOffset] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  const size = 200
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const arcFraction = 0.75
  const arcLength = circumference * arcFraction
  const scoreOffset = arcLength * (1 - score)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setAnimatedOffset(scoreOffset)
    }, 100)
    return () => clearTimeout(timer)
  }, [scoreOffset])

  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const rotation = 135

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]/50">
          CPR Score
        </h3>
        <div className="flex justify-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="overflow-visible"
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1B2A4A"
                strokeOpacity={0.08}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              />

              {[0.50, 0.65, 0.80].map((threshold) => {
                const angle = rotation + (threshold * arcFraction * 360)
                const rad = (angle * Math.PI) / 180
                const markerR = radius
                const cx = size / 2 + markerR * Math.cos(rad)
                const cy = size / 2 + markerR * Math.sin(rad)
                return (
                  <circle
                    key={threshold}
                    cx={cx}
                    cy={cy}
                    r={2}
                    fill="#1B2A4A"
                    opacity={0.15}
                  />
                )
              })}

              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                strokeDashoffset={mounted ? animatedOffset : arcLength}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                style={{
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `drop-shadow(0 0 6px ${color}40)`,
                }}
              />

              {score >= 0.65 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeOpacity={0.2}
                  strokeWidth={strokeWidth + 8}
                  strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                  strokeDashoffset={mounted ? animatedOffset : arcLength}
                  strokeLinecap="round"
                  transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                  style={{
                    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-4xl font-black tabular-nums"
                style={{ color }}
              >
                {(score * 100).toFixed(0)}
              </span>
              <span
                className="text-xs font-bold tracking-widest"
                style={{ color }}
              >
                {label}
              </span>
              <span className="mt-1 text-[10px] text-[#1B2A4A]/40">
                {(confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
