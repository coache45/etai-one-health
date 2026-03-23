/**
 * Hand-written Supabase database types for the ONE Health schema.
 * Matches the actual deployed migration on pvflufqfeaowzextilpl.
 * Replace with `npm run db:types` output once Supabase CLI is authenticated.
 */

export type EntityType = 'human' | 'machine' | 'guardian_patient';
export type RiskFlag = 'green' | 'yellow' | 'red';
export type GeofenceEventType = 'entered' | 'exited' | 'wandering';
export type CareNetworkRole = 'primary_caregiver' | 'secondary_caregiver' | 'poa' | 'medical' | 'emergency';
export type MessageRole = 'assistant' | 'user' | 'system';
export type AlertSeverity = 'info' | 'caution' | 'warning' | 'critical' | 'emergency';

export interface Database {
  public: {
    Tables: {
      usm_entities: {
        Row: {
          id: string;
          entity_type: EntityType;
          external_id: string | null;
          display_name: string;
          metadata: Record<string, unknown>;
          organization_id: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          entity_type: EntityType;
          external_id?: string | null;
          display_name: string;
          metadata?: Record<string, unknown>;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          entity_type?: EntityType;
          external_id?: string | null;
          display_name?: string;
          metadata?: Record<string, unknown>;
          organization_id?: string | null;
          updated_at?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };

      usm_stress_vectors: {
        Row: {
          id: string;
          entity_id: string;
          entity_type: EntityType;
          recorded_at: string;
          stress_index_acute: number;
          stress_index_chronic: number;
          failure_probability: number;
          recovery_coefficient: number;
          source_signals: Record<string, number>;
          signal_source: string;
          confidence: number;
          model_version: string | null;
          processing_latency_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          entity_type: EntityType;
          recorded_at?: string;
          stress_index_acute: number;
          stress_index_chronic: number;
          failure_probability: number;
          recovery_coefficient: number;
          source_signals?: Record<string, number>;
          signal_source: string;
          confidence?: number;
          model_version?: string | null;
          processing_latency_ms?: number | null;
          created_at?: string;
        };
        Update: {
          entity_id?: string;
          entity_type?: EntityType;
          recorded_at?: string;
          stress_index_acute?: number;
          stress_index_chronic?: number;
          failure_probability?: number;
          recovery_coefficient?: number;
          source_signals?: Record<string, number>;
          signal_source?: string;
          confidence?: number;
          model_version?: string | null;
          processing_latency_ms?: number | null;
        };
        Relationships: [];
      };

      usm_harmonic_index: {
        Row: {
          id: string;
          human_entity_id: string;
          machine_entity_id: string;
          calculated_at: string;
          hmhi_score: number;
          risk_flag: RiskFlag;
          acute_harmony: number | null;
          chronic_harmony: number | null;
          failure_harmony: number | null;
          recovery_harmony: number | null;
          recommendation: string | null;
          model_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          human_entity_id: string;
          machine_entity_id: string;
          calculated_at?: string;
          hmhi_score: number;
          risk_flag?: RiskFlag;
          acute_harmony?: number | null;
          chronic_harmony?: number | null;
          failure_harmony?: number | null;
          recovery_harmony?: number | null;
          recommendation?: string | null;
          model_version?: string | null;
          created_at?: string;
        };
        Update: {
          human_entity_id?: string;
          machine_entity_id?: string;
          calculated_at?: string;
          hmhi_score?: number;
          risk_flag?: RiskFlag;
          acute_harmony?: number | null;
          chronic_harmony?: number | null;
          failure_harmony?: number | null;
          recovery_harmony?: number | null;
          recommendation?: string | null;
          model_version?: string | null;
        };
        Relationships: [];
      };

      usm_temporal_resonance: {
        Row: {
          id: string;
          entity_id: string;
          analysis_window_start: string;
          analysis_window_end: string;
          dominant_frequency_hz: number | null;
          phase_offset_hours: number | null;
          amplitude_variance: number | null;
          coherence_score: number | null;
          predicted_risk_window_start: string | null;
          predicted_risk_window_end: string | null;
          risk_confidence: number | null;
          raw_spectrum: Record<string, unknown> | null;
          model_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          analysis_window_start: string;
          analysis_window_end: string;
          dominant_frequency_hz?: number | null;
          phase_offset_hours?: number | null;
          amplitude_variance?: number | null;
          coherence_score?: number | null;
          predicted_risk_window_start?: string | null;
          predicted_risk_window_end?: string | null;
          risk_confidence?: number | null;
          raw_spectrum?: Record<string, unknown> | null;
          model_version?: string | null;
          created_at?: string;
        };
        Update: {
          entity_id?: string;
          analysis_window_start?: string;
          analysis_window_end?: string;
          dominant_frequency_hz?: number | null;
          phase_offset_hours?: number | null;
          amplitude_variance?: number | null;
          coherence_score?: number | null;
          predicted_risk_window_start?: string | null;
          predicted_risk_window_end?: string | null;
          risk_confidence?: number | null;
          raw_spectrum?: Record<string, unknown> | null;
          model_version?: string | null;
        };
        Relationships: [];
      };

      guardian_patients: {
        Row: {
          id: string;
          entity_id: string;
          date_of_birth: string | null;
          diagnosis_type: string | null;
          diagnosis_date: string | null;
          diagnosis_stage: string | null;
          primary_caregiver_id: string | null;
          poa_contact_id: string | null;
          medical_provider_id: string | null;
          emergency_contact_phone: string | null;
          active_devices: Record<string, unknown> | null;
          geofence_config: Record<string, unknown> | null;
          alert_preferences: Record<string, unknown> | null;
          baseline_cognitive_load: number | null;
          baseline_circadian_pattern: Record<string, unknown> | null;
          baseline_movement_pattern: Record<string, unknown> | null;
          baseline_speech_pattern: Record<string, unknown> | null;
          baseline_established_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          date_of_birth?: string | null;
          diagnosis_type?: string | null;
          diagnosis_date?: string | null;
          diagnosis_stage?: string | null;
          primary_caregiver_id?: string | null;
          poa_contact_id?: string | null;
          medical_provider_id?: string | null;
          emergency_contact_phone?: string | null;
          active_devices?: Record<string, unknown> | null;
          geofence_config?: Record<string, unknown> | null;
          alert_preferences?: Record<string, unknown> | null;
          baseline_cognitive_load?: number | null;
          baseline_circadian_pattern?: Record<string, unknown> | null;
          baseline_movement_pattern?: Record<string, unknown> | null;
          baseline_speech_pattern?: Record<string, unknown> | null;
          baseline_established_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          entity_id?: string;
          date_of_birth?: string | null;
          diagnosis_type?: string | null;
          diagnosis_date?: string | null;
          diagnosis_stage?: string | null;
          primary_caregiver_id?: string | null;
          poa_contact_id?: string | null;
          medical_provider_id?: string | null;
          emergency_contact_phone?: string | null;
          active_devices?: Record<string, unknown> | null;
          geofence_config?: Record<string, unknown> | null;
          alert_preferences?: Record<string, unknown> | null;
          baseline_cognitive_load?: number | null;
          baseline_circadian_pattern?: Record<string, unknown> | null;
          baseline_movement_pattern?: Record<string, unknown> | null;
          baseline_speech_pattern?: Record<string, unknown> | null;
          baseline_established_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      guardian_cognitive_vectors: {
        Row: {
          id: string;
          patient_id: string;
          entity_id: string;
          recorded_at: string;
          cognitive_load_index: number;
          circadian_disruption: number;
          movement_entropy: number;
          speech_degradation: number;
          identity_coherence: number;
          cpr_score: number;
          cpr_trend: string | null;
          source_device_ids: Record<string, unknown> | null;
          source_signals: Record<string, number>;
          confidence: number;
          alert_triggered: boolean;
          alert_level: string | null;
          model_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          entity_id: string;
          recorded_at?: string;
          cognitive_load_index: number;
          circadian_disruption: number;
          movement_entropy: number;
          speech_degradation: number;
          identity_coherence: number;
          cpr_score?: number;
          cpr_trend?: string | null;
          source_device_ids?: Record<string, unknown> | null;
          source_signals?: Record<string, number>;
          confidence?: number;
          alert_triggered?: boolean;
          alert_level?: string | null;
          model_version?: string | null;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          entity_id?: string;
          recorded_at?: string;
          cognitive_load_index?: number;
          circadian_disruption?: number;
          movement_entropy?: number;
          speech_degradation?: number;
          identity_coherence?: number;
          cpr_score?: number;
          cpr_trend?: string | null;
          source_device_ids?: Record<string, unknown> | null;
          source_signals?: Record<string, number>;
          confidence?: number;
          alert_triggered?: boolean;
          alert_level?: string | null;
          model_version?: string | null;
        };
        Relationships: [];
      };

      guardian_memory_prompts: {
        Row: {
          id: string;
          patient_id: string;
          prompt_type: string;
          prompt_text: string;
          prompt_priority: number;
          delivery_schedule: Record<string, unknown> | null;
          trigger_condition: string | null;
          max_deliveries_per_day: number | null;
          total_deliveries: number | null;
          positive_responses: number | null;
          neutral_responses: number | null;
          negative_responses: number | null;
          effectiveness_score: number | null;
          created_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          prompt_type: string;
          prompt_text: string;
          prompt_priority: number;
          delivery_schedule?: Record<string, unknown> | null;
          trigger_condition?: string | null;
          max_deliveries_per_day?: number | null;
          total_deliveries?: number | null;
          positive_responses?: number | null;
          neutral_responses?: number | null;
          negative_responses?: number | null;
          effectiveness_score?: number | null;
          created_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string;
          prompt_type?: string;
          prompt_text?: string;
          prompt_priority?: number;
          delivery_schedule?: Record<string, unknown> | null;
          trigger_condition?: string | null;
          max_deliveries_per_day?: number | null;
          total_deliveries?: number | null;
          positive_responses?: number | null;
          neutral_responses?: number | null;
          negative_responses?: number | null;
          effectiveness_score?: number | null;
          created_by?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      guardian_geofence_events: {
        Row: {
          id: string;
          patient_id: string;
          latitude: number;
          longitude: number;
          accuracy_meters: number | null;
          altitude_meters: number | null;
          speed_mps: number | null;
          heading: number | null;
          event_type: GeofenceEventType;
          geofence_zone_id: string | null;
          alert_sent: boolean;
          alert_recipients: Record<string, unknown> | null;
          alert_acknowledged_at: string | null;
          alert_acknowledged_by: string | null;
          source_device_id: string | null;
          battery_level: number | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          latitude: number;
          longitude: number;
          accuracy_meters?: number | null;
          altitude_meters?: number | null;
          speed_mps?: number | null;
          heading?: number | null;
          event_type: GeofenceEventType;
          geofence_zone_id?: string | null;
          alert_sent?: boolean;
          alert_recipients?: Record<string, unknown> | null;
          alert_acknowledged_at?: string | null;
          alert_acknowledged_by?: string | null;
          source_device_id?: string | null;
          battery_level?: number | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          latitude?: number;
          longitude?: number;
          accuracy_meters?: number | null;
          altitude_meters?: number | null;
          speed_mps?: number | null;
          heading?: number | null;
          event_type?: GeofenceEventType;
          geofence_zone_id?: string | null;
          alert_sent?: boolean;
          alert_recipients?: Record<string, unknown> | null;
          alert_acknowledged_at?: string | null;
          alert_acknowledged_by?: string | null;
          source_device_id?: string | null;
          battery_level?: number | null;
          recorded_at?: string;
        };
        Relationships: [];
      };

      guardian_care_network: {
        Row: {
          id: string;
          patient_id: string;
          contact_user_id: string | null;
          contact_name: string;
          contact_phone: string | null;
          contact_email: string | null;
          role: CareNetworkRole;
          permissions: Record<string, boolean>;
          receives_alerts: boolean;
          alert_types: Record<string, unknown> | null;
          quiet_hours_start: string | null;
          quiet_hours_end: string | null;
          is_active: boolean;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          contact_user_id?: string | null;
          contact_name: string;
          contact_phone?: string | null;
          contact_email?: string | null;
          role: CareNetworkRole;
          permissions?: Record<string, boolean>;
          receives_alerts?: boolean;
          alert_types?: Record<string, unknown> | null;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          is_active?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string;
          contact_user_id?: string | null;
          contact_name?: string;
          contact_phone?: string | null;
          contact_email?: string | null;
          role?: CareNetworkRole;
          permissions?: Record<string, boolean>;
          receives_alerts?: boolean;
          alert_types?: Record<string, unknown> | null;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          is_active?: boolean;
          verified_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      guardian_agent_conversations: {
        Row: {
          id: string;
          patient_id: string;
          session_id: string;
          role: MessageRole;
          message_text: string;
          message_type: string;
          cognitive_state_snapshot: Record<string, unknown> | null;
          location_snapshot: Record<string, unknown> | null;
          delivered_via: string | null;
          delivery_acknowledged: boolean;
          patient_sentiment: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          session_id: string;
          role: MessageRole;
          message_text: string;
          message_type: string;
          cognitive_state_snapshot?: Record<string, unknown> | null;
          location_snapshot?: Record<string, unknown> | null;
          delivered_via?: string | null;
          delivery_acknowledged?: boolean;
          patient_sentiment?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          session_id?: string;
          role?: MessageRole;
          message_text?: string;
          message_type?: string;
          cognitive_state_snapshot?: Record<string, unknown> | null;
          location_snapshot?: Record<string, unknown> | null;
          delivered_via?: string | null;
          delivery_acknowledged?: boolean;
          patient_sentiment?: string | null;
          recorded_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
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
