import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const supabase = createClient();

  return {
    user: null,
    session: null,
    isLoading: true,

    initialize: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        set({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, user: session?.user ?? null });
        });
      } catch {
        set({ isLoading: false });
      }
    },

    signIn: async (email, password) => {
      set({ isLoading: true });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ isLoading: false });
    },

    signUp: async (email, password) => {
      set({ isLoading: true });
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      set({ isLoading: false });
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    },
  };
});
