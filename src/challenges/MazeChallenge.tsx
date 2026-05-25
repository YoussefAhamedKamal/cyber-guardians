import { useState, useCallback } from 'react'
import type { MazeCell } from '@/types'
import { Button } from '@/components/ui'
import { audio } from '@/systems/ProceduralAudio'

interface Props {
  grid: MazeCell[][]
  onComplete: (score: number) => void
}

export function MazeChallenge({ grid, onComplete }: Props) {
  const [player, setPlayer] = useState({ x: 0, y: 0 })
  const [caught, setCaught] = useState(0)
  const [totalMalware, setTotal] = useState(() =>
    grid.flat().filter((c) => c.isMalware).length
  )
  const [done, setDone] = useState(false)

  const cell = grid[player.y]?.[player.x]
  const isAtEndpoint = cell?.isEndpoint

  const move = useCallback((dx: number, dy: number) => {
    if (done) return
    setPlayer((prev) => {
      const nx = prev.x + dx
      const ny = prev.y + dy
      const target = grid[ny]?.[nx]
      if (!target || target.isWall) return prev
      if (target.isMalware) {
        audio.playCorrect()
        setCaught((c) => {
          const next = c + 1
          if (next >= totalMalware && target.isEndpoint) {
            setTimeout(() => setDone(true), 300)
          }
          return next
        })
      }
      if (target.isEndpoint) {
        audio.playLevelUp()
        setTimeout(() => setDone(true), 300)
      }
      return { x: nx, y: ny }
    })
  }, [done, grid, totalMalware])

  const size = grid.length

  if (done) {
    const score = totalMalware > 0 ? Math.round((caught / totalMalware) * 100) : 100
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦠</div>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>تم التعقب والعزل!</h3>
        <p style={{ color: '#aaa', marginBottom: '8px' }}>ملفات خبيثة مُعزلة: {caught} من {totalMalware}</p>
        <Button onClick={() => onComplete(score)}>متابعة</Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ color: '#888', fontSize: '14px' }}>
        🎯 اصطد الملفات الخبيثة (🔴) وصولاً لنقطة الأمان (🟢)
      </div>
      <div style={{ display: 'grid', gap: '4px', direction: 'ltr', gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {grid.map((row, y) =>
          row.map((c, x) => {
            const isPlayer = player.x === x && player.y === y
            return (
              <div key={`${x}-${y}`} style={{
                width: '50px', height: '50px', borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                background: c.isWall ? '#333' : isPlayer ? '#4FC3F7' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${c.isEndpoint ? '#81C784' : isPlayer ? '#4FC3F7' : 'transparent'}`,
              }}>
                {isPlayer ? '🧑‍💻' : c.isWall ? '🧱' : c.isEndpoint ? '🟢' : c.isMalware ? '🔴' : ''}
              </div>
            )
          })
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
          <button onClick={() => move(0, -1)} style={arrowStyle}>↑</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
          <button onClick={() => move(-1, 0)} style={arrowStyle}>←</button>
          <button onClick={() => move(1, 0)} style={arrowStyle}>→</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
          <button onClick={() => move(0, 1)} style={arrowStyle}>↓</button>
        </div>
      </div>
    </div>
  )
}

const arrowStyle: React.CSSProperties = {
  width: '56px', height: '56px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '24px', cursor: 'pointer',
}
