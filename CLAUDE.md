# ONE Health - CLAUDE.md
# Master Instruction File for AI-Assisted Development
# Last Updated: 2026-03-21 | Version: 0.2.0

## PROJECT IDENTITY
- **Name:** ONE Health (ET AI Health Platform)
- **Role:** Human biometric intelligence platform -- the "human side" of the Aethelgard Protocol
- **Parent:** ET AI, LLC (CEO: Ernest Owens)
- **Deployed:** Vercel (etai-one-health.vercel.app)
- **Vercel Project ID:** prj_c38vZFXLX6b5nlsFC9zTIGgNBh3y
- **Vercel Team ID:** team_OWn1AOVDxB6J0FXGg8oqPaLx

## TECH STACK (LOCKED)
| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16.x | App Router ONLY. No Pages Router. |
| Language | TypeScript | 5.x | Strict mode. No `any` types. |
| Database | Supabase | Latest | PostgreSQL with RLS enforced on ALL tables. |
| Auth | Supabase Auth | Latest | JWT-based. Row Level Security is mandatory. |
| Hosting | Vercel | Latest | Edge Functions for real-time endpoints. |
| Styling | Tailwind CSS | 4.x | Design system tokens in tailwind.config.ts |
| State | Zustand | Latest | No Redux. No Context API for global state. |
| Testing | Vitest + Playwright | Latest | Unit + E2E. Min 80% coverage on core modules. |

## CODING STANDARDS
1. **File naming:** kebab-case for files, PascalCase for components, camelCase for functions
2. **Imports:** Absolute imports using `@/` prefix. Group: external -> internal -> types -> styles
3. **Components:** Server Components by default. Only use `'use client'` when interactivity required.
4. **Error handling:** Every async operation wrapped in try/catch. Custom error classes in `lib/errors.ts`
5. **Database:** ALL queries go through Supabase client with RLS context. No raw SQL in components.
6. **Environment variables:** Prefixed `NEXT_PUBLIC_` for client, plain for server. Never hardcode secrets.
7. **API routes:** Use Route Handlers in `app/api/`. Always validate input with Zod schemas.

## DIRECTORY STRUCTURE (TARGET)
```
one-health-nextjs/
  app/
    (auth)/          # Auth pages (login, register, reset)
    (dashboard)/     # Protected dashboard routes
    api/
      health/        # Biometric data ingestion endpoints
      stress/        # Unified Stress Model API
      guardian/       # Guardian cognitive monitoring API
      webhooks/      # External webhook handlers
    layout.tsx
    page.tsx
  components/
    ui/              # Reusable UI primitives
    dashboard/       # Dashboard-specific components
    guardian/         # Guardian device interface components
  lib/
    supabase/
      client.ts      # Browser Supabase client
      server.ts      # Server Supabase client
      admin.ts       # Service role client (server only)
    stress/
      normalizer.ts  # Biometric-to-USM signal normalizer
      harmonic.ts    # HMHI calculation engine
      guardian-cpr.ts # Cognitive Pattern Recognition model
    errors.ts
    utils.ts
  types/
    database.ts      # Auto-generated Supabase types
    stress.ts        # Unified Stress Model types
    guardian.ts       # Guardian device types
  supabase/
    migrations/      # SQL migration files (sequential)
    seed.sql         # Development seed data
  CLAUDE.md          # THIS FILE
```

## UNIFIED STRESS MODEL (USM) -- CORE ARCHITECTURE

The USM is the foundational data model connecting ONE Health and AICI.
Every entity (human or machine) produces four normalized dimensions:

| Dimension | Range | Human Source | Machine Source |
|-----------|-------|-------------|---------------|
| stress_index_acute | 0.0-1.0 | HRV, cortisol proxy, skin conductance | Vibration spike, thermal surge, current draw |
| stress_index_chronic | 0.0-1.0 | 7-day HRV trend, sleep debt, recovery deficit | Cumulative wear index, MTBF degradation |
| failure_probability | 0.0-1.0 | Injury risk model, cognitive overload index | Weibull failure distribution |
| recovery_coefficient | 0.0-1.0 | Sleep quality, rest compliance, HRV rebound | Maintenance completion, cooldown compliance |

### TypeScript Interface
```typescript
// types/stress.ts
export interface UnifiedStressVector {
  entity_id: string;
  entity_type: 'human' | 'machine';
  timestamp: string; // ISO 8601
  stress_index_acute: number;    // 0.0 - 1.0
  stress_index_chronic: number;  // 0.0 - 1.0
  failure_probability: number;   // 0.0 - 1.0
  recovery_coefficient: number;  // 0.0 - 1.0
  source_signals: Record<string, number>; // Raw signal map
  confidence: number;            // Model confidence 0.0 - 1.0
}

export interface HarmonicIndex {
  pairing_id: string;
  human_id: string;
  machine_id: string;
  hmhi_score: number;          // 0.0 - 1.0 (1.0 = perfect harmony)
  risk_flag: 'green' | 'yellow' | 'red';
  recommendation: string;
  calculated_at: string;
}
```

## GUARDIAN DEVICE INTEGRATION -- COGNITIVE PATTERN RECOGNITION (CPR)

The Guardian is ET AI's dementia monitoring device (Phase 4 product).
It extends the USM with cognitive-specific degradation dimensions.

### Guardian-Specific Stress Dimensions
| Dimension | Range | Source Signals | Clinical Correlation |
|-----------|-------|---------------|---------------------|
| cognitive_load_index | 0.0-1.0 | HRV complexity loss, reaction time drift | Executive function decline |
| circadian_disruption | 0.0-1.0 | Sleep onset variance, wake pattern entropy | Sundowning predictor |
| movement_entropy | 0.0-1.0 | Gait variability, wandering pattern detection | Spatial disorientation |
| speech_degradation | 0.0-1.0 | Word frequency shift, pause pattern analysis | Aphasia onset detection |
| identity_coherence | 0.0-1.0 | Routine deviation, social recognition response | Self-awareness monitoring |

### Guardian Agent Capabilities
The Guardian AI agent operates as a persistent companion with these functions:
1. **Memory Prompts** -- Context-aware identity reinforcement ("Good morning Ernest. Today is Saturday. Tanja will visit at 2pm.")
2. **POA Tracking** -- Real-time GPS geofencing with Power of Attorney alerts
3. **Caretaker Bot** -- Conversational AI companion for emotional support and routine maintenance
4. **Medical Alert** -- Anomaly detection triggers emergency contacts and medical services
5. **Identity Shield** -- Maintains and reinforces patient identity through personalized memory loops

### Form Factors (Guardian Accessory Line)
- Wristband (primary) -- Full sensor suite
- Smart Ring -- HRV, temperature, SpO2
- Pin/Brooch -- Accelerometer, ambient audio, NFC identity
- Earring -- Head-movement accelerometry for gait analysis
- Pendant -- GPS, emergency button, ambient monitoring

All form factors feed into a single Cognitive Pattern Recognition model via BLE mesh.

## SECURITY RULES (NON-NEGOTIABLE)
1. **RLS on every table.** No exceptions. No service role bypass in client code.
2. **No PII in logs.** Patient data is HIPAA-protected. Log entity_ids, never names or SSNs.
3. **Guardian data is encrypted at rest AND in transit.** AES-256 minimum.
4. **API rate limiting** on all health data endpoints. 100 req/min per user.
5. **Audit trail** on all Guardian alert triggers. Every alert is logged with full context.

## DEPLOYMENT RULES
1. All changes go through `propose_diff` via the Aethelgard MCP server
2. No direct pushes to main branch
3. Preview deployments for all PRs
4. Production deployment requires CEO "LFG" authorization
5. Database migrations require manual review before execution

## LESSONS LEARNED
| Date | Issue | Root Cause | Rule Added |
|------|-------|------------|------------|
| 2026-03-21 | MCP propose_diff overwrites previous patches | Single staging file design | Apply each patch before staging next |
| 2026-03-21 | Unicode chars fail in MCP staging | Windows charmap codec limitation | ASCII only in all patch content |
