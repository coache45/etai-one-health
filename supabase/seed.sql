-- ONE Health Development Seed Data
-- Deterministic UUIDs for reproducible testing

-- Test organization entity
INSERT INTO usm_entities (id, entity_type, name, org_id, metadata) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'human', 'Test Operator Alpha', 'org-test-001', '{"role": "operator", "shift": "day"}'),
  ('a0000000-0000-0000-0000-000000000002', 'machine', 'CNC Mill Beta', 'org-test-001', '{"type": "cnc_mill", "model": "DMG-500"}'),
  ('a0000000-0000-0000-0000-000000000003', 'guardian_patient', 'Test Patient Gamma', 'org-test-001', '{"age": 72, "guardian_devices": ["wristband", "pendant"]}')
ON CONFLICT (id) DO NOTHING;

-- Sample stress vectors
INSERT INTO usm_stress_vectors (entity_id, entity_type, stress_index_acute, stress_index_chronic, failure_probability, recovery_coefficient, source_signals, confidence) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'human', 0.35, 0.22, 0.15, 0.78, '{"hrv": 0.35, "cortisol_proxy": 0.28, "skin_conductance": 0.42}', 0.85),
  ('a0000000-0000-0000-0000-000000000002', 'machine', 0.41, 0.55, 0.30, 0.60, '{"vibration": 0.41, "temperature": 0.38, "current_draw": 0.45}', 0.92)
ON CONFLICT DO NOTHING;

-- Sample guardian patient
INSERT INTO guardian_patients (entity_id, diagnosis, diagnosis_date, stage, emergency_contact, medications, baseline_cognitive_score) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'Alzheimer''s Disease', '2025-06-15', 'mild', '+1-555-0100', '[{"name": "Donepezil", "dose": "10mg", "frequency": "daily"}]', 0.72)
ON CONFLICT DO NOTHING;

-- Sample cognitive vector
INSERT INTO guardian_cognitive_vectors (patient_id, cognitive_load_index, circadian_disruption, movement_entropy, speech_degradation, identity_coherence, source_signals, confidence) VALUES
  ((SELECT id FROM guardian_patients WHERE entity_id = 'a0000000-0000-0000-0000-000000000003'), 0.42, 0.38, 0.25, 0.55, 0.48, '{"hrv_complexity": 0.42, "sleep_variance": 0.38, "gait_variability": 0.25, "word_frequency_shift": 0.55, "routine_deviation": 0.48}', 0.80)
ON CONFLICT DO NOTHING;
