CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_a_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  partner_b_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'disconnected')),
  invited_by UUID REFERENCES profiles(id),
  partner_a_shares JSONB DEFAULT '{"sleep": true, "stress": true, "activity": true, "heart_rate": false, "mood": true}'::jsonb,
  partner_b_shares JSONB DEFAULT '{"sleep": true, "stress": true, "activity": true, "heart_rate": false, "mood": true}'::jsonb,
  invite_token TEXT UNIQUE,
  sync_score INTEGER,
  sync_score_updated_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ,
  disconnected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE couples_shared_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  starts_at DATE,
  ends_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
