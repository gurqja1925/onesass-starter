import './theme.css'
import type { ThemeMeta } from '../../plugins'

export const themeMeta: ThemeMeta = {
  id: 'ecommerce',
  name: '이커머스',
  nameEn: 'E-commerce',
  description: '구매 전환에 최적화된 디자인, 쇼핑몰에 적합',
  colors: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#fef2f2',
      text: '#1c1917',
      textSecondary: '#78716c',
      accent: '#e11d48',
      accentHover: '#be123c',
      border: '#fecdd3',
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
      accent: '#fb7185',
      accentHover: '#fda4af',
      border: '#292524',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    display: 'Poppins, Pretendard, sans-serif',
    body: 'Pretendard, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: 'medium',
  effects: ['shadow', 'gradient'],
}
