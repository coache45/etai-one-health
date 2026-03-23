-- AI Studio: prompt_packs, prompt_outputs, user_goals, goal_milestones

-- ============================================================
-- PROMPT PACKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prompt_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('business', 'relationships', 'health', 'finance', 'creativity', 'learning')),
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_free boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_prompt_packs_category ON public.prompt_packs (category);
CREATE INDEX idx_prompt_packs_free ON public.prompt_packs (is_free);

ALTER TABLE public.prompt_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read prompt packs"
  ON public.prompt_packs FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- PROMPT OUTPUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prompt_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id uuid REFERENCES public.prompt_packs(id) ON DELETE SET NULL,
  prompt_text text NOT NULL,
  output_text text NOT NULL,
  is_saved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_prompt_outputs_user ON public.prompt_outputs (user_id, created_at DESC);
CREATE INDEX idx_prompt_outputs_saved ON public.prompt_outputs (user_id, is_saved) WHERE is_saved = true;

ALTER TABLE public.prompt_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own outputs"
  ON public.prompt_outputs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outputs"
  ON public.prompt_outputs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outputs"
  ON public.prompt_outputs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outputs"
  ON public.prompt_outputs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- USER GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) > 0),
  category text NOT NULL CHECK (category IN ('business', 'relationships', 'health', 'finance', 'creativity', 'learning')),
  target_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_goals_user ON public.user_goals (user_id, status, created_at DESC);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON public.user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON public.user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- GOAL MILESTONES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.goal_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES public.user_goals(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) > 0),
  is_complete boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_goal_milestones_goal ON public.goal_milestones (goal_id, created_at ASC);

ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;

-- Milestones inherit access from parent goal ownership
CREATE POLICY "Users can read milestones for own goals"
  ON public.goal_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert milestones for own goals"
  ON public.goal_milestones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update milestones for own goals"
  ON public.goal_milestones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete milestones for own goals"
  ON public.goal_milestones FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_goals
      WHERE id = goal_milestones.goal_id AND user_id = auth.uid()
    )
  );
