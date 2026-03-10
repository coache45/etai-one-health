import { create } from 'zustand'
import type { DailyHealthLog } from '@/types/health'
import type { AIInsight } from '@/types/ai'

interface HealthState {
  todayLog: DailyHealthLog | null
  recentLogs: DailyHealthLog[]
  insights: AIInsight[]
  isLoading: boolean
  setTodayLog: (log: DailyHealthLog | null) => void
  setRecentLogs: (logs: DailyHealthLog[]) => void
  setInsights: (insights: AIInsight[]) => void
  setLoading: (loading: boolean) => void
  updateTodayLog: (updates: Partial<DailyHealthLog>) => void
  markInsightRead: (id: string) => void
}

export const useHealthStore = create<HealthState>((set) => ({
  todayLog: null,
  recentLogs: [],
  insights: [],
  isLoading: true,
  setTodayLog: (todayLog) => set({ todayLog }),
  setRecentLogs: (recentLogs) => set({ recentLogs }),
  setInsights: (insights) => set({ insights }),
  setLoading: (isLoading) => set({ isLoading }),
  updateTodayLog: (updates) =>
    set((state) => ({
      todayLog: state.todayLog ? { ...state.todayLog, ...updates } : null,
    })),
  markInsightRead: (id) =>
    set((state) => ({
      insights: state.insights.map((i) =>
        i.id === id ? { ...i, is_read: true } : i
      ),
    })),
}))
