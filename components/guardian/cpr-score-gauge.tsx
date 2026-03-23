'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface CPRScoreGaugeProps {
  score: number;
  confidence: number;
}

function getScoreColor(score: number): string {
  if (score >= 0.80) return '#ef4444'; // red-500
  if (score >= 0.65) return '#f97316'; // orange-500
  if (score >= 0.50) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

function getScoreLabel(score: number): string {
  if (score >= 0.90) return 'EMERGENCY';
  if (score >= 0.85) return 'CRITICAL';
  if (score >= 0.80) return 'WARNING';
  if (score >= 0.65) return 'CAUTION';
  if (score >= 0.50) return 'INFO';
  return 'NORMAL';
}

export function CPRScoreGauge({ score, confidence }: CPRScoreGaugeProps) {
  const [animatedOffset, setAnimatedOffset] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Circle geometry
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Score maps to percentage of the circle (270 degrees, leaving a gap at the bottom)
  const arcFraction = 0.75; // 270 degrees out of 360
  const arcLength = circumference * arcFraction;
  const scoreOffset = arcLength * (1 - score);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setMounted(true);
      setAnimatedOffset(scoreOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [scoreOffset]);

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // Rotation to center the gap at the bottom
  // 270-degree arc starting from 135 degrees (bottom-left)
  const rotation = 135;

  return (
    <Card>
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
            {/* Background track */}
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

            {/* Threshold markers */}
            {[0.50, 0.65, 0.80].map((threshold) => {
              const angle =
                rotation + (threshold * arcFraction * 360);
              const rad = (angle * Math.PI) / 180;
              const markerR = radius;
              const cx = size / 2 + markerR * Math.cos(rad);
              const cy = size / 2 + markerR * Math.sin(rad);
              return (
                <circle
                  key={threshold}
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill="#1B2A4A"
                  opacity={0.15}
                />
              );
            })}

            {/* Score arc */}
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

            {/* Glow effect for high scores */}
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

          {/* Center text */}
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
    </Card>
  );
}
