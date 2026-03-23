import type { AlertTier } from '@/types/guardian';

interface AlertBannerProps {
  tier: AlertTier;
  cprScore: number;
  actions: string[];
}

const tierConfig: Record<
  AlertTier,
  { bg: string; border: string; text: string; badge: string; label: string }
> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    badge: 'bg-blue-500 text-white',
    label: 'INFO',
  },
  caution: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-900',
    badge: 'bg-yellow-500 text-white',
    label: 'CAUTION',
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-900',
    badge: 'bg-orange-500 text-white',
    label: 'WARNING',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-900',
    badge: 'bg-red-600 text-white',
    label: 'CRITICAL',
  },
  emergency: {
    bg: 'bg-red-100',
    border: 'border-red-500',
    text: 'text-red-950',
    badge: 'bg-red-800 text-white',
    label: 'EMERGENCY',
  },
};

export function AlertBanner({ tier, cprScore, actions }: AlertBannerProps) {
  const config = tierConfig[tier];

  return (
    <div
      className={`rounded-xl border-2 ${config.border} ${config.bg} p-5`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {/* Pulse indicator */}
        <span className="relative flex h-3 w-3">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              tier === 'emergency' || tier === 'critical'
                ? 'bg-red-500'
                : tier === 'warning'
                  ? 'bg-orange-400'
                  : 'bg-yellow-400'
            }`}
          />
          <span
            className={`relative inline-flex h-3 w-3 rounded-full ${
              tier === 'emergency' || tier === 'critical'
                ? 'bg-red-600'
                : tier === 'warning'
                  ? 'bg-orange-500'
                  : 'bg-yellow-500'
            }`}
          />
        </span>

        <span
          className={`rounded-md px-2.5 py-1 text-xs font-bold tracking-wider ${config.badge}`}
        >
          {config.label}
        </span>

        <span className={`text-sm font-semibold ${config.text}`}>
          CPR Score: {(cprScore * 100).toFixed(1)}%
        </span>
      </div>

      {actions.length > 0 && (
        <div className="mt-3 ml-6">
          <p className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${config.text} opacity-60`}>
            Recommended Actions
          </p>
          <ul className="space-y-1">
            {actions.map((action, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-sm ${config.text}`}
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
