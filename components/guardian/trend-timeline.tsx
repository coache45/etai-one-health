'use client';

import { Card } from '@/components/ui/card';

interface DataPoint {
  recorded_at: string;
  cpr_score: number;
}

interface TrendTimelineProps {
  history: DataPoint[];
}

// Chart dimensions
const W = 800;
const H = 300;
const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const THRESHOLDS = [
  { value: 0.50, color: '#eab308', label: 'Info' },
  { value: 0.65, color: '#f97316', label: 'Caution' },
  { value: 0.80, color: '#ef4444', label: 'Warning' },
];

function scoreColor(score: number): string {
  if (score >= 0.80) return '#ef4444';
  if (score >= 0.65) return '#f97316';
  if (score >= 0.50) return '#eab308';
  return '#22c55e';
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function TrendTimeline({ history }: TrendTimelineProps) {
  if (history.length === 0) {
    return (
      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]/50">
          24-Hour Trend
        </h3>
        <p className="text-sm text-[#1B2A4A]/40">
          No cognitive data in the last 24 hours.
        </p>
      </Card>
    );
  }

  // Time range
  const timestamps = history.map((d) => new Date(d.recorded_at).getTime());
  const minT = Math.min(...timestamps);
  const maxT = Math.max(...timestamps);
  const timeSpan = maxT - minT || 1; // avoid division by zero

  // Map data to SVG coordinates
  const points = history.map((d) => {
    const t = new Date(d.recorded_at).getTime();
    const x = PAD.left + ((t - minT) / timeSpan) * PLOT_W;
    const y = PAD.top + (1 - d.cpr_score) * PLOT_H;
    return { x, y, score: d.cpr_score, time: d.recorded_at };
  });

  // Polyline path
  const linePath = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Gradient area path
  const areaPath = [
    `M ${points[0]!.x},${PAD.top + PLOT_H}`,
    ...points.map((p) => `L ${p.x},${p.y}`),
    `L ${points[points.length - 1]!.x},${PAD.top + PLOT_H}`,
    'Z',
  ].join(' ');

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.50, 0.75, 1.0];

  // X-axis: pick up to 6 evenly spaced time labels
  const xLabelCount = Math.min(history.length, 6);
  const xLabels: { x: number; label: string }[] = [];
  for (let i = 0; i < xLabelCount; i++) {
    const idx = Math.round((i / (xLabelCount - 1 || 1)) * (history.length - 1));
    const pt = points[idx]!;
    xLabels.push({ x: pt.x, label: formatTime(history[idx]!.recorded_at) });
  }

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]/50">
        24-Hour Trend
      </h3>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines */}
        {yTicks.map((tick) => {
          const y = PAD.top + (1 - tick) * PLOT_H;
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + PLOT_W}
                y2={y}
                stroke="#1B2A4A"
                strokeOpacity={0.06}
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y + 3.5}
                textAnchor="end"
                className="text-[10px]"
                fill="#1B2A4A"
                fillOpacity={0.35}
              >
                {(tick * 100).toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Threshold lines */}
        {THRESHOLDS.map(({ value, color, label }) => {
          const y = PAD.top + (1 - value) * PLOT_H;
          return (
            <g key={value}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + PLOT_W}
                y2={y}
                stroke={color}
                strokeWidth={1}
                strokeDasharray="6 4"
                strokeOpacity={0.5}
              />
              <text
                x={PAD.left + PLOT_W + 4}
                y={y + 3.5}
                className="text-[9px] font-medium"
                fill={color}
                fillOpacity={0.7}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <polyline
          points={linePath}
          fill="none"
          stroke="#C9A84C"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Outer glow for alert scores */}
            {p.score >= 0.50 && (
              <circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill={scoreColor(p.score)}
                fillOpacity={0.1}
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill={scoreColor(p.score)}
              stroke="white"
              strokeWidth={2}
            />
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((xl, i) => (
          <text
            key={i}
            x={xl.x}
            y={H - 8}
            textAnchor="middle"
            className="text-[10px]"
            fill="#1B2A4A"
            fillOpacity={0.35}
          >
            {xl.label}
          </text>
        ))}

        {/* Axis lines */}
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + PLOT_H}
          stroke="#1B2A4A"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          y1={PAD.top + PLOT_H}
          x2={PAD.left + PLOT_W}
          y2={PAD.top + PLOT_H}
          stroke="#1B2A4A"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      </svg>
    </Card>
  );
}
