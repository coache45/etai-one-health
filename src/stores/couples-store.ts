import { create } from 'zustand'
import type { CouplesData, CouplesSharedGoal } from '@/types/couples'

interface CouplesState {
  couplesData: CouplesData | null
  isLoading: boolean
  setCouplesData: (data: CouplesData | null) => void
  setLoading: (loading: boolean) => void
  updateSyncScore: (score: number) => void
  addSharedGoal: (goal: CouplesSharedGoal) => void
  updateSharedGoal: (id: string, updates: Partial<CouplesSharedGoal>) => void
}

export const useCouplesStore = create<CouplesState>((set) => ({
  couplesData: null,
  isLoading: true,
  setCouplesData: (couplesData) => set({ couplesData, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  updateSyncScore: (score) =>
    set((state) => ({
      couplesData: state.couplesData
        ? { ...state.couplesData, syncScore: score }
        : null,
    })),
  addSharedGoal: (goal) =>
    set((state) => ({
      couplesData: state.couplesData
        ? {
            ...state.couplesData,
            sharedGoals: [...state.couplesData.sharedGoals, goal],
          }
        : null,
    })),
  updateSharedGoal: (id, updates) =>
    set((state) => ({
      couplesData: state.couplesData
        ? {
            ...state.couplesData,
            sharedGoals: state.couplesData.sharedGoals.map((g) =>
              g.id === id ? { ...g, ...updates } : g
            ),
          }
        : null,
    })),
}))
