/**
 * Seeds the live Supabase database with test data for the Guardian pipeline.
 * Run with: node scripts/seed-database.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Parse .env.local manually (no dotenv dependency)
const envFile = readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('='))
    .filter(parts => parts.length >= 2)
    .map(([k, ...v]) => [k.trim(), v.join('=').trim()])
);

console.log('URL:', env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key starts with:', env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seed() {
  console.log('Seeding database...');

  // 1. Insert test entities (actual columns: display_name, organization_id, is_active)
  console.log('\n--- Inserting USM entities ---');
  const { data: entities, error: entError } = await supabase
    .from('usm_entities')
    .upsert([
      {
        id: 'a0000000-0000-0000-0000-000000000001',
        entity_type: 'human',
        display_name: 'Test Operator Alpha',
        organization_id: 'b0000000-0000-0000-0000-000000000001',
        metadata: { role: 'operator', shift: 'day' },
        is_active: true,
      },
      {
        id: 'a0000000-0000-0000-0000-000000000002',
        entity_type: 'machine',
        display_name: 'CNC Mill Beta',
        organization_id: 'b0000000-0000-0000-0000-000000000001',
        metadata: { type: 'cnc_mill', model: 'DMG-500' },
        is_active: true,
      },
      {
        id: 'a0000000-0000-0000-0000-000000000003',
        entity_type: 'guardian_patient',
        display_name: 'Test Patient Gamma',
        organization_id: 'b0000000-0000-0000-0000-000000000001',
        metadata: { age: 72, guardian_devices: ['wristband', 'pendant'] },
        is_active: true,
      },
    ], { onConflict: 'id' })
    .select();

  if (entError) {
    console.error('Entity insert error:', entError);
    return;
  }
  console.log('Entities inserted:', entities.length);

  // 2. Insert stress vectors (actual columns: recorded_at, signal_source)
  console.log('\n--- Inserting USM stress vectors ---');
  const { data: vectors, error: vecError } = await supabase
    .from('usm_stress_vectors')
    .insert([
      {
        entity_id: 'a0000000-0000-0000-0000-000000000001',
        entity_type: 'human',
        stress_index_acute: 0.35,
        stress_index_chronic: 0.22,
        failure_probability: 0.15,
        recovery_coefficient: 0.78,
        source_signals: { hrv: 0.35, cortisol_proxy: 0.28, skin_conductance: 0.42 },
        signal_source: 'wristband',
        confidence: 0.85,
      },
      {
        entity_id: 'a0000000-0000-0000-0000-000000000002',
        entity_type: 'machine',
        stress_index_acute: 0.41,
        stress_index_chronic: 0.55,
        failure_probability: 0.30,
        recovery_coefficient: 0.60,
        source_signals: { vibration: 0.41, temperature: 0.38, current_draw: 0.45 },
        signal_source: 'plc_sensor',
        confidence: 0.92,
      },
    ])
    .select('id');

  if (vecError) {
    console.error('Stress vector insert error:', vecError);
    return;
  }
  console.log('Stress vectors inserted:', vectors.length);

  // 3. Insert guardian patient -- delete existing first for idempotency
  console.log('\n--- Inserting Guardian patient ---');
  await supabase.from('guardian_care_network').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('guardian_cognitive_vectors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('guardian_patients').delete().eq('entity_id', 'a0000000-0000-0000-0000-000000000003');
  const { data: patient, error: patError } = await supabase
    .from('guardian_patients')
    .insert({
      entity_id: 'a0000000-0000-0000-0000-000000000003',
      diagnosis_type: 'alzheimers',
      diagnosis_date: '2025-06-15',
      diagnosis_stage: 'mild',
      emergency_contact_phone: '+1-555-0100',
      baseline_cognitive_load: 0.72,
      active_devices: [{ type: 'wristband', id: 'dev-001' }, { type: 'pendant', id: 'dev-002' }],
    })
    .select()
    .single();

  if (patError) {
    console.error('Patient insert error:', patError);
    return;
  }
  console.log('Patient inserted:', patient.id);

  // 4. Insert baseline cognitive vector (actual columns: entity_id, cpr_score, recorded_at, alert_level)
  console.log('\n--- Inserting baseline cognitive vector ---');
  const { data: cogVec, error: cogError } = await supabase
    .from('guardian_cognitive_vectors')
    .insert({
      patient_id: patient.id,
      entity_id: 'a0000000-0000-0000-0000-000000000003',
      cognitive_load_index: 0.42,
      circadian_disruption: 0.38,
      movement_entropy: 0.25,
      speech_degradation: 0.55,
      identity_coherence: 0.48,
      cpr_score: 0.44,
      source_signals: {
        hrv_complexity: 0.42,
        sleep_variance: 0.38,
        gait_variability: 0.25,
        word_frequency_shift: 0.55,
        routine_deviation: 0.48,
      },
      confidence: 0.80,
    })
    .select('id, cpr_score, alert_triggered')
    .single();

  if (cogError) {
    console.error('Cognitive vector insert error:', cogError);
    return;
  }
  console.log('Cognitive vector inserted:', cogVec.id);
  console.log('  CPR Score:', cogVec.cpr_score);
  console.log('  Alert triggered:', cogVec.alert_triggered);

  // 5. Insert care network members (actual columns: contact_name, contact_phone, contact_email, receives_alerts)
  console.log('\n--- Inserting care network ---');
  const { data: network, error: netError } = await supabase
    .from('guardian_care_network')
    .insert([
      {
        patient_id: patient.id,
        contact_user_id: 'a0000000-0000-0000-0000-000000000001',
        contact_name: 'Test Operator Alpha',
        contact_phone: '+1-555-0101',
        contact_email: 'alpha@etai-test.com',
        role: 'primary_caregiver',
        permissions: { view_location: true, manage_prompts: true, receive_alerts: true },
        receives_alerts: true,
        is_active: true,
      },
    ])
    .select();

  if (netError) {
    console.error('Care network insert error:', netError);
    // Non-fatal -- continue
  } else {
    console.log('Care network members inserted:', network.length);
  }

  // Print summary
  console.log('\n========================================');
  console.log('SEED COMPLETE');
  console.log('========================================');
  console.log('Patient ID:', patient.id);
  console.log('Entity ID:', patient.entity_id);
  console.log('');
  console.log('Use this patient_id in your curl commands:');
  console.log(`  ${patient.id}`);
  console.log('========================================');
}

seed().catch(console.error);
