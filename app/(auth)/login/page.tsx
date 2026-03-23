export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">Sign In</h2>
      <p className="text-sm text-text-muted">
        Enter your credentials to access the platform.
      </p>
      {/* Login form will be implemented in dashboard MVP phase */}
      <div className="rounded-lg bg-surface-muted p-4 text-sm text-text-muted">
        Login form -- coming soon
      </div>
    </div>
  );
}
