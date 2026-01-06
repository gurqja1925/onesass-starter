import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'minimal',
  name: '미니멀',
  nameEn: 'Minimal',
  description: '극도로 절제된 디자인, 생산성 앱에 적합',
  colors: {
    light: {
      bg: '#fafafa',
      bgSecondary: '#f4f4f5',
      text: '#09090b',
      textSecondary: '#71717a',
      accent: '#18181b',
      accentHover: '#27272a',
      border: '#e4e4e7',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#09090b',
      bgSecondary: '#18181b',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      accent: '#fafafa',
      accentHover: '#e4e4e7',
      border: '#27272a',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Pretendard, -apple-system, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'small',
  effects: [],
}
