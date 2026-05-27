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
  setFontFamily: (f: string) => void
  setFontColor: (c: string) => void
  setBorderRadius: (r: number) => void
  setBorderColor: (c: string) => void
  setBorderWidth: (w: number) => void
  setBgColor: (c: string) => void
  setBgBrightness: (b: number) => void
  setBgAnimationUrl: (url: string) => void
  setBgAnimationBrightness: (b: number) => void
  toggleAccessibility: () => void
  setCustomBgUrl: (url: string) => void
  setCustomBoyVideoUrl: (url: string) => void
  setCustomGirlVideoUrl: (url: string) => void
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
      setFontFamily: (f) => set({ fontFamily: f }),
      setFontColor: (c) => set({ fontColor: c }),
      setBorderRadius: (r) => set({ borderRadius: r }),
      setBorderColor: (c) => set({ borderColor: c }),
      setBorderWidth: (w) => set({ borderWidth: w }),
      setBgColor: (c) => set({ bgColor: c }),
      setBgBrightness: (b) => set({ bgBrightness: b }),
      setBgAnimationUrl: (url) => set({ bgAnimationUrl: url }),
      setBgAnimationBrightness: (b) => set({ bgAnimationBrightness: b }),
      toggleAccessibility: () =>
        set((s) => ({ accessibilityMode: !s.accessibilityMode })),
      setCustomBgUrl: (url) => set({ customBgUrl: url }),
      setCustomBoyVideoUrl: (url) => set({ customBoyVideoUrl: url }),
      setCustomGirlVideoUrl: (url) => set({ customGirlVideoUrl: url }),
      resetAll: () => set({ ...DEFAULT_SETTINGS }),
    }),
    { name: SETTINGS_KEY }
  )
)
