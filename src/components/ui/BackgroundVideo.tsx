import { useRef, useEffect } from 'react'

interface Props {
  blur?: number
  overlayColor?: string
  overlayOpacity?: number
}

export function BackgroundVideo({ blur = 0, overlayColor = '#0a0a1a', overlayOpacity = 0.6 }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.play().catch(() => {})
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <video
        ref={ref} muted loop playsInline
        src="/videos/background.mp4"
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: overlayColor,
        opacity: overlayOpacity,
      }} />
    </div>
  )
}
