import { useState, useRef } from 'react'
import { useSettingsStore } from '@/store'
import { Button } from './Button'
import { KeyboardShortcuts } from './KeyboardShortcuts'
import { FONT_OPTIONS, MAX_VIDEO_SIZE, MAX_ANIMATION_SIZE } from '@/utils/constants'

interface Props {
  onBack: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px', borderRadius: '8px',
  background: '#1a1a2e', color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)',
}

const labelStyle: React.CSSProperties = { color: '#aaa', fontSize: '13px' }

const removeBtn: React.CSSProperties = {
  background: 'rgba(229,115,115,0.15)', border: '1px solid #E57373',
  color: '#E57373', padding: '8px 12px', borderRadius: '8px',
  cursor: 'pointer', fontSize: '13px',
}

const rowStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

function FileUploadRow({
  label, accept, currentUrl, onUpload, onRemove, maxSize,
}: {
  label: string
  accept: string
  currentUrl: string
  onUpload: (url: string) => void
  onRemove: () => void
  maxSize: number
}) {
  const ref = useRef<HTMLInputElement>(null)
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > maxSize) {
      alert(`حجم الملف كبير جداً. الحد الأقصى: ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => onUpload(reader.result as string)
    reader.readAsDataURL(file)
  }
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
        <input ref={ref} type="file" accept={accept} onChange={handleFile} style={{ display: 'none' }} />
        <Button variant="secondary" onClick={() => ref.current?.click()}>
          {currentUrl ? 'تغيير' : 'رفع ملف'}
        </Button>
        {currentUrl && <button onClick={onRemove} style={removeBtn}>إزالة</button>}
      </div>
      {currentUrl && <div style={{ color: '#81C784', fontSize: '12px', marginTop: '4px' }}>✓ تم الرفع</div>}
    </div>
  )
}

const TABS = ['الصوت', 'العرض', 'الخطوط', 'الفيديو', 'عام'] as const
type Tab = (typeof TABS)[number]

export function SettingsPanel({ onBack }: Props) {
  const s = useSettingsStore()
  const [tab, setTab] = useState<Tab>('الصوت')
  const [showShortcuts, setShowShortcuts] = useState(false)

  const tabBar = (
    <div style={{
      display: 'flex', gap: '4px', flexShrink: 0, flexWrap: 'wrap',
      justifyContent: 'center', marginBottom: '8px',
    }}>
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          style={{
            padding: '8px 18px', borderRadius: '20px', border: 'none',
            background: tab === t ? '#4FC3F7' : 'rgba(255,255,255,0.08)',
            color: tab === t ? '#0a0a1a' : '#aaa',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )

  const content = () => {
    switch (tab) {
      case 'الصوت':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={rowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={labelStyle}>الموسيقى الخلفية</label>
                <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>
                  {Math.round(s.bgmVolume * 100)}%
                </span>
              </div>
              <input type="range" min={0} max={2} step={0.05} value={s.bgmVolume}
                onChange={(e) => s.setBgmVolume(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={rowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={labelStyle}>المؤثرات الصوتية</label>
                <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>
                  {Math.round(s.sfxVolume * 100)}%
                </span>
              </div>
              <input type="range" min={0} max={2} step={0.05} value={s.sfxVolume}
                onChange={(e) => s.setSfxVolume(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={rowStyle}>
              <FileUploadRow
                label="موسيقى خلفية مخصصة"
                accept="audio/*"
                currentUrl={s.customBgUrl}
                onUpload={s.setCustomBgUrl}
                onRemove={() => s.setCustomBgUrl('')}
                maxSize={MAX_VIDEO_SIZE}
              />
            </div>
          </div>
        )

      case 'العرض':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={rowStyle}>
              <label style={labelStyle}>لون الخلفية</label>
              <input type="color" value={s.bgColor}
                onChange={(e) => s.setBgColor(e.target.value)}
                style={{ ...inputStyle, padding: '4px', height: '40px' }} />
            </div>
            <div style={rowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={labelStyle}>سطوع الخلفية</label>
                <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>
                  {Math.round(s.bgBrightness * 100)}%
                </span>
              </div>
              <input type="range" min={0.1} max={2} step={0.05} value={s.bgBrightness}
                onChange={(e) => s.setBgBrightness(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={rowStyle}>
              <FileUploadRow
                label="خلفية متحركة (GIF/فيديو)"
                accept="video/*,image/gif"
                currentUrl={s.bgAnimationUrl}
                onUpload={s.setBgAnimationUrl}
                onRemove={() => s.setBgAnimationUrl('')}
                maxSize={MAX_ANIMATION_SIZE}
              />
              {s.bgAnimationUrl && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={labelStyle}>سطوع الخلفية المتحركة</label>
                    <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>
                      {Math.round(s.bgAnimationBrightness * 100)}%
                    </span>
                  </div>
                  <input type="range" min={0} max={1} step={0.05} value={s.bgAnimationBrightness}
                    onChange={(e) => s.setBgAnimationBrightness(+e.target.value)} style={{ width: '100%' }} />
                </div>
              )}
            </div>
            <div style={rowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={labelStyle}>نصف قطر الحدود</label>
                <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>{s.borderRadius}px</span>
              </div>
              <input type="range" min={0} max={32} step={1} value={s.borderRadius}
                onChange={(e) => s.setBorderRadius(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={rowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={labelStyle}>سماكة الحدود</label>
                <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>{s.borderWidth}px</span>
              </div>
              <input type="range" min={0} max={6} step={1} value={s.borderWidth}
                onChange={(e) => s.setBorderWidth(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>لون الحدود</label>
              <input type="color" value={s.borderColor}
                onChange={(e) => s.setBorderColor(e.target.value)}
                style={{ ...inputStyle, padding: '4px', height: '40px' }} />
            </div>
          </div>
        )

      case 'الخطوط':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={rowStyle}>
              <label style={labelStyle}>نوع الخط</label>
              <select value={s.fontFamily}
                onChange={(e) => s.setFontFamily(e.target.value)} style={inputStyle}>
                {FONT_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
              </select>
            </div>
            <div style={rowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={labelStyle}>حجم الخط</label>
                <span style={{ color: '#4FC3F7', fontSize: '14px', fontWeight: 700 }}>{s.fontSize}px</span>
              </div>
              <input type="range" min={12} max={28} step={1} value={s.fontSize}
                onChange={(e) => s.setFontSize(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>لون الخط</label>
              <input type="color" value={s.fontColor}
                onChange={(e) => s.setFontColor(e.target.value)}
                style={{ ...inputStyle, padding: '4px', height: '40px' }} />
            </div>
          </div>
        )

      case 'الفيديو':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={rowStyle}>
              <FileUploadRow
                label="فيديو الشخصية الذكور (بديل boy.mp4)"
                accept="video/*"
                currentUrl={s.customBoyVideoUrl}
                onUpload={s.setCustomBoyVideoUrl}
                onRemove={() => s.setCustomBoyVideoUrl('')}
                maxSize={MAX_VIDEO_SIZE}
              />
            </div>
            <div style={rowStyle}>
              <FileUploadRow
                label="فيديو الشخصية الأنثى (بديل girl.mp4)"
                accept="video/*"
                currentUrl={s.customGirlVideoUrl}
                onUpload={s.setCustomGirlVideoUrl}
                onRemove={() => s.setCustomGirlVideoUrl('')}
                maxSize={MAX_VIDEO_SIZE}
              />
            </div>
          </div>
        )

      case 'عام':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={rowStyle}>
              <label style={labelStyle}>جودة الرسوم</label>
              <select value={s.qualityPreset}
                onChange={(e) => s.setQuality(e.target.value as 'low' | 'medium' | 'high')}
                style={inputStyle}>
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>
            </div>
            <div style={rowStyle}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', cursor: 'pointer' }}>
                <input type="checkbox" checked={s.accessibilityMode}
                  onChange={() => s.toggleAccessibility()} />
                وضع الوصول السهل
              </label>
            </div>
            <div style={rowStyle}>
              <Button onClick={() => setShowShortcuts(true)} style={{ width: '100%', textAlign: 'center' }}>
                اختصارات لوحة المفاتيح
              </Button>
            </div>
            <div style={rowStyle}>
              <Button variant="secondary" onClick={s.resetAll} style={{ width: '100%', textAlign: 'center' }}>
                إعادة الإعدادات الافتراضية
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100%', padding: '20px 16px',
      position: 'relative', zIndex: 1,
    }}>
      <h2 style={{ fontSize: '26px', margin: '0 0 12px', flexShrink: 0 }}>الإعدادات</h2>
      {tabBar}
      <div style={{ flex: 1, overflow: 'auto', width: '100%', maxWidth: '480px' }}>
        {content()}
      </div>
      <div style={{ marginTop: '12px', flexShrink: 0 }}>
        <Button variant="ghost" onClick={onBack}>الرجوع</Button>
      </div>
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}
