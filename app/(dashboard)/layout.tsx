import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-surface p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-navy">ONE Health</h2>
          <p className="text-xs text-text-muted">Dashboard</p>
        </div>
        <nav className="flex flex-col gap-2">
          <a
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
          >
            Overview
          </a>
          <a
            href="/dashboard/stress"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted"
          >
            Stress Monitor
          </a>
          <a
            href="/dashboard/guardian"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted"
          >
            Guardian
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
