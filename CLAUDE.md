# ONE Health — Claude Code Project Instructions

## Project
- **Name**: ET AI ONE Health
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe
- **Repo**: github.com/coache45/etai-one-health
- **Source dir**: `src/` (all app code lives under `src/`, path alias `@/*` → `./src/*`)
- **Production**: etai-one-health.vercel.app (main branch)
- **Brand**: Navy #1B2A4A, Gold #C9A84C

## Branch Protocol
- **main** = production. Live app with Stripe billing and real users. NEVER force push.
- Feature branches merge into main via PR only.
- Always create branches from `origin/main` (not from other feature branches).

## Pre-Merge Verification Protocol (MANDATORY)

After EVERY push to a feature branch, execute this sequence BEFORE telling Ernest to create a PR or merge:

### 1. Verify commits exist on remote
```bash
git log origin/<branch> --oneline -3
git diff --stat HEAD~1
```
If `git diff --stat HEAD~1` shows 0 files, the code was never committed. Rebuild.

### 2. Check Vercel build status
Use the Vercel MCP tools to confirm the preview deployment state is `READY`, not `ERROR`.
If `ERROR`, pull the build logs and fix before proceeding.

### 3. Ghost Commit Rule
After any multi-step build session, always verify work exists:
```bash
git status && git log --oneline -5 && git diff --stat HEAD~1
```
Run this BEFORE reporting completion to Ernest.

### 4. If "nothing to compare" or build failure is reported
FIRST action: `git log --all --oneline -20` to find where the code actually is.
Do NOT blame external systems. Diagnose and fix.

### 5. Never say "ready to merge" until
- Vercel preview build is confirmed `READY`
- `git diff --stat` shows actual file changes
- Commits are confirmed on the remote branch

## Route Conventions
- `src/app/(dashboard)/` — auth-protected pages (route group, no URL segment)
- `src/app/guides/` — public pages (no auth required, added to middleware publicPaths)
- Do NOT create pages in `(dashboard)` that conflict with root-level routes (e.g., `/(dashboard)/guides` and `/guides` both resolve to `/guides`)

## Key Files
- `src/components/layout/Sidebar.tsx` — main navigation (add new nav items here)
- `middleware.ts` — auth redirects and public path allowlist
- `next.config.js` — has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`
- `src/lib/supabase/admin.ts` — service-role client for Guardian/USM operations
