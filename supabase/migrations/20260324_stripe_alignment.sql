-- ============================================================================
-- STRIPE + AUTH ALIGNMENT MIGRATION
-- ============================================================================
-- Purpose: Create tables required for auth, Stripe billing, and programs
-- in the NEW Supabase project (pvflufqfeaowzextilpl).
--
-- These tables existed in the OLD project but were never migrated:
--   - profiles (CRITICAL: auth trigger, Stripe fields, tier gating)
--   - programs (Stripe checkout redirects to /programs)
--   - user_programs (enrollment tracking)
--
-- Tables NOT included (not needed for current features):
--   - daily_health_logs, health_metrics_hourly (Ring One — future)
--   - couples, couples_shared_goals (replaced by partnerships table)
--   - ai_conversations, ai_messages, ai_insights (AI Coach — future)
--   - organizations, organization_members, wellness_challenges (Enterprise — future)
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- The foundation of everything. Referenced by:
--   - Stripe webhook (writes subscription_tier, stripe_customer_id)
--   - Stripe checkout (reads stripe_customer_id, email)
--   - Dashboard layout (reads full profile)
--   - AI Studio /api/generate (reads subscription_tier for tier gating)
--   - Launchpad queries (reads display_name, subscription_tier, avatar_url)
--   - Onboarding page (writes display_name, date_of_birth, gender)
--   - Partnership queries (references profiles.id)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  height_cm NUMERIC,
  weight_kg NUMERIC,
  timezone TEXT DEFAULT 'America/New_York',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'couples', 'enterprise', 'builder')),
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Stripe customer lookup
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Index for tier-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles (subscription_tier);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Auto-create profile when a user signs up via Supabase Auth
-- This fires on INSERT to auth.users (email/password OR OAuth)
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 2. PROGRAMS TABLE
-- ============================================================================
-- Stripe checkout success redirects to /programs?checkout=success
-- Programs page reads from this table
-- ============================================================================

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sleep', 'stress', 'energy', 'recovery', 'habit', 'shift_work', 'couples')),
  is_couples BOOLEAN DEFAULT false,
  tier_required TEXT DEFAULT 'pro' CHECK (tier_required IN ('free', 'pro', 'couples', 'enterprise', 'builder')),
  daily_actions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. USER_PROGRAMS TABLE
-- ============================================================================
-- Tracks user enrollment in programs
-- Note: couple_id references removed (old couples table doesn't exist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  current_day INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  daily_completions JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_user_programs_user ON user_programs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_programs_status ON user_programs (user_id, status);

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role needs to update profiles (Stripe webhook uses service client)
-- The service role key bypasses RLS, so no explicit policy needed for that.

-- Programs: anyone can read (public catalog)
CREATE POLICY "Anyone reads programs" ON programs
  FOR SELECT USING (true);

-- User Programs: users manage their own
CREATE POLICY "Users read own programs" ON user_programs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users write own programs" ON user_programs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own programs" ON user_programs
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 5. SEED PROGRAMS
-- ============================================================================
-- Same 6 programs from the original migration, inserted idempotently
-- ============================================================================

INSERT INTO programs (name, slug, description, duration_days, category, is_couples, tier_required, daily_actions) VALUES
('Sleep Reset', 'sleep-reset', 'Rebuild your sleep hygiene from scratch with progressive daily actions over 21 days.', 21, 'sleep', false, 'pro',
  '[{"day":1,"title":"Sleep Audit","description":"Log your current sleep pattern — bedtime, wake time, and how you feel. No changes yet. Just awareness.","action_type":"log"},{"day":2,"title":"Set Your Anchor","description":"Pick a consistent wake time for the next 20 days. Set it. Commit.","action_type":"task"},{"day":3,"title":"Screen Curfew","description":"No screens 30 minutes before bed tonight. Replace with reading, stretching, or conversation.","action_type":"task"},{"day":4,"title":"Caffeine Check","description":"No caffeine after 2 PM today. Log how your evening energy feels.","action_type":"log"},{"day":5,"title":"Cool Down","description":"Lower your bedroom temperature by 2-3 degrees tonight. Your body sleeps better cool.","action_type":"task"}]'
),
('Stress Mastery', 'stress-mastery', 'A 14-day HRV-based stress management program combining breathing, movement, and mindset.', 14, 'stress', false, 'pro',
  '[{"day":1,"title":"Stress Baseline","description":"Rate your stress 1-10 three times today: morning, midday, evening. Just observe.","action_type":"log"},{"day":2,"title":"Box Breathing","description":"Practice 4-4-4-4 box breathing for 5 minutes. Morning or evening — your choice.","action_type":"exercise"},{"day":3,"title":"Trigger Map","description":"Write down the top 3 things that elevated your stress today. Name them.","action_type":"log"}]'
),
('The 30-Day Couples Reset', 'couples-reset', 'A complete wellness reboot for couples — sleep, nutrition, movement, and stress management done together.', 30, 'couples', true, 'couples',
  '[{"day":1,"title":"Health Honest Hour","description":"Sit together for 30 minutes. Each share: What is one health habit you want to build? What is one you want to break?","action_type":"conversation"},{"day":2,"title":"Sleep Sync","description":"Go to bed at the same time tonight. Both of you. No exceptions.","action_type":"task"},{"day":3,"title":"Move Together","description":"Take a 20-minute walk together today. No phones. Just conversation and movement.","action_type":"exercise"}]'
),
('Shift Worker Wellness', 'shift-worker', 'Specialized ongoing wellness program for rotating shifts, night work, and irregular schedules.', 30, 'shift_work', false, 'pro',
  '[{"day":1,"title":"Shift Pattern Log","description":"Document your shift schedule for this week. Include start times, end times, and days off.","action_type":"log"},{"day":2,"title":"Anchor Sleep","description":"Identify your core 4-hour sleep window that stays consistent regardless of shift. This is your anchor.","action_type":"task"},{"day":3,"title":"Light Strategy","description":"On night shifts: bright light during first half, dim light during second half. Log when you do it.","action_type":"task"}]'
),
('Sync Up Challenge', 'sync-up', 'Align your sleep schedules, meal times, and activity patterns to improve your Couples Sync Score in 14 days.', 14, 'couples', true, 'couples',
  '[{"day":1,"title":"Sync Audit","description":"Compare your daily schedules side by side. Where do your routines overlap? Where do they diverge?","action_type":"conversation"},{"day":2,"title":"Shared Meal","description":"Eat at least one meal together today at a planned time. Both log what you eat.","action_type":"task"},{"day":3,"title":"Bedtime Pact","description":"Agree on a bedtime within 30 minutes of each other tonight. Both commit.","action_type":"task"}]'
),
('Energy Optimization', 'energy-optimization', 'A 30-day program optimizing nutrition timing, sleep, movement, and hydration for sustained energy.', 30, 'energy', false, 'pro',
  '[{"day":1,"title":"Energy Audit","description":"Rate your energy 1-10 every 2 hours today. Find your peak and your crash.","action_type":"log"},{"day":2,"title":"Hydration Baseline","description":"Drink 8 glasses of water today. Log each one. Most people are dehydrated without knowing it.","action_type":"log"},{"day":3,"title":"Morning Movement","description":"10 minutes of movement within 30 minutes of waking. Walk, stretch, bodyweight — anything.","action_type":"exercise"}]'
)
ON CONFLICT (slug) DO NOTHING;
