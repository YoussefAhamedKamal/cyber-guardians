import { useState, useMemo } from 'react'
import type { PasswordRule } from '@/types'
import { Button } from '@/components/ui'
import { audio } from '@/systems/ProceduralAudio'

interface Props {
  rules: PasswordRule[]
  onComplete: (score: number) => void
}

function evaluatePassword(pw: string, rules: PasswordRule[]): PasswordRule[] {
  return rules.map((r) => {
    switch (r.type) {
      case 'length': return { ...r, satisfied: pw.length >= 8 }
      case 'uppercase': return { ...r, satisfied: /[A-Z]/.test(pw) }
      case 'number': return { ...r, satisfied: /[0-9]/.test(pw) }
      case 'symbol': return { ...r, satisfied: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw) }
      default: return r
    }
  })
}

export function BuildChallenge({ rules, onComplete }: Props) {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)

  const evaluated = useMemo(() => evaluatePassword(password, rules), [password, rules])
  const satisfied = evaluated.filter((r) => r.satisfied).length
  const allSatisfied = satisfied === rules.length

  const strength = allSatisfied ? 'قوية' : satisfied >= 2 ? 'متوسطة' : 'ضعيفة'
  const strengthColor = allSatisfied ? '#81C784' : satisfied >= 2 ? '#FFB74D' : '#E57373'

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', direction: 'rtl' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', color: '#81C784' }}>🗝</div>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>تم بناء كلمة المرور!</h3>
        <p style={{ color: '#aaa', marginBottom: '16px' }}>القوة: {satisfied}/{rules.length} معايير</p>
        <Button onClick={() => onComplete(Math.round((satisfied / rules.length) * 100))}>متابعة</Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', direction: 'rtl', maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: strengthColor, fontWeight: 700 }}>القوة: {strength}</div>
      </div>
      <input
        type="text"
        dir="ltr"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="اكتب كلمة مرور قوية..."
        style={{
          width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '18px', textAlign: 'center',
          direction: 'ltr', marginBottom: '20px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {evaluated.map((r) => (
          <div key={r.type} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
            borderRadius: '8px', background: r.satisfied ? 'rgba(129,199,132,0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${r.satisfied ? '#81C784' : 'rgba(255,255,255,0.08)'}`,
          }}>
            <span style={{ fontSize: '18px', color: r.satisfied ? '#81C784' : '#E57373' }}>
              {r.satisfied ? '✓' : '✗'}
            </span>
            <span style={{ color: r.satisfied ? '#81C784' : '#888' }}>{r.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button onClick={() => { setPassword(''); setDone(false) }} variant="ghost">مسح</Button>
        <Button onClick={() => { audio.playLevelUp(); setDone(true); }} disabled={!allSatisfied}
          style={{ opacity: allSatisfied ? 1 : 0.5 }}>
          {allSatisfied ? 'تأكيد كلمة المرور' : 'حقق كل المعايير أولاً'}
        </Button>
      </div>
    </div>
  )
}
