import { useState, useCallback, useEffect } from 'react'
import { useResponsive } from '@/hooks'
import { Button, ProgressBar, DialogueBox, BackgroundVideo, SettingsPanel } from '@/components/ui'
import { GameCanvas, Environment } from '@/components/three'
import { useGameStore, useSettingsStore } from '@/store'
import { levels } from '@/data'
import { ChallengeRenderer } from '@/challenges'
import { audio } from '@/systems/ProceduralAudio'

type Screen = 'menu' | 'levelSelect' | 'dialogue' | 'gameplay' | 'settings' | 'victory'

export function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const responsive = useResponsive()
  const game = useGameStore()
  const settings = useSettingsStore()

  const level = levels.find((l) => l.id === game.currentLevel)!
  if (!level) return null

  useEffect(() => {
    if (settings.muted || settings.bgmVolume <= 0) return
    let stop: () => void
    if (settings.customBgUrl) {
      stop = audio.playFileBg(settings.customBgUrl, settings.bgmVolume)
    } else {
      stop = audio.playBgLoop(settings.bgmVolume)
    }
    return () => stop()
  }, [settings.bgmVolume, settings.muted, settings.customBgUrl])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        settings.toggleMute()
      }
      if (e.key === 'Escape') {
        if (screen !== 'menu') {
          e.preventDefault()
          setScreen('menu')
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [settings, screen])

  const handleStart = useCallback(() => {
    audio.playClick()
    game.startGame()
    setScreen('levelSelect')
  }, [game])

  const handleLevelSelect = useCallback((id: number) => {
    audio.playClick()
    game.setLevel(id as 1 | 2 | 3 | 4 | 5 | 6 | 7)
    setDialogueIndex(0)
    setScreen('dialogue')
  }, [game])

  const handleDialogueComplete = useCallback(() => {
    if (dialogueIndex === 0) {
      setDialogueIndex(1)
      setScreen('gameplay')
    } else {
      if (game.currentLevel === 7 && game.completedLevels.has(7)) {
        setScreen('victory')
      } else {
        setScreen('levelSelect')
      }
      setDialogueIndex(0)
    }
  }, [dialogueIndex, game])

  const handleChallengeComplete = useCallback((score: number) => {
    audio.playLevelUp()
    game.completeLevel(game.currentLevel, score)
    setDialogueIndex(1)
    setScreen('dialogue')
  }, [game])

  const containerStyle: React.CSSProperties = {
    width: responsive.width,
    height: responsive.height,
    position: 'relative',
    overflow: 'hidden',
    background: settings.bgColor,
    color: settings.fontColor,
    fontFamily: `'${settings.fontFamily}', 'Segoe UI', sans-serif`,
    direction: 'rtl',
    '--custom-brightness': settings.bgBrightness,
    '--custom-border-radius': `${settings.borderRadius}px`,
    '--custom-border-color': settings.borderColor,
    '--custom-border-width': `${settings.borderWidth}px`,
  } as React.CSSProperties & Record<string, string | number>

  const titleGradient: React.CSSProperties = {
    background: 'linear-gradient(135deg, #4FC3F7, #CE93D8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  return (
    <div style={containerStyle}>
      <BackgroundVideo blur={2} overlayOpacity={0.7} />
      {screen === 'menu' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: '24px',
          position: 'relative', zIndex: 1,
        }}>
          <h1 style={{ fontSize: '48px', margin: 0, ...titleGradient }}>Cyber Guardians</h1>
          <p style={{ fontSize: '20px', color: '#888', margin: 0 }}>حراس الأمن السيبراني</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button onClick={handleStart}>بدء اللعبة</Button>
            <Button variant="secondary" onClick={() => setScreen('settings')}>الإعدادات</Button>
          </div>
        </div>
      )}

      {screen === 'levelSelect' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: '20px', padding: '32px',
          position: 'relative', zIndex: 1,
        }}>
          <h2 style={{ fontSize: '32px', margin: 0 }}>اختر المستوى</h2>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <ProgressBar value={game.getProgress()} label="التقدم العام" />
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
            width: '100%', maxWidth: '600px',
          }}>
            {levels.map((l) => {
              const unlocked = l.id === 1 || game.completedLevels.has((l.id - 1) as 1 | 2 | 3 | 4 | 5 | 6)
              const done = game.completedLevels.has(l.id)
              return (
                <button
                  key={l.id}
                  disabled={!unlocked}
                  onClick={() => unlocked && handleLevelSelect(l.id)}
                  style={{
                    padding: '20px', borderRadius: '12px', border: '1px solid',
                    borderColor: done ? '#4FC3F7' : unlocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    background: done ? 'rgba(79,195,247,0.1)' : unlocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    color: unlocked ? '#fff' : '#444',
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    fontSize: '14px', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{done ? '✅' : unlocked ? `0${l.id}` : '🔒'}</div>
                  <div style={{ fontWeight: 700 }}>{l.title}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{l.subtitle}</div>
                </button>
              )
            })}
          </div>
          <Button variant="ghost" onClick={() => setScreen('menu')}>الرجوع</Button>
        </div>
      )}

      {screen === 'dialogue' && (
        <div style={{ height: '100%', position: 'relative', background: '#0a0a1a' }}>
          <GameCanvas>
            <Environment />
          </GameCanvas>
          <DialogueBox
            lines={dialogueIndex === 0 ? level.intro : level.outro}
            onComplete={handleDialogueComplete}
          />
        </div>
      )}

      {screen === 'gameplay' && (
        <div style={{
          display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            textAlign: 'center', padding: '12px',
            background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <h2 style={{ fontSize: '20px', margin: 0, ...titleGradient }}>{level.title}</h2>
            <div style={{ color: '#888', fontSize: '13px' }}>{level.subtitle}</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <ChallengeRenderer level={level} onComplete={handleChallengeComplete} />
          </div>
        </div>
      )}

      {screen === 'settings' && (
        <SettingsPanel onBack={() => setScreen('menu')} />
      )}

      {screen === 'victory' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: '24px',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ fontSize: '64px' }}>🏆</div>
          <h1 style={{ fontSize: '36px', margin: 0 }}>تهانينا!</h1>
          <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '400px', textAlign: 'center' }}>
            لقد أتممت جميع المستويات. أنت الآن حارس أمن سيبراني حقيقي!
          </p>
          <p style={{ fontSize: '24px', color: '#4FC3F7' }}>النقاط: {game.totalScore}</p>
          <Button onClick={() => { game.resetProgress(); setScreen('menu') }}>
            لعب مرة أخرى
          </Button>
        </div>
      )}
    </div>
  )
}
