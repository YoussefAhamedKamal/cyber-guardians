export interface GameSettings {
  bgmVolume: number
  sfxVolume: number
  muted: boolean
  qualityPreset: 'low' | 'medium' | 'high'
  fontSize: number
  accessibilityMode: boolean
  customBgUrl: string
}
