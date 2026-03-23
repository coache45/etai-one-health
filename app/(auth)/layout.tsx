export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-navy">ONE Health</h1>
          <p className="text-sm text-text-muted">by ET AI</p>
        </div>
        {children}
      </div>
    </div>
  );
}
