/**
 * OneSaaS Design System
 *
 * Anthropic의 frontend-design 스킬을 기반으로 한 디자인 시스템
 * "AI slop" 미학을 거부하고, 독창적이고 기억에 남는 UI를 만듭니다.
 */

// ============================================================
// 디자인 원칙
// ============================================================

export const designPrinciples = {
  // 시작 전 고려사항
  beforeCoding: {
    purpose: '인터페이스의 목적과 대상 사용자를 이해',
    aesthetic: '대담한 미학적 방향 선택 (brutalist, maximalist, retro, luxury 등)',
    differentiation: '차별화 기회 식별',
  },

  // 실행 포커스
  implementationFocus: {
    productionGrade: '프로덕션 수준의 기능적 코드',
    visuallyStriking: '시각적으로 인상적이고 기억에 남는 디자인',
    cohesiveAesthetic: '일관된 미학적 방향',
  },

  // 피해야 할 것들 (AI Slop)
  antiPatterns: [
    'Generic purple gradients',
    'Centered everything layouts',
    'Inter/Arial/System fonts only',
    'Cookie-cutter card patterns',
    'Excessive uniform rounded corners',
    'Predictable layouts',
  ],

  // 추구해야 할 것들
  embracePatterns: [
    'Distinctive typography choices',
    'Cohesive color schemes with sharp accents',
    'Motion and animations for high-impact moments',
    'Unexpected layouts with asymmetry',
    'Creative use of negative space',
    'Gradients, textures, patterns, shadows',
  ],
}

// ============================================================
// 테마 팩토리 (Anthropic theme-factory 기반)
// ============================================================

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
}

export interface ThemeFonts {
  display: string
  body: string
  mono: string
}

export interface Theme {
  id: string
  name: string
  nameKo: string
  description: string
  category: 'modern' | 'creative' | 'professional' | 'vibrant' | 'elegant'
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  fonts: ThemeFonts
  borderRadius: string
  shadows: {
    sm: string
    md: string
    lg: string
    glow: string
  }
}

// Anthropic theme-factory의 10가지 프리셋 테마
export const themePresets: Theme[] = [
  // 1. Ocean Depths
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    nameKo: '오션 뎁스',
    description: '깊은 바다의 신비로움을 담은 테마',
    category: 'creative',
    colors: {
      light: {
        primary: '#0369a1',
        secondary: '#0891b2',
        accent: '#06b6d4',
        background: '#f0f9ff',
        surface: '#e0f2fe',
        text: '#0c4a6e',
        textSecondary: '#0369a1',
        border: '#bae6fd',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#38bdf8',
        secondary: '#22d3ee',
        accent: '#06b6d4',
        background: '#0c1929',
        surface: '#0f2942',
        text: '#f0f9ff',
        textSecondary: '#7dd3fc',
        border: '#164e63',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Playfair Display, serif',
      body: 'Inter, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    borderRadius: '12px',
    shadows: {
      sm: '0 2px 4px rgba(3, 105, 161, 0.1)',
      md: '0 4px 12px rgba(3, 105, 161, 0.15)',
      lg: '0 8px 24px rgba(3, 105, 161, 0.2)',
      glow: '0 0 20px rgba(56, 189, 248, 0.3)',
    },
  },

  // 2. Sunset Boulevard
  {
    id: 'sunset-boulevard',
    name: 'Sunset Boulevard',
    nameKo: '선셋 블러바드',
    description: '따뜻한 석양빛을 담은 테마',
    category: 'vibrant',
    colors: {
      light: {
        primary: '#ea580c',
        secondary: '#f97316',
        accent: '#fbbf24',
        background: '#fffbeb',
        surface: '#fef3c7',
        text: '#7c2d12',
        textSecondary: '#c2410c',
        border: '#fed7aa',
        success: '#22c55e',
        warning: '#eab308',
        error: '#dc2626',
      },
      dark: {
        primary: '#fb923c',
        secondary: '#fdba74',
        accent: '#fbbf24',
        background: '#1c1410',
        surface: '#2d201a',
        text: '#fff7ed',
        textSecondary: '#fed7aa',
        border: '#7c2d12',
        success: '#4ade80',
        warning: '#facc15',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Outfit, sans-serif',
      body: 'Nunito, -apple-system, sans-serif',
      mono: 'Fira Code, monospace',
    },
    borderRadius: '16px',
    shadows: {
      sm: '0 2px 4px rgba(234, 88, 12, 0.1)',
      md: '0 4px 12px rgba(234, 88, 12, 0.15)',
      lg: '0 8px 24px rgba(234, 88, 12, 0.2)',
      glow: '0 0 24px rgba(251, 146, 60, 0.4)',
    },
  },

  // 3. Forest Canopy
  {
    id: 'forest-canopy',
    name: 'Forest Canopy',
    nameKo: '포레스트 캐노피',
    description: '울창한 숲의 자연스러움을 담은 테마',
    category: 'elegant',
    colors: {
      light: {
        primary: '#166534',
        secondary: '#15803d',
        accent: '#84cc16',
        background: '#f0fdf4',
        surface: '#dcfce7',
        text: '#14532d',
        textSecondary: '#166534',
        border: '#bbf7d0',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#4ade80',
        secondary: '#86efac',
        accent: '#a3e635',
        background: '#0a150e',
        surface: '#14261a',
        text: '#f0fdf4',
        textSecondary: '#86efac',
        border: '#166534',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Fraunces, serif',
      body: 'Source Sans 3, -apple-system, sans-serif',
      mono: 'Source Code Pro, monospace',
    },
    borderRadius: '8px',
    shadows: {
      sm: '0 2px 4px rgba(22, 101, 52, 0.08)',
      md: '0 4px 12px rgba(22, 101, 52, 0.12)',
      lg: '0 8px 24px rgba(22, 101, 52, 0.16)',
      glow: '0 0 20px rgba(74, 222, 128, 0.3)',
    },
  },

  // 4. Modern Minimalist
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    nameKo: '모던 미니멀리스트',
    description: '깔끔하고 현대적인 미니멀 테마',
    category: 'modern',
    colors: {
      light: {
        primary: '#18181b',
        secondary: '#3f3f46',
        accent: '#71717a',
        background: '#fafafa',
        surface: '#ffffff',
        text: '#09090b',
        textSecondary: '#52525b',
        border: '#e4e4e7',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#fafafa',
        secondary: '#d4d4d8',
        accent: '#a1a1aa',
        background: '#09090b',
        surface: '#18181b',
        text: '#fafafa',
        textSecondary: '#a1a1aa',
        border: '#27272a',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Space Grotesk, sans-serif',
      body: 'IBM Plex Sans, -apple-system, sans-serif',
      mono: 'IBM Plex Mono, monospace',
    },
    borderRadius: '4px',
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 8px rgba(0, 0, 0, 0.08)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
      glow: 'none',
    },
  },

  // 5. Golden Hour
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    nameKo: '골든 아워',
    description: '황금빛 노을을 담은 럭셔리 테마',
    category: 'elegant',
    colors: {
      light: {
        primary: '#b45309',
        secondary: '#d97706',
        accent: '#fbbf24',
        background: '#fffbeb',
        surface: '#fef3c7',
        text: '#78350f',
        textSecondary: '#92400e',
        border: '#fcd34d',
        success: '#16a34a',
        warning: '#ca8a04',
        error: '#dc2626',
      },
      dark: {
        primary: '#fbbf24',
        secondary: '#fcd34d',
        accent: '#fde68a',
        background: '#1a1408',
        surface: '#2d2210',
        text: '#fefce8',
        textSecondary: '#fcd34d',
        border: '#854d0e',
        success: '#4ade80',
        warning: '#facc15',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Cormorant Garamond, serif',
      body: 'Lato, -apple-system, sans-serif',
      mono: 'Roboto Mono, monospace',
    },
    borderRadius: '6px',
    shadows: {
      sm: '0 2px 4px rgba(180, 83, 9, 0.08)',
      md: '0 4px 12px rgba(180, 83, 9, 0.12)',
      lg: '0 8px 24px rgba(180, 83, 9, 0.18)',
      glow: '0 0 24px rgba(251, 191, 36, 0.35)',
    },
  },

  // 6. Arctic Frost
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    nameKo: '아틱 프로스트',
    description: '시원한 얼음의 청량함을 담은 테마',
    category: 'modern',
    colors: {
      light: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        accent: '#7dd3fc',
        background: '#f0f9ff',
        surface: '#e0f2fe',
        text: '#0c4a6e',
        textSecondary: '#0369a1',
        border: '#bae6fd',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#7dd3fc',
        secondary: '#bae6fd',
        accent: '#e0f2fe',
        background: '#0a1929',
        surface: '#102a43',
        text: '#f0f9ff',
        textSecondary: '#7dd3fc',
        border: '#0c4a6e',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Poppins, sans-serif',
      body: 'Rubik, -apple-system, sans-serif',
      mono: 'Victor Mono, monospace',
    },
    borderRadius: '10px',
    shadows: {
      sm: '0 2px 4px rgba(14, 165, 233, 0.06)',
      md: '0 4px 12px rgba(14, 165, 233, 0.1)',
      lg: '0 8px 24px rgba(14, 165, 233, 0.15)',
      glow: '0 0 20px rgba(125, 211, 252, 0.3)',
    },
  },

  // 7. Desert Rose
  {
    id: 'desert-rose',
    name: 'Desert Rose',
    nameKo: '데저트 로즈',
    description: '사막의 장미처럼 우아한 테마',
    category: 'elegant',
    colors: {
      light: {
        primary: '#be185d',
        secondary: '#db2777',
        accent: '#f472b6',
        background: '#fdf2f8',
        surface: '#fce7f3',
        text: '#831843',
        textSecondary: '#9d174d',
        border: '#fbcfe8',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#f472b6',
        secondary: '#f9a8d4',
        accent: '#fbcfe8',
        background: '#1a0a14',
        surface: '#2d1422',
        text: '#fdf2f8',
        textSecondary: '#f9a8d4',
        border: '#9d174d',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'DM Serif Display, serif',
      body: 'DM Sans, -apple-system, sans-serif',
      mono: 'Fira Code, monospace',
    },
    borderRadius: '14px',
    shadows: {
      sm: '0 2px 4px rgba(190, 24, 93, 0.08)',
      md: '0 4px 12px rgba(190, 24, 93, 0.12)',
      lg: '0 8px 24px rgba(190, 24, 93, 0.18)',
      glow: '0 0 24px rgba(244, 114, 182, 0.35)',
    },
  },

  // 8. Tech Innovation
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    nameKo: '테크 이노베이션',
    description: '혁신적인 기술 스타트업을 위한 테마',
    category: 'professional',
    colors: {
      light: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        background: '#faf5ff',
        surface: '#f3e8ff',
        text: '#4c1d95',
        textSecondary: '#6b21a8',
        border: '#ddd6fe',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#a78bfa',
        secondary: '#c4b5fd',
        accent: '#ddd6fe',
        background: '#0f0a1a',
        surface: '#1a132d',
        text: '#faf5ff',
        textSecondary: '#c4b5fd',
        border: '#5b21b6',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Sora, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    borderRadius: '8px',
    shadows: {
      sm: '0 2px 4px rgba(124, 58, 237, 0.08)',
      md: '0 4px 12px rgba(124, 58, 237, 0.15)',
      lg: '0 8px 24px rgba(124, 58, 237, 0.2)',
      glow: '0 0 30px rgba(167, 139, 250, 0.4)',
    },
  },

  // 9. Botanical Garden
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    nameKo: '보타니컬 가든',
    description: '자연에서 영감받은 편안한 테마',
    category: 'creative',
    colors: {
      light: {
        primary: '#059669',
        secondary: '#10b981',
        accent: '#34d399',
        background: '#ecfdf5',
        surface: '#d1fae5',
        text: '#064e3b',
        textSecondary: '#047857',
        border: '#a7f3d0',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#34d399',
        secondary: '#6ee7b7',
        accent: '#a7f3d0',
        background: '#0a1912',
        surface: '#132d22',
        text: '#ecfdf5',
        textSecondary: '#6ee7b7',
        border: '#065f46',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Libre Baskerville, serif',
      body: 'Karla, -apple-system, sans-serif',
      mono: 'Cousine, monospace',
    },
    borderRadius: '12px',
    shadows: {
      sm: '0 2px 4px rgba(5, 150, 105, 0.08)',
      md: '0 4px 12px rgba(5, 150, 105, 0.12)',
      lg: '0 8px 24px rgba(5, 150, 105, 0.18)',
      glow: '0 0 20px rgba(52, 211, 153, 0.3)',
    },
  },

  // 10. Midnight Galaxy
  {
    id: 'midnight-galaxy',
    name: 'Midnight Galaxy',
    nameKo: '미드나잇 갤럭시',
    description: '우주의 신비로움을 담은 테마',
    category: 'vibrant',
    colors: {
      light: {
        primary: '#4f46e5',
        secondary: '#6366f1',
        accent: '#818cf8',
        background: '#eef2ff',
        surface: '#e0e7ff',
        text: '#312e81',
        textSecondary: '#4338ca',
        border: '#c7d2fe',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#818cf8',
        secondary: '#a5b4fc',
        accent: '#c7d2fe',
        background: '#0a0a1a',
        surface: '#12122d',
        text: '#eef2ff',
        textSecondary: '#a5b4fc',
        border: '#3730a3',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
    },
    fonts: {
      display: 'Orbitron, sans-serif',
      body: 'Exo 2, -apple-system, sans-serif',
      mono: 'Space Mono, monospace',
    },
    borderRadius: '6px',
    shadows: {
      sm: '0 2px 4px rgba(79, 70, 229, 0.1)',
      md: '0 4px 12px rgba(79, 70, 229, 0.18)',
      lg: '0 8px 24px rgba(79, 70, 229, 0.25)',
      glow: '0 0 30px rgba(129, 140, 248, 0.5)',
    },
  },
]

// ============================================================
// 유틸리티 함수
// ============================================================

export function getThemeById(id: string): Theme | undefined {
  return themePresets.find(t => t.id === id)
}

export function getThemesByCategory(category: Theme['category']): Theme[] {
  return themePresets.filter(t => t.category === category)
}

export function generateCSSVariables(theme: Theme, mode: 'light' | 'dark'): string {
  const colors = theme.colors[mode]

  return `
    --color-primary: ${colors.primary};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    --color-bg: ${colors.background};
    --color-bg-secondary: ${colors.surface};
    --color-text: ${colors.text};
    --color-text-secondary: ${colors.textSecondary};
    --color-border: ${colors.border};
    --color-success: ${colors.success};
    --color-warning: ${colors.warning};
    --color-error: ${colors.error};
    --font-display: ${theme.fonts.display};
    --font-body: ${theme.fonts.body};
    --font-mono: ${theme.fonts.mono};
    --radius: ${theme.borderRadius};
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-glow: ${theme.shadows.glow};
  `.trim()
}

export function applyTheme(themeId: string, mode: 'light' | 'dark'): void {
  const theme = getThemeById(themeId)
  if (!theme) return

  const root = document.documentElement
  root.setAttribute('data-theme', themeId)
  root.setAttribute('data-mode', mode)

  const css = generateCSSVariables(theme, mode)
  root.style.cssText = css
}
