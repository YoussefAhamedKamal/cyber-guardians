export interface GameSettings {
  bgmVolume: number
  sfxVolume: number
  muted: boolean
  qualityPreset: 'low' | 'medium' | 'high'
  fontSize: number
  fontFamily: string
  fontColor: string
  borderRadius: number
  borderColor: string
  borderWidth: number
  bgColor: string
  bgBrightness: number
  bgAnimationUrl: string
  bgAnimationBrightness: number
  accessibilityMode: boolean
  customBgUrl: string
  customBoyVideoUrl: string
  customGirlVideoUrl: string
}
