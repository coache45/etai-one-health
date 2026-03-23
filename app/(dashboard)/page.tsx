export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-text-muted">Unified Stress Model overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(['Acute Stress', 'Chronic Stress', 'Failure Probability', 'Recovery'] as const).map(
          (label) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <p className="text-sm font-medium text-text-muted">{label}</p>
              <p className="mt-2 text-3xl font-bold text-navy">--</p>
              <p className="mt-1 text-xs text-text-muted">
                Awaiting data connection
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
