import { useState, useCallback, useEffect, useRef } from 'react'
import { useResponsive } from '@/hooks'
import { Button, ProgressBar, DialogueBox, BackgroundVideo } from '@/components/ui'
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
    background: '#0a0a1a',
    color: '#fff',
    fontFamily: "'Segoe UI', 'Cairo', sans-serif",
    direction: 'rtl',
  }

  const titleGradient: React.CSSProperties = {
    background: 'linear-gradient(135deg, #4FC3F7, #CE93D8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      settings.setCustomBgUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
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
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: '20px', padding: '32px',
          position: 'relative', zIndex: 1,
        }}>
          <h2 style={{ fontSize: '32px', margin: 0 }}>الإعدادات</h2>
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '14px' }}>الصوت الخلفي: {Math.round(settings.bgmVolume * 100)}%</label>
              <input type="range" min={0} max={1} step={0.1} value={settings.bgmVolume}
                onChange={(e) => settings.setBgmVolume(+e.target.value)}
                style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '14px' }}>المؤثرات: {Math.round(settings.sfxVolume * 100)}%</label>
              <input type="range" min={0} max={1} step={0.1} value={settings.sfxVolume}
                onChange={(e) => settings.setSfxVolume(+e.target.value)}
                style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '14px' }}>جودة الرسوم</label>
              <select value={settings.qualityPreset}
                onChange={(e) => settings.setQuality(e.target.value as 'low' | 'medium' | 'high')}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '14px' }}>حجم الخط: {settings.fontSize}px</label>
              <input type="range" min={12} max={28} step={1} value={settings.fontSize}
                onChange={(e) => settings.setFontSize(+e.target.value)}
                style={{ width: '100%' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa' }}>
              <input type="checkbox" checked={settings.accessibilityMode}
                onChange={() => settings.toggleAccessibility()} />
              وضع الوصول السهل
            </label>
            <div>
              <label style={{ color: '#aaa', fontSize: '14px' }}>موسيقى خلفية مخصصة</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                <input
                  ref={fileInputRef}
                  type="file" accept="audio/*"
                  onChange={handleBgUpload}
                  style={{ display: 'none' }}
                />
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  {settings.customBgUrl ? 'تغيير الملف' : 'رفع ملف'}
                </Button>
                {settings.customBgUrl && (
                  <button
                    onClick={() => settings.setCustomBgUrl('')}
                    style={{
                      background: 'rgba(229,115,115,0.15)', border: '1px solid #E57373',
                      color: '#E57373', padding: '8px 12px', borderRadius: '8px',
                      cursor: 'pointer', fontSize: '13px',
                    }}
                  >
                    إزالة
                  </button>
                )}
              </div>
              {settings.customBgUrl && (
                <div style={{ color: '#81C784', fontSize: '12px', marginTop: '4px' }}>
                  ✓ موسيقى مرفوعة
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={settings.resetAll}>إعادة الإعدادات الافتراضية</Button>
          </div>
          <Button variant="ghost" onClick={() => setScreen('menu')}>الرجوع</Button>
        </div>
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
