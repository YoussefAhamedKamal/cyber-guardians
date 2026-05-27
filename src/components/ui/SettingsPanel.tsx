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

const labelStyle: React.CSSProperties = { color: '#aaa', fontSize: '14px' }

const removeBtn: React.CSSProperties = {
  background: 'rgba(229,115,115,0.15)', border: '1px solid #E57373',
  color: '#E57373', padding: '8px 12px', borderRadius: '8px',
  cursor: 'pointer', fontSize: '13px',
}

type FileHandler = (url: string) => void

function FileUploadRow({
  label, accept, currentUrl, onUpload, onRemove, maxSize,
}: {
  label: string
  accept: string
  currentUrl: string
  onUpload: FileHandler
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
        <input
          ref={ref} type="file" accept={accept}
          onChange={handleFile} style={{ display: 'none' }}
        />
        <Button variant="secondary" onClick={() => ref.current?.click()}>
          {currentUrl ? 'تغيير' : 'رفع ملف'}
        </Button>
        {currentUrl && (
          <button onClick={onRemove} style={removeBtn}>إزالة</button>
        )}
      </div>
      {currentUrl && (
        <div style={{ color: '#81C784', fontSize: '12px', marginTop: '4px' }}>✓ تم الرفع</div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{
      color: '#4FC3F7', fontSize: '15px', fontWeight: 700,
      borderBottom: '1px solid rgba(79,195,247,0.2)',
      paddingBottom: '6px', marginTop: '8px',
    }}>
      {children}
    </div>
  )
}

export function SettingsPanel({ onBack }: Props) {
  const s = useSettingsStore()
  const [showShortcuts, setShowShortcuts] = useState(false)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start', height: '100%', gap: '12px', padding: '24px 32px',
      position: 'relative', zIndex: 1, overflow: 'auto',
    }}>
      <h2 style={{ fontSize: '28px', margin: 0, flexShrink: 0 }}>الإعدادات</h2>

      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        <SectionTitle>الصوت</SectionTitle>
        <div>
          <label style={labelStyle}>الموسيقى الخلفية: {Math.round(s.bgmVolume * 100)}%</label>
          <input type="range" min={0} max={2} step={0.05} value={s.bgmVolume}
            onChange={(e) => s.setBgmVolume(+e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>المؤثرات الصوتية: {Math.round(s.sfxVolume * 100)}%</label>
          <input type="range" min={0} max={2} step={0.05} value={s.sfxVolume}
            onChange={(e) => s.setSfxVolume(+e.target.value)} style={{ width: '100%' }} />
        </div>
        <FileUploadRow
          label="موسيقى خلفية مخصصة"
          accept="audio/*"
          currentUrl={s.customBgUrl}
          onUpload={s.setCustomBgUrl}
          onRemove={() => s.setCustomBgUrl('')}
          maxSize={MAX_VIDEO_SIZE}
        />

        <SectionTitle>الخطوط</SectionTitle>
        <div>
          <label style={labelStyle}>نوع الخط</label>
          <select value={s.fontFamily}
            onChange={(e) => s.setFontFamily(e.target.value)} style={inputStyle}>
            {FONT_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>حجم الخط: {s.fontSize}px</label>
          <input type="range" min={12} max={28} step={1} value={s.fontSize}
            onChange={(e) => s.setFontSize(+e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>لون الخط</label>
          <input type="color" value={s.fontColor}
            onChange={(e) => s.setFontColor(e.target.value)}
            style={{ ...inputStyle, padding: '4px', height: '40px' }} />
        </div>

        <SectionTitle>الحدود</SectionTitle>
        <div>
          <label style={labelStyle}>نصف قطر الحدود: {s.borderRadius}px</label>
          <input type="range" min={0} max={32} step={1} value={s.borderRadius}
            onChange={(e) => s.setBorderRadius(+e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>سماكة الحدود: {s.borderWidth}px</label>
          <input type="range" min={0} max={6} step={1} value={s.borderWidth}
            onChange={(e) => s.setBorderWidth(+e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>لون الحدود</label>
          <input type="color" value={s.borderColor}
            onChange={(e) => s.setBorderColor(e.target.value)}
            style={{ ...inputStyle, padding: '4px', height: '40px' }} />
        </div>

        <SectionTitle>الخلفية</SectionTitle>
        <div>
          <label style={labelStyle}>لون الخلفية</label>
          <input type="color" value={s.bgColor}
            onChange={(e) => s.setBgColor(e.target.value)}
            style={{ ...inputStyle, padding: '4px', height: '40px' }} />
        </div>
        <div>
          <label style={labelStyle}>سطوع الخلفية: {Math.round(s.bgBrightness * 100)}%</label>
          <input type="range" min={0.1} max={2} step={0.05} value={s.bgBrightness}
            onChange={(e) => s.setBgBrightness(+e.target.value)} style={{ width: '100%' }} />
        </div>
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
            <label style={labelStyle}>سطوع الخلفية المتحركة: {Math.round(s.bgAnimationBrightness * 100)}%</label>
            <input type="range" min={0} max={1} step={0.05} value={s.bgAnimationBrightness}
              onChange={(e) => s.setBgAnimationBrightness(+e.target.value)} style={{ width: '100%' }} />
          </div>
        )}

        <SectionTitle>فيديو الشخصيات</SectionTitle>
        <FileUploadRow
          label="فيديو الشخصية الذكور (boy)"
          accept="video/*"
          currentUrl={s.customBoyVideoUrl}
          onUpload={s.setCustomBoyVideoUrl}
          onRemove={() => s.setCustomBoyVideoUrl('')}
          maxSize={MAX_VIDEO_SIZE}
        />
        <FileUploadRow
          label="فيديو الشخصية الأنثى (girl)"
          accept="video/*"
          currentUrl={s.customGirlVideoUrl}
          onUpload={s.setCustomGirlVideoUrl}
          onRemove={() => s.setCustomGirlVideoUrl('')}
          maxSize={MAX_VIDEO_SIZE}
        />

        <SectionTitle>أخرى</SectionTitle>
        <div>
          <label style={labelStyle}>جودة الرسوم</label>
          <select value={s.qualityPreset}
            onChange={(e) => s.setQuality(e.target.value as 'low' | 'medium' | 'high')}
            style={inputStyle}>
            <option value="low">منخفضة</option>
            <option value="medium">متوسطة</option>
            <option value="high">عالية</option>
          </select>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa' }}>
          <input type="checkbox" checked={s.accessibilityMode}
            onChange={() => s.toggleAccessibility()} />
          وضع الوصول السهل
        </label>

      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => setShowShortcuts(true)}>
          اختصارات لوحة المفاتيح
        </Button>
        <Button variant="secondary" onClick={s.resetAll}>
          إعادة الإعدادات الافتراضية
        </Button>
        <Button variant="ghost" onClick={onBack}>الرجوع</Button>
      </div>

      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}
