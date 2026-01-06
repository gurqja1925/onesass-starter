import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'playful',
  name: '플레이풀',
  nameEn: 'Playful',
  description: '재미있고 친근한 디자인, 교육/소셜 앱에 적합',
  colors: {
    light: {
      bg: '#fffbeb',
      bgSecondary: '#fef3c7',
      text: '#1c1917',
      textSecondary: '#78716c',
      accent: '#f97316',
      accentHover: '#ea580c',
      border: '#fde68a',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#1c1917',
      bgSecondary: '#292524',
      text: '#fafaf9',
      textSecondary: '#a8a29e',
      accent: '#f97316',
      accentHover: '#fb923c',
      border: '#44403c',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Nunito, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'full',
  effects: ['gradient'],
}
