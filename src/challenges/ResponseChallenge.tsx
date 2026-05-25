import { useState } from 'react'
import type { IncidentStep } from '@/types'
import { Button } from '@/components/ui'
import { audio } from '@/systems/ProceduralAudio'

interface Props {
  steps: IncidentStep[]
  onComplete: (score: number) => void
}

export function ResponseChallenge({ steps, onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const step = steps[index]
  if (!step) {
    const score = Math.round((correct / steps.length) * 100)
    return (
      <div style={{ textAlign: 'center', padding: '32px', direction: 'rtl' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>تمت الاستجابة للاختراق!</h3>
        <p style={{ color: '#aaa', marginBottom: '16px' }}>إجابات صحيحة: {correct} من {steps.length}</p>
        <Button onClick={() => onComplete(score)}>متابعة</Button>
      </div>
    )
  }

  const handleSelect = (idx: number) => {
    if (showResult) return
    setSelected(idx)
    setShowResult(true)
    if (idx === step.correctIndex) { setCorrect((c) => c + 1); audio.playCorrect() } else { audio.playWrong() }
  }

  const handleNext = () => {
    setSelected(null)
    setShowResult(false)
    setIndex((i) => i + 1)
  }

  return (
    <div style={{ padding: '24px', direction: 'rtl', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>
        خطوة {index + 1} من {steps.length}
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
        padding: '20px', marginBottom: '20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '18px', lineHeight: 1.6 }}>{step.question}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {step.options.map((opt, idx) => {
          let bg = 'rgba(255,255,255,0.03)'
          let border = 'rgba(255,255,255,0.1)'
          if (showResult && idx === step.correctIndex) {
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
                padding: '14px 18px', borderRadius: '10px', border: `1px solid ${border}`,
                background: bg, color: '#fff', cursor: showResult ? 'default' : 'pointer',
                fontSize: '15px', textAlign: 'right', lineHeight: 1.4,
              }}
            >
              {showResult && idx === step.correctIndex && '✅ '}
              {showResult && idx === selected && idx !== step.correctIndex && '❌ '}
              {opt}
            </button>
          )
        })}
      </div>
      {showResult && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(79,195,247,0.1)', borderRadius: '8px',
            padding: '12px', marginBottom: '12px', fontSize: '14px', color: '#4FC3F7',
          }}>
            {step.explanation}
          </div>
          <Button onClick={handleNext}>
            {index < steps.length - 1 ? 'الخطوة التالية' : 'إظهار النتيجة'}
          </Button>
        </div>
      )}
    </div>
  )
}
