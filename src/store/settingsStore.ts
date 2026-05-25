import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameSettings } from '@/types'
import { SETTINGS_KEY, DEFAULT_SETTINGS } from '@/utils/constants'

interface SettingsStore extends GameSettings {
  setBgmVolume: (v: number) => void
  setSfxVolume: (v: number) => void
  toggleMute: () => void
  setQuality: (q: GameSettings['qualityPreset']) => void
  setFontSize: (s: number) => void
  toggleAccessibility: () => void
  setCustomBgUrl: (url: string) => void
  resetAll: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setBgmVolume: (v) => set({ bgmVolume: v }),
      setSfxVolume: (v) => set({ sfxVolume: v }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setQuality: (q) => set({ qualityPreset: q }),
      setFontSize: (s) => set({ fontSize: s }),
      toggleAccessibility: () =>
        set((s) => ({ accessibilityMode: !s.accessibilityMode })),
      setCustomBgUrl: (url) => set({ customBgUrl: url }),
      resetAll: () => set({ ...DEFAULT_SETTINGS }),
    }),
    { name: SETTINGS_KEY }
  )
)
