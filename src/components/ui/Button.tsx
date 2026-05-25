import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const baseStyle: React.CSSProperties = {
  padding: '12px 32px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
}

const variants: Record<string, React.CSSProperties> = {
  primary: { background: '#4FC3F7', color: '#0a0a1a' },
  secondary: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' },
  ghost: { background: 'transparent', color: '#4FC3F7' },
}

export function Button({ variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      {...props}
    />
  )
}
