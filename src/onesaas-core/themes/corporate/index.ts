import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'corporate',
  name: '코퍼레이트',
  nameEn: 'Corporate',
  description: '전문적이고 신뢰감 있는 디자인, B2B에 적합',
  colors: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      border: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      bg: '#0f172a',
      bgSecondary: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      accent: '#3b82f6',
      accentHover: '#60a5fa',
      border: '#334155',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Inter, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'small',
  effects: [],
}
