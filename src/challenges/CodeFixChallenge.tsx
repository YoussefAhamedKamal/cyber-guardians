import { useState } from 'react'
import type { VulnCode } from '@/types'
import { Button } from '@/components/ui'
import { audio } from '@/systems/ProceduralAudio'

interface Props {
  codes: VulnCode[]
  onComplete: (score: number) => void
}

export function CodeFixChallenge({ codes, onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const code = codes[index]
  if (!code) {
    const score = Math.round((correct / codes.length) * 100)
    return (
      <div style={{ textAlign: 'center', padding: '32px', direction: 'rtl' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💻</div>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>تم إصلاح الثغرات!</h3>
        <p style={{ color: '#aaa', marginBottom: '16px' }}>أصلحت {correct} من {codes.length} ثغرات</p>
        <Button onClick={() => onComplete(score)}>متابعة</Button>
      </div>
    )
  }

  const handleSelect = (idx: number) => {
    if (showResult) return
    setSelected(idx)
    setShowResult(true)
    if (idx === code.correctIndex) { setCorrect((c) => c + 1); audio.playCorrect() } else { audio.playWrong() }
  }

  const handleNext = () => {
    setSelected(null)
    setShowResult(false)
    setIndex((i) => i + 1)
  }

  return (
    <div style={{ padding: '24px', direction: 'rtl', maxWidth: '550px', margin: '0 auto' }}>
      <div style={{ color: '#888', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
        ثغرة {index + 1} من {codes.length}: {code.vulnerability}
      </div>
      <div style={{
        background: '#1a1a2e', borderRadius: '12px', padding: '16px',
        marginBottom: '20px', direction: 'ltr', fontFamily: 'monospace',
        fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', overflow: 'auto',
      }}>
        <div style={{ color: '#4FC3F7', fontSize: '12px', marginBottom: '8px' }}>{code.language}</div>
        {code.code}
      </div>
      <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '12px' }}>
        أي قطعة الكود التالية هي الإصلاح الصحيح؟
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {code.options.map((opt, idx) => {
          let bg = 'rgba(255,255,255,0.03)'
          let border = 'rgba(255,255,255,0.1)'
          if (showResult && idx === code.correctIndex) {
            bg = 'rgba(129,199,132,0.15)'
            border = '#81C784'
          } else if (showResult && idx === selected) {
            bg = 'rgba(229,115,115,0.15)'
            border = '#E57373'
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              style={{
                padding: '12px 16px', borderRadius: '10px', border: `1px solid ${border}`,
                background: bg, color: '#fff', cursor: showResult ? 'default' : 'pointer',
                fontSize: '13px', fontFamily: 'monospace', direction: 'ltr', textAlign: 'left',
                lineHeight: 1.4,
              }}
            >
              {showResult && idx === code.correctIndex && '✅ '}
              {showResult && idx === selected && idx !== code.correctIndex && '❌ '}
              {opt}
            </button>
          )
        })}
      </div>
      {showResult && (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={handleNext}>
            {index < codes.length - 1 ? 'الثغرة التالية' : 'إظهار النتيجة'}
          </Button>
        </div>
      )}
    </div>
  )
}
