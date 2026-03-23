/**
 * Hand-written Supabase database types for the ONE Health schema.
 * Matches the 10-table USM + Guardian CPR migration.
 * Replace with `npm run db:types` output once Supabase CLI is authenticated.
 */

export type EntityType = 'human' | 'machine' | 'guardian_patient';
export type RiskFlag = 'green' | 'yellow' | 'red';
export type GeofenceEventType = 'entered' | 'exited' | 'wandering';
export type CareNetworkRole = 'caregiver' | 'poa' | 'medical' | 'emergency';
export type MessageRole = 'assistant' | 'user' | 'system';
export type AlertSeverity = 'info' | 'caution' | 'warning' | 'critical' | 'emergency';

export interface Database {
  public: {
    Tables: {
      usm_entities: {
        Row: {
          id: string;
          entity_type: EntityType;
          name: string;
          org_id: string;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_type: EntityType;
          name: string;
          org_id: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: EntityType;
          name?: string;
          org_id?: string;
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
      };

      usm_stress_vectors: {
        Row: {
          id: string;
          entity_id: string;
          entity_type: EntityType;
          timestamp: string;
          stress_index_acute: number;
          stress_index_chronic: number;
          failure_probability: number;
          recovery_coefficient: number;
          source_signals: Record<string, number>;
          confidence: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          entity_type: EntityType;
          timestamp?: string;
          stress_index_acute: number;
          stress_index_chronic: number;
          failure_probability: number;
          recovery_coefficient: number;
          source_signals?: Record<string, number>;
          confidence?: number;
          created_at?: string;
        };
        Update: {
          entity_id?: string;
          entity_type?: EntityType;
          timestamp?: string;
          stress_index_acute?: number;
          stress_index_chronic?: number;
          failure_probability?: number;
          recovery_coefficient?: number;
          source_signals?: Record<string, number>;
          confidence?: number;
        };
      };

      usm_harmonic_index: {
        Row: {
          id: string;
          pairing_id: string;
          human_id: string;
          machine_id: string;
          hmhi_score: number;
          risk_flag: RiskFlag;
          recommendation: string;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          pairing_id: string;
          human_id: string;
          machine_id: string;
          hmhi_score: number;
          risk_flag?: RiskFlag;
          recommendation?: string;
          calculated_at?: string;
        };
        Update: {
          pairing_id?: string;
          human_id?: string;
          machine_id?: string;
          hmhi_score?: number;
          risk_flag?: RiskFlag;
          recommendation?: string;
          calculated_at?: string;
        };
      };

      usm_temporal_resonance: {
        Row: {
          id: string;
          entity_id: string;
          resonance_type: string;
          frequency_hz: number;
          amplitude: number;
          phase_offset: number;
          analysis_window_start: string;
          analysis_window_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          resonance_type: string;
          frequency_hz: number;
          amplitude: number;
          phase_offset?: number;
          analysis_window_start: string;
          analysis_window_end: string;
          created_at?: string;
        };
        Update: {
          entity_id?: string;
          resonance_type?: string;
          frequency_hz?: number;
          amplitude?: number;
          phase_offset?: number;
          analysis_window_start?: string;
          analysis_window_end?: string;
        };
      };

      guardian_patients: {
        Row: {
          id: string;
          entity_id: string;
          diagnosis: string;
          diagnosis_date: string;
          stage: string;
          primary_caregiver_id: string | null;
          emergency_contact: string;
          medications: Record<string, unknown>[];
          baseline_cognitive_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          diagnosis: string;
          diagnosis_date: string;
          stage: string;
          primary_caregiver_id?: string | null;
          emergency_contact: string;
          medications?: Record<string, unknown>[];
          baseline_cognitive_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          entity_id?: string;
          diagnosis?: string;
          diagnosis_date?: string;
          stage?: string;
          primary_caregiver_id?: string | null;
          emergency_contact?: string;
          medications?: Record<string, unknown>[];
          baseline_cognitive_score?: number;
          updated_at?: string;
        };
      };

      guardian_cognitive_vectors: {
        Row: {
          id: string;
          patient_id: string;
          timestamp: string;
          cognitive_load_index: number;
          circadian_disruption: number;
          movement_entropy: number;
          speech_degradation: number;
          identity_coherence: number;
          cpr_composite_score: number;
          source_signals: Record<string, number>;
          confidence: number;
          alert_triggered: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          timestamp?: string;
          cognitive_load_index: number;
          circadian_disruption: number;
          movement_entropy: number;
          speech_degradation: number;
          identity_coherence: number;
          cpr_composite_score?: number;
          source_signals?: Record<string, number>;
          confidence?: number;
          alert_triggered?: boolean;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          timestamp?: string;
          cognitive_load_index?: number;
          circadian_disruption?: number;
          movement_entropy?: number;
          speech_degradation?: number;
          identity_coherence?: number;
          cpr_composite_score?: number;
          source_signals?: Record<string, number>;
          confidence?: number;
          alert_triggered?: boolean;
        };
      };

      guardian_memory_prompts: {
        Row: {
          id: string;
          patient_id: string;
          prompt_type: string;
          content: string;
          scheduled_at: string;
          delivered_at: string | null;
          response_type: string | null;
          effectiveness_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          prompt_type: string;
          content: string;
          scheduled_at: string;
          delivered_at?: string | null;
          response_type?: string | null;
          effectiveness_score?: number | null;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          prompt_type?: string;
          content?: string;
          scheduled_at?: string;
          delivered_at?: string | null;
          response_type?: string | null;
          effectiveness_score?: number | null;
        };
      };

      guardian_geofence_events: {
        Row: {
          id: string;
          patient_id: string;
          event_type: GeofenceEventType;
          latitude: number;
          longitude: number;
          geofence_id: string;
          timestamp: string;
          alert_sent: boolean;
          responder_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          event_type: GeofenceEventType;
          latitude: number;
          longitude: number;
          geofence_id: string;
          timestamp?: string;
          alert_sent?: boolean;
          responder_id?: string | null;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          event_type?: GeofenceEventType;
          latitude?: number;
          longitude?: number;
          geofence_id?: string;
          timestamp?: string;
          alert_sent?: boolean;
          responder_id?: string | null;
        };
      };

      guardian_care_network: {
        Row: {
          id: string;
          patient_id: string;
          member_id: string;
          role: CareNetworkRole;
          permissions: Record<string, boolean>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          member_id: string;
          role: CareNetworkRole;
          permissions?: Record<string, boolean>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string;
          member_id?: string;
          role?: CareNetworkRole;
          permissions?: Record<string, boolean>;
          is_active?: boolean;
          updated_at?: string;
        };
      };

      guardian_agent_conversations: {
        Row: {
          id: string;
          patient_id: string;
          agent_type: string;
          message_role: MessageRole;
          content: string;
          sentiment_score: number | null;
          anomaly_flags: Record<string, unknown> | null;
          session_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          agent_type: string;
          message_role: MessageRole;
          content: string;
          sentiment_score?: number | null;
          anomaly_flags?: Record<string, unknown> | null;
          session_id: string;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          agent_type?: string;
          message_role?: MessageRole;
          content?: string;
          sentiment_score?: number | null;
          anomaly_flags?: Record<string, unknown> | null;
          session_id?: string;
        };
      };
    };
  };
}

// Convenience aliases
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
