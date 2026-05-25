import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChallengeState, LevelId } from '@/types'
import { STORAGE_KEY } from '@/utils/constants'

interface GameStore {
  currentLevel: LevelId
  completedLevels: Set<LevelId>
  totalScore: number
  isPlaying: boolean
  isPaused: boolean

  setLevel: (level: LevelId) => void
  completeLevel: (level: LevelId, score: number) => void
  togglePause: () => void
  startGame: () => void
  resetProgress: () => void
  getProgress: () => number
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentLevel: 1 as LevelId,
      completedLevels: new Set(),
      totalScore: 0,
      isPlaying: false,
      isPaused: false,

      setLevel: (level) => set({ currentLevel: level }),

      completeLevel: (level, score) =>
        set((s) => {
          const next = new Set(s.completedLevels)
          next.add(level)
          return {
            completedLevels: next,
            totalScore: s.totalScore + score,
          }
        }),

      togglePause: () => set((s) => ({ isPaused: !s.isPaused })),

      startGame: () => set({ isPlaying: true, isPaused: false }),

      resetProgress: () =>
        set({
          currentLevel: 1 as LevelId,
          completedLevels: new Set(),
          totalScore: 0,
          isPlaying: false,
          isPaused: false,
        }),

      getProgress: () => {
        return (get().completedLevels.size / 7) * 100
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        currentLevel: s.currentLevel,
        completedLevels: Array.from(s.completedLevels),
        totalScore: s.totalScore,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<GameStore> | undefined
        if (!p) return current
        return {
          ...current,
          currentLevel: (p.currentLevel ?? 1) as LevelId,
          completedLevels: new Set((Array.isArray(p.completedLevels) ? p.completedLevels : []) as LevelId[]),
          totalScore: p.totalScore ?? 0,
        }
      },
    }
  )
)
