-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics_hourly ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples_shared_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_challenges ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Daily Health Logs
CREATE POLICY "Users read own health logs" ON daily_health_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users write own health logs" ON daily_health_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own health logs" ON daily_health_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own health logs" ON daily_health_logs FOR DELETE USING (auth.uid() = user_id);

-- Hourly Metrics
CREATE POLICY "Users read own metrics" ON health_metrics_hourly FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users write own metrics" ON health_metrics_hourly FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Couples: both partners can read/update
CREATE POLICY "Partners read couple" ON couples FOR SELECT USING (
  auth.uid() = partner_a_id OR auth.uid() = partner_b_id
);
CREATE POLICY "Users create couple" ON couples FOR INSERT WITH CHECK (
  auth.uid() = partner_a_id OR auth.uid() = invited_by
);
CREATE POLICY "Partners update couple" ON couples FOR UPDATE USING (
  auth.uid() = partner_a_id OR auth.uid() = partner_b_id
);

-- Couples Shared Goals
CREATE POLICY "Partners read shared goals" ON couples_shared_goals FOR SELECT USING (
  couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid())
);
CREATE POLICY "Partners write shared goals" ON couples_shared_goals FOR INSERT WITH CHECK (
  couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid())
);
CREATE POLICY "Partners update shared goals" ON couples_shared_goals FOR UPDATE USING (
  couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid())
);

-- AI Conversations
CREATE POLICY "Users read own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users write own conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own conversations" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);

-- AI Messages
CREATE POLICY "Users read own messages" ON ai_messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM ai_conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users write own messages" ON ai_messages FOR INSERT WITH CHECK (
  conversation_id IN (SELECT id FROM ai_conversations WHERE user_id = auth.uid())
);

-- AI Insights
CREATE POLICY "Users read own insights" ON ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can write insights" ON ai_insights FOR INSERT WITH CHECK (true);

-- Programs (public read)
CREATE POLICY "Anyone reads programs" ON programs FOR SELECT USING (true);

-- User Programs
CREATE POLICY "Users read own programs" ON user_programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users write own programs" ON user_programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own programs" ON user_programs FOR UPDATE USING (auth.uid() = user_id);

-- Organizations
CREATE POLICY "Org admins read org" ON organizations FOR SELECT USING (
  id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())
);
CREATE POLICY "Org admins update org" ON organizations FOR UPDATE USING (admin_user_id = auth.uid());

-- Organization Members
CREATE POLICY "Members read org members" ON organization_members FOR SELECT USING (
  org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())
);

-- Wellness Challenges
CREATE POLICY "Org members read challenges" ON wellness_challenges FOR SELECT USING (
  org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())
);
