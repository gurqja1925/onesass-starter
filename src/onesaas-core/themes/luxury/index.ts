import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'luxury',
  name: '럭셔리',
  nameEn: 'Luxury',
  description: '고급스러운 디자인, 프리미엄 서비스에 적합',
  colors: {
    light: {
      bg: '#fffbf5',
      bgSecondary: '#fef7ed',
      text: '#1c1917',
      textSecondary: '#78716c',
      accent: '#d4a574',
      accentHover: '#c49561',
      border: '#e7e5e4',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#0c0a09',
      bgSecondary: '#1c1917',
      text: '#fafaf9',
      textSecondary: '#a8a29e',
      accent: '#d4a574',
      accentHover: '#e4b584',
      border: '#292524',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Playfair Display, Noto Serif KR, serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'small',
  effects: ['grain', 'shadow'],
}
