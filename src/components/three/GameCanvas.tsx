import { Canvas } from '@react-three/fiber'
import { type ReactNode } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSettingsStore } from '@/store'
import { QUALITY_PRESETS } from '@/utils/constants'

interface GameCanvasProps {
  children: ReactNode
}

export function GameCanvas({ children }: GameCanvasProps) {
  const quality = useSettingsStore((s) => s.qualityPreset)
  const preset = QUALITY_PRESETS[quality]

  return (
    <Canvas
      dpr={preset.pixelRatio}
      shadows={preset.shadows}
      gl={{ antialias: preset.antialias }}
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      {children}
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.3} luminanceSmoothing={0.03} />
      </EffectComposer>
    </Canvas>
  )
}
