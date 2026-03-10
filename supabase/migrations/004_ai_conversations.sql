CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  conversation_type TEXT DEFAULT 'coaching' CHECK (conversation_type IN ('coaching', 'check_in', 'couples', 'program', 'insight')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('daily', 'weekly', 'monthly', 'alert', 'couples', 'celebration')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  is_read BOOLEAN DEFAULT false,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
