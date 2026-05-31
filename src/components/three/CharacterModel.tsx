import { useEffect, useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { characters } from '@/data'
import { BASE_URL } from '@/utils/constants'

interface Props {
  characterId: string
  position?: [number, number, number]
  talking?: boolean
}

function VideoCharacter({ src, color, talking }: { src: string; color: string; talking: boolean }) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)
  const frameRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.MeshBasicMaterial>(null!)

  useEffect(() => {
    const vid = document.createElement('video')
    vid.src = src
    vid.loop = true
    vid.muted = true
    vid.playsInline = true
    vid.setAttribute('crossorigin', 'anonymous')
    vid.play().catch(() => console.warn('CharacterModel video play blocked'))

    const tex = new THREE.VideoTexture(vid)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    setTexture(tex)

    return () => { vid.pause(); vid.remove(); tex.dispose() }
  }, [src])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial
      const base = talking ? 0.6 : 0.3
      mat.emissiveIntensity = base + Math.sin(t * 1.8) * 0.15
    }
    if (glowRef.current) {
      glowRef.current.opacity = 0.08 + Math.sin(t * 1.2) * 0.04
    }
  })

  if (!texture) return null

  return (
    <group>
      {/* Back glow */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[0.95, 1.25]} />
        <meshBasicMaterial ref={glowRef} color={color} transparent opacity={0.1} />
      </mesh>
      {/* Video */}
      <mesh>
        <planeGeometry args={[0.7, 1.0]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Holographic wireframe frame */}
      <mesh ref={frameRef} position={[0, 0, 0.01]}>
        <boxGeometry args={[0.74, 1.04, 0.001]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.3}
          wireframe transparent opacity={0.5}
        />
      </mesh>
      <pointLight color={color} intensity={0.3} distance={2} position={[0, 0, 0.5]} />
    </group>
  )
}

export function CharacterModel({ characterId, position = [0, 0, 0], talking = false }: Props) {
  const char = characters[characterId]
  const color = char?.color ?? '#4FC3F7'
  const gender = char?.gender ?? 'male'
  const videoSrc = gender === 'male' ? `${BASE_URL}videos/boy.mp4` : `${BASE_URL}videos/girl.mp4`

  return (
    <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.15}>
      <group position={position}>
        <VideoCharacter src={videoSrc} color={color} talking={talking} />
      </group>
    </Float>
  )
}
