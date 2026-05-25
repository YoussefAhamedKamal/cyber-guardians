export const GAME_TITLE = 'Cyber Guardians'
export const GAME_SUBTITLE = 'حراس الأمن السيبراني'
export const DESIGN_WIDTH = 1200
export const DESIGN_HEIGHT = 675
export const ASPECT_RATIO = 16 / 9
export const STORAGE_KEY = 'cyber-guardians-save'
export const SETTINGS_KEY = 'cyber-guardians-settings'

export const DEFAULT_SETTINGS = {
  bgmVolume: 0.7,
  sfxVolume: 1.0,
  muted: false,
  qualityPreset: 'high' as const,
  fontSize: 16,
  accessibilityMode: false,
  customBgUrl: '',
}

export const QUALITY_PRESETS = {
  low: { pixelRatio: 0.5, shadows: false, antialias: false },
  medium: { pixelRatio: 0.75, shadows: true, antialias: true },
  high: { pixelRatio: 1.0, shadows: true, antialias: true },
} as const
