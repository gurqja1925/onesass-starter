import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'startup',
  name: '스타트업',
  nameEn: 'Startup',
  description: '현대적이고 역동적인 디자인, 스타트업에 적합',
  colors: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#faf5ff',
      text: '#1e1b4b',
      textSecondary: '#6b7280',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      border: '#e9d5ff',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#0f0d1a',
      bgSecondary: '#1e1b2e',
      text: '#faf5ff',
      textSecondary: '#a78bfa',
      accent: '#a855f7',
      accentHover: '#c084fc',
      border: '#3b2d5a',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Plus Jakarta Sans, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'medium',
  effects: ['gradient', 'blur'],
}
