'use client'

import { Card, CardContent } from '@/components/ui/card'

interface DimensionValues {
  cognitive_load_index: number
  circadian_disruption: number
  movement_entropy: number
  speech_degradation: number
  identity_coherence: number
}

interface RadarChartProps {
  current: DimensionValues
  baseline: DimensionValues | null
}

const DIMENSIONS: { key: keyof DimensionValues; label: string; shortLabel: string }[] = [
  { key: 'cognitive_load_index', label: 'Cognitive Load', shortLabel: 'Cog Load' },
  { key: 'circadian_disruption', label: 'Circadian Disruption', shortLabel: 'Circadian' },
  { key: 'movement_entropy', label: 'Movement Entropy', shortLabel: 'Movement' },
  { key: 'speech_degradation', label: 'Speech Degradation', shortLabel: 'Speech' },
  { key: 'identity_coherence', label: 'Identity Coherence', shortLabel: 'Identity' },
]

const SIZE = 300
const CX = SIZE / 2
const CY = SIZE / 2
const RADIUS = 110
const LABEL_RADIUS = RADIUS + 24
const LEVELS = [0.25, 0.50, 0.75, 1.0]
const ANGLE_OFFSET = -Math.PI / 2

function getVertex(index: number, value: number, radius: number): [number, number] {
  const angle = ANGLE_OFFSET + (2 * Math.PI * index) / 5
  return [
    CX + radius * value * Math.cos(angle),
    CY + radius * value * Math.sin(angle),
  ]
}

function polygonPoints(values: number[], radius: number): string {
  return values
    .map((v, i) => getVertex(i, v, radius))
    .map(([x, y]) => `${x},${y}`)
    .join(' ')
}

export function RadarChart({ current, baseline }: RadarChartProps) {
  const currentValues = DIMENSIONS.map((d) => current[d.key])
  const baselineValues = baseline
    ? DIMENSIONS.map((d) => baseline[d.key])
    : null

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]/50">
          CPR Dimensions
        </h3>
        <div className="flex justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            preserveAspectRatio="xMidYMid meet"
            className="max-h-[280px]"
          >
            {LEVELS.map((level) => (
              <polygon
                key={level}
                points={polygonPoints(
                  Array.from({ length: 5 }, () => level),
                  RADIUS
                )}
                fill="none"
                stroke="#1B2A4A"
                strokeOpacity={level === 0.5 ? 0.15 : 0.07}
                strokeWidth={level === 0.5 ? 1 : 0.5}
              />
            ))}

            {DIMENSIONS.map((_, i) => {
              const [x, y] = getVertex(i, 1, RADIUS)
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  stroke="#1B2A4A"
                  strokeOpacity={0.1}
                  strokeWidth={0.5}
                />
              )
            })}

            {baselineValues && (
              <polygon
                points={polygonPoints(baselineValues, RADIUS)}
                fill="#1B2A4A"
                fillOpacity={0.06}
                stroke="#1B2A4A"
                strokeOpacity={0.25}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            )}

            <polygon
              points={polygonPoints(currentValues, RADIUS)}
              fill="#C9A84C"
              fillOpacity={0.15}
              stroke="#C9A84C"
              strokeWidth={2}
              strokeLinejoin="round"
            />

            {currentValues.map((v, i) => {
              const [x, y] = getVertex(i, v, RADIUS)
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3.5}
                  fill="#C9A84C"
                  stroke="white"
                  strokeWidth={1.5}
                />
              )
            })}

            {DIMENSIONS.map((dim, i) => {
              const [x, y] = getVertex(i, 1, LABEL_RADIUS)
              const textAnchor =
                Math.abs(x - CX) < 5
                  ? 'middle'
                  : x < CX
                    ? 'end'
                    : 'start'
              const dy = y < CY ? -2 : y > CY + 5 ? 12 : 4

              return (
                <g key={dim.key}>
                  <text
                    x={x}
                    y={y + dy}
                    textAnchor={textAnchor}
                    className="text-[10px] font-medium"
                    fill="#1B2A4A"
                    fillOpacity={0.5}
                  >
                    {dim.shortLabel}
                  </text>
                  <text
                    x={x}
                    y={y + dy + 11}
                    textAnchor={textAnchor}
                    className="text-[10px] font-bold tabular-nums"
                    fill="#1B2A4A"
                    fillOpacity={0.7}
                  >
                    {(currentValues[i]! * 100).toFixed(0)}%
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="mt-2 flex justify-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-sm bg-[#C9A84C]" />
            <span className="text-[10px] font-medium text-[#1B2A4A]/50">Current</span>
          </div>
          {baseline && (
            <div className="flex items-center gap-1.5">
              <span className="block h-2.5 w-2.5 rounded-sm border border-dashed border-[#1B2A4A]/30 bg-[#1B2A4A]/5" />
              <span className="text-[10px] font-medium text-[#1B2A4A]/50">Baseline</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
