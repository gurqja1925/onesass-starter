import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'fintech',
  name: '핀테크',
  nameEn: 'Fintech',
  description: '신뢰감과 전문성을 주는 디자인, 금융 서비스에 적합',
  colors: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f0fdfa',
      text: '#042f2e',
      textSecondary: '#5f7470',
      accent: '#0d9488',
      accentHover: '#0f766e',
      border: '#ccfbf1',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#042f2e',
      bgSecondary: '#134e4a',
      text: '#f0fdfa',
      textSecondary: '#99f6e4',
      accent: '#2dd4bf',
      accentHover: '#5eead4',
      border: '#115e59',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'DM Sans, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'small',
  effects: ['shadow'],
}
