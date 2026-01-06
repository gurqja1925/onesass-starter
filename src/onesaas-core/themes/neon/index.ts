import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'neon',
  name: '네온',
  nameEn: 'Neon',
  description: '레트로 퓨처리스틱, AI/테크 스타트업에 적합',
  colors: {
    light: {
      bg: '#fafafa',
      bgSecondary: '#f0fdf4',
      text: '#09090b',
      textSecondary: '#71717a',
      accent: '#00ff88',
      accentHover: '#00cc6a',
      border: '#d1fae5',
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
      accent: '#00ff88',
      accentHover: '#00cc6a',
      border: '#27272a',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Space Grotesk, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'medium',
  effects: ['glow', 'grid'],
}
