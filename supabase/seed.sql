-- ONE Health Development Seed Data
-- Deterministic UUIDs for reproducible testing
-- Matches actual deployed schema on pvflufqfeaowzextilpl

-- Test organization entities
INSERT INTO usm_entities (id, entity_type, display_name, organization_id, metadata, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'human', 'Test Operator Alpha', 'org-test-001', '{"role": "operator", "shift": "day"}', true),
  ('a0000000-0000-0000-0000-000000000002', 'machine', 'CNC Mill Beta', 'org-test-001', '{"type": "cnc_mill", "model": "DMG-500"}', true),
  ('a0000000-0000-0000-0000-000000000003', 'guardian_patient', 'Test Patient Gamma', 'org-test-001', '{"age": 72, "guardian_devices": ["wristband", "pendant"]}', true)
ON CONFLICT (id) DO NOTHING;

-- Sample stress vectors
INSERT INTO usm_stress_vectors (entity_id, entity_type, stress_index_acute, stress_index_chronic, failure_probability, recovery_coefficient, source_signals, signal_source, confidence) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'human', 0.35, 0.22, 0.15, 0.78, '{"hrv": 0.35, "cortisol_proxy": 0.28, "skin_conductance": 0.42}', 'wristband', 0.85),
  ('a0000000-0000-0000-0000-000000000002', 'machine', 0.41, 0.55, 0.30, 0.60, '{"vibration": 0.41, "temperature": 0.38, "current_draw": 0.45}', 'plc_sensor', 0.92)
ON CONFLICT DO NOTHING;

-- Sample guardian patient
INSERT INTO guardian_patients (entity_id, diagnosis_type, diagnosis_date, diagnosis_stage, emergency_contact_phone, baseline_cognitive_load) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'Alzheimer''s Disease', '2025-06-15', 'mild', '+1-555-0100', 0.72)
ON CONFLICT DO NOTHING;

-- Sample cognitive vector
INSERT INTO guardian_cognitive_vectors (patient_id, entity_id, cognitive_load_index, circadian_disruption, movement_entropy, speech_degradation, identity_coherence, cpr_score, source_signals, confidence) VALUES
  ((SELECT id FROM guardian_patients WHERE entity_id = 'a0000000-0000-0000-0000-000000000003'), 'a0000000-0000-0000-0000-000000000003', 0.42, 0.38, 0.25, 0.55, 0.48, 0.44, '{"hrv_complexity": 0.42, "sleep_variance": 0.38, "gait_variability": 0.25, "word_frequency_shift": 0.55, "routine_deviation": 0.48}', 0.80)
ON CONFLICT DO NOTHING;
