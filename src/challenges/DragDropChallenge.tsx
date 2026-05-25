import { useState } from 'react'
import type { FirewallPort } from '@/types'
import { Button } from '@/components/ui'
import { audio } from '@/systems/ProceduralAudio'

interface Props {
  ports: FirewallPort[]
  onComplete: (score: number) => void
}

export function DragDropChallenge({ ports, onComplete }: Props) {
  const [portList, setPortList] = useState(
    ports.map((p) => ({ ...p }))
  )
  const [done, setDone] = useState(false)

  const togglePort = (id: string) => {
    if (done) return
    audio.playClick()
    setPortList((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: p.status === 'open' ? 'closed' as const : 'open' as const } : p)
    )
  }

  const handleSubmit = () => {
    audio.playLevelUp()
    let score = 0
    portList.forEach((p) => {
      if (p.isCritical && p.status === 'open') score += 50
      if (!p.isCritical && p.status === 'closed') score += 50
    })
    setDone(true)
    onComplete(score)
  }

  if (done) {
    const openCritical = portList.filter((p) => p.isCritical && p.status === 'open').length
    const closedNonCritical = portList.filter((p) => !p.isCritical && p.status === 'closed').length
    const total = portList.length
    const score = Math.round(((openCritical + closedNonCritical) / total) * 100)
    return (
      <div style={{ textAlign: 'center', padding: '32px', direction: 'rtl' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', color: '#4FC3F7' }}>◈</div>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>تم إعداد الجدار الناري!</h3>
        <p style={{ color: '#aaa', marginBottom: '4px' }}>منافذ أساسية مفتوحة: {openCritical}</p>
        <p style={{ color: '#aaa', marginBottom: '16px' }}>منافذ غير ضرورية مغلقة: {closedNonCritical}</p>
        <Button onClick={() => onComplete(score)}>متابعة</Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', direction: 'rtl', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
        ↑ اضغط على المنفذ لتغيير حالته (افتح/أغلق). المنافذ الأساسية (<span style={{color:'#4FC3F7'}}>◆</span>) يجب أن تبقى مفتوحة.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {portList.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePort(p.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: '10px', border: '1px solid',
              borderColor: p.isCritical ? '#4FC3F7' : 'rgba(255,255,255,0.1)',
              background: p.status === 'open'
                ? `rgba(79,195,247,${p.isCritical ? 0.15 : 0.05})`
                : 'rgba(229,115,115,0.1)',
              color: '#fff', cursor: 'pointer', fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: p.isCritical ? '#4FC3F7' : '#888' }}>
                {p.isCritical ? '◆' : '⚡'}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div>{p.name}</div>
                <div style={{ color: '#888', fontSize: '12px' }}>Port {p.port}</div>
              </div>
            </div>
            <div style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
              background: p.status === 'open' ? 'rgba(79,195,247,0.2)' : 'rgba(229,115,115,0.2)',
              color: p.status === 'open' ? '#4FC3F7' : '#E57373',
            }}>
              <span style={{ color: p.status === 'open' ? '#81C784' : '#E57373', marginLeft: '4px' }}>●</span>
              {p.status === 'open' ? 'مفتوح' : 'مغلق'}
            </div>
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button onClick={handleSubmit}>تطبيق الجدار الناري</Button>
      </div>
    </div>
  )
}
