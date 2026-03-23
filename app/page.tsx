export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-bold tracking-tight text-navy">
            ONE Health
          </h1>
          <p className="text-lg text-gold font-medium">
            by ET AI
          </p>
        </div>

        <p className="max-w-md text-text-muted text-lg leading-relaxed">
          Human biometric intelligence platform.
          Intelligence you can wear. Everywhere. Always.
        </p>

        <div className="flex gap-4">
          <a
            href="/login"
            className="px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-6 py-3 border border-gold text-gold rounded-lg font-medium hover:bg-gold/10 transition-colors"
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
