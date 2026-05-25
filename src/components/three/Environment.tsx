import { useMemo } from 'react'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function StoneFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#15151e" metalness={0.4} roughness={0.9} />
    </mesh>
  )
}

function CastleArch() {
  const stoneMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2a', metalness: 0.5, roughness: 0.8,
  }), [])
  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4FC3F7', emissive: '#4FC3F7', emissiveIntensity: 0.08, transparent: true, opacity: 0.15,
  }), [])

  return (
    <group position={[0, 0, -3]}>
      {/* Main wall */}
      <mesh position={[0, 1.5, 0]} material={stoneMat}>
        <planeGeometry args={[6, 3]} />
      </mesh>
      {/* Arch opening */}
      <mesh position={[0, 1.0, 0.05]} material={glowMat}>
        <planeGeometry args={[2, 1.8]} />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-1.8, 1.3, 0]} material={stoneMat}>
        <boxGeometry args={[0.4, 2.2, 0.4]} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[1.8, 1.3, 0]} material={stoneMat}>
        <boxGeometry args={[0.4, 2.2, 0.4]} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, 2.4, 0]} material={stoneMat}>
        <boxGeometry args={[4, 0.2, 0.4]} />
      </mesh>
      {/* Battlements on top */}
      {[-2.2, -1.2, 0, 1.2, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 2.6, 0]} material={stoneMat}>
          <boxGeometry args={[0.4, 0.25, 0.3]} />
        </mesh>
      ))}
      {/* Torch glow on pillars */}
      <pointLight position={[-1.8, 0.8, 0.5]} color="#FF8C42" intensity={0.4} distance={2} />
      <pointLight position={[1.8, 0.8, 0.5]} color="#FF8C42" intensity={0.4} distance={2} />
    </group>
  )
}

function CyberpunkCity() {
  const buildingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a1a', metalness: 0.8, roughness: 0.3,
  }), [])

  const layouts = [
    { x: -4, h: 2.5, w: 0.8 },
    { x: -2.8, h: 3.2, w: 0.6 },
    { x: 2.8, h: 3.8, w: 0.7 },
    { x: 4, h: 2.8, w: 0.9 },
    { x: -3.4, h: 1.8, w: 0.5 },
    { x: 3.6, h: 2.0, w: 0.5 },
  ]

  return (
    <group position={[0, 0, -5]}>
      {layouts.map((b, i) => {
        const windows: React.ReactNode[] = []
        const cols = Math.max(1, Math.floor(b.w / 0.15) - 1)
        const rows = Math.max(1, Math.floor(b.h / 0.3) - 1)
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const lit = Math.random() > 0.3
            windows.push(
              <mesh key={`${i}-${r}-${c}`} position={[
                -b.w / 2 + (c + 0.5) * (b.w / (cols + 1)),
                -b.h / 2 + (r + 0.5) * (b.h / (rows + 1)),
                0.05,
              ]}>
                <planeGeometry args={[0.04, 0.08]} />
                <meshStandardMaterial
                  color={lit ? '#4FC3F7' : '#1a1a3e'}
                  emissive={lit ? '#4FC3F7' : '#000'}
                  emissiveIntensity={lit ? 0.5 : 0}
                />
              </mesh>
            )
          }
        }
        return (
          <mesh key={i} position={[b.x, b.h / 2, 0]} material={buildingMat}>
            <boxGeometry args={[b.w, b.h, 0.01]} />
            {windows}
          </mesh>
        )
      })}
      {/* Neon glow */}
      <pointLight position={[-3, 2, 0.5]} color="#CE93D8" intensity={0.2} distance={4} />
      <pointLight position={[3, 2, 0.5]} color="#4FC3F7" intensity={0.2} distance={4} />
    </group>
  )
}

function EmberParticles({ count = 40 }) {
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5
      pos[i * 3 + 1] = Math.random() * 2.5
      pos[i * 3 + 2] = -2.5 + Math.random() * 1.5
      siz[i] = 0.02 + Math.random() * 0.03
    }
    return [pos, siz]
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} color="#FF8C42" transparent opacity={0.6}
        blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false}
      />
    </points>
  )
}

export function Environment() {
  return (
    <>
      <Stars radius={25} depth={20} count={500} factor={4} saturation={0.3} fade speed={0.3} />
      <CyberpunkCity />
      <CastleArch />
      <StoneFloor />
      <EmberParticles />
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.15} color="#1a1a3e" />
      <directionalLight position={[-3, 5, 2]} intensity={0.3} color="#FF8C42" />
      <directionalLight position={[3, 2, -2]} intensity={0.15} color="#4FC3F7" />
      <pointLight position={[0, 0.5, -2]} intensity={0.2} color="#4FC3F7" distance={3} />
      <fog attach="fog" args={['#0a0a1a', 4, 10]} />
    </>
  )
}
