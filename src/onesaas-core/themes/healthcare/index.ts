import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'healthcare',
  name: '헬스케어',
  nameEn: 'Healthcare',
  description: '청결하고 안정감 있는 디자인, 의료/건강 서비스에 적합',
  colors: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#ecfeff',
      text: '#083344',
      textSecondary: '#64748b',
      accent: '#06b6d4',
      accentHover: '#0891b2',
      border: '#cffafe',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#083344',
      bgSecondary: '#164e63',
      text: '#ecfeff',
      textSecondary: '#a5f3fc',
      accent: '#22d3ee',
      accentHover: '#67e8f9',
      border: '#155e75',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Outfit, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'medium',
  effects: [],
}
