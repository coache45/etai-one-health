import { create } from 'zustand';
import type { UnifiedStressVector } from '@/types/stress';
import { createClient } from '@/lib/supabase/client';

interface StressState {
  currentVector: UnifiedStressVector | null;
  history: UnifiedStressVector[];
  isLoading: boolean;
  fetchLatest: (entityId: string) => Promise<void>;
  fetchHistory: (entityId: string, limit?: number) => Promise<void>;
}

export const useStressStore = create<StressState>((set) => {
  const supabase = createClient();

  return {
    currentVector: null,
    history: [],
    isLoading: false,

    fetchLatest: async (entityId) => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('usm_stress_vectors')
          .select('*')
          .eq('entity_id', entityId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        set({
          currentVector: data as unknown as UnifiedStressVector,
          isLoading: false,
        });
      } catch {
        set({ isLoading: false });
      }
    },

    fetchHistory: async (entityId, limit = 50) => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('usm_stress_vectors')
          .select('*')
          .eq('entity_id', entityId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) throw error;

        set({
          history: (data ?? []) as unknown as UnifiedStressVector[],
          isLoading: false,
        });
      } catch {
        set({ isLoading: false });
      }
    },
  };
});
