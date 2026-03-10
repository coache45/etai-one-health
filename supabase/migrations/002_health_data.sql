CREATE TABLE daily_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  sleep_hours NUMERIC,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_bedtime TIME,
  sleep_waketime TIME,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  mood INTEGER CHECK (mood BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  steps INTEGER,
  active_minutes INTEGER,
  water_glasses INTEGER,
  meals_logged INTEGER,
  exercise_type TEXT,
  exercise_minutes INTEGER,
  notes TEXT,
  -- Ring One / wearable biometric data
  resting_heart_rate INTEGER,
  hrv_ms INTEGER,
  spo2_percent NUMERIC,
  skin_temp_celsius NUMERIC,
  respiratory_rate NUMERIC,
  sleep_deep_minutes INTEGER,
  sleep_light_minutes INTEGER,
  sleep_rem_minutes INTEGER,
  sleep_awake_minutes INTEGER,
  -- Computed scores
  readiness_score INTEGER,
  sleep_score INTEGER,
  stress_score INTEGER,
  recovery_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

CREATE INDEX idx_health_logs_user_date ON daily_health_logs(user_id, log_date DESC);

CREATE TABLE health_metrics_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  heart_rate INTEGER,
  hrv_ms INTEGER,
  spo2_percent NUMERIC,
  skin_temp_celsius NUMERIC,
  steps INTEGER,
  active_calories INTEGER,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ring_one', 'apple_health', 'google_health', 'fitbit', 'garmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_metrics_hourly_user ON health_metrics_hourly(user_id, recorded_at DESC);
