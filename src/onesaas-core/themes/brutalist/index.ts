import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'brutalist',
  name: '브루탈리스트',
  nameEn: 'Brutalist',
  description: '거칠고 강렬한 디자인, 개발자 도구에 적합',
  colors: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f5f5f5',
      text: '#000000',
      textSecondary: '#525252',
      accent: '#000000',
      accentHover: '#262626',
      border: '#000000',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#000000',
      bgSecondary: '#0a0a0a',
      text: '#ffffff',
      textSecondary: '#a3a3a3',
      accent: '#ffffff',
      accentHover: '#e5e5e5',
      border: '#ffffff',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'JetBrains Mono, monospace',
    body: 'JetBrains Mono, monospace',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'none',
  effects: ['shadow'],
}
