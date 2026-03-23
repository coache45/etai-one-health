-- Couples Mode: partnerships table with auto-link trigger

-- ============================================================
-- PARTNERSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id_2 uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'dissolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- A user can only be in ONE active partnership at a time
CREATE UNIQUE INDEX idx_partnerships_active_user1
  ON public.partnerships (user_id_1) WHERE status = 'active';
CREATE UNIQUE INDEX idx_partnerships_active_user2
  ON public.partnerships (user_id_2) WHERE status = 'active';

-- One pending invite per email per inviter
CREATE UNIQUE INDEX idx_partnerships_pending_email
  ON public.partnerships (user_id_1, invite_email) WHERE status = 'pending';

-- Fast lookups
CREATE INDEX idx_partnerships_user1 ON public.partnerships (user_id_1);
CREATE INDEX idx_partnerships_user2 ON public.partnerships (user_id_2);
CREATE INDEX idx_partnerships_invite_email ON public.partnerships (invite_email) WHERE status = 'pending';

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_partnerships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partnerships_updated_at
  BEFORE UPDATE ON public.partnerships
  FOR EACH ROW EXECUTE FUNCTION update_partnerships_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- Both partners can read their partnerships
CREATE POLICY "Users can read own partnerships"
  ON public.partnerships FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id_1
    OR auth.uid() = user_id_2
    OR (status = 'pending' AND invite_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ))
  );

-- Authenticated users can create invites (as user_id_1)
CREATE POLICY "Users can create partnership invites"
  ON public.partnerships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id_1);

-- Both partners can update (accept, dissolve)
CREATE POLICY "Partners can update partnership"
  ON public.partnerships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2)
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Only inviter can delete pending invites
CREATE POLICY "Inviter can delete pending invites"
  ON public.partnerships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id_1 AND status = 'pending');

-- ============================================================
-- AUTO-LINK: when a user signs up, check for pending invites
-- ============================================================
CREATE OR REPLACE FUNCTION public.auto_link_partner()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.partnerships
  SET user_id_2 = NEW.id, status = 'active', updated_at = now()
  WHERE invite_email = NEW.email AND status = 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created_link_partner
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_link_partner();

-- ============================================================
-- Add shared_with column to prompt_outputs for couples sessions
-- ============================================================
ALTER TABLE public.prompt_outputs
  ADD COLUMN IF NOT EXISTS shared_with uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.prompt_outputs
  ADD COLUMN IF NOT EXISTS comments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Partners can read outputs shared with them
CREATE POLICY "Users can read shared outputs"
  ON public.prompt_outputs FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_with);

-- ============================================================
-- Add created_by to goal_milestones to track who completed
-- ============================================================
ALTER TABLE public.goal_milestones
  ADD COLUMN IF NOT EXISTS completed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================================
-- Shared goals: add shared_with column
-- ============================================================
ALTER TABLE public.user_goals
  ADD COLUMN IF NOT EXISTS shared_with uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Partners can read and update shared goals
CREATE POLICY "Users can read shared goals"
  ON public.user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_with);

CREATE POLICY "Users can update shared goals"
  ON public.user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = shared_with)
  WITH CHECK (auth.uid() = shared_with);

-- Partners can manage milestones on shared goals
CREATE POLICY "Partners can read milestones on shared goals"
  ON public.goal_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND shared_with = auth.uid()
    )
  );

CREATE POLICY "Partners can insert milestones on shared goals"
  ON public.goal_milestones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND shared_with = auth.uid()
    )
  );

CREATE POLICY "Partners can update milestones on shared goals"
  ON public.goal_milestones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND shared_with = auth.uid()
    )
  );
