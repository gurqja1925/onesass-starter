/**
 * OneSaaS Plugin Loader
 * 플러그인 동적 로더 - 테마/템플릿 CSS 및 컴포넌트 로딩
 */

import type { ThemeId, ThemeMode, ThemeMeta, ThemeColors } from './types'
import { getTheme } from './registry'

/**
 * CSS 변수를 문서에 적용
 */
function setCSSVariable(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value)
}

/**
 * 테마 색상을 CSS 변수로 변환
 */
function applyThemeColors(colors: ThemeColors): void {
  setCSSVariable('--color-bg', colors.bg)
  setCSSVariable('--color-bg-secondary', colors.bgSecondary)
  setCSSVariable('--color-text', colors.text)
  setCSSVariable('--color-text-secondary', colors.textSecondary)
  setCSSVariable('--color-accent', colors.accent)
  setCSSVariable('--color-accent-hover', colors.accentHover)
  setCSSVariable('--color-border', colors.border)
  setCSSVariable('--color-success', colors.success)
  setCSSVariable('--color-warning', colors.warning)
  setCSSVariable('--color-error', colors.error)
  setCSSVariable('--color-info', colors.info)
}

/**
 * 테마 폰트 적용
 */
function applyThemeFonts(theme: ThemeMeta): void {
  setCSSVariable('--font-display', theme.fonts.display)
  setCSSVariable('--font-body', theme.fonts.body)
  setCSSVariable('--font-mono', theme.fonts.mono)
}

/**
 * 테마 border-radius 적용
 */
function applyThemeBorderRadius(radius: ThemeMeta['borderRadius']): void {
  const radiusMap = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  }
  setCSSVariable('--radius', radiusMap[radius])
  setCSSVariable('--radius-sm', radius === 'none' ? '0px' : `${parseInt(radiusMap[radius]) / 2}px`)
  setCSSVariable('--radius-lg', radius === 'full' ? '9999px' : `${parseInt(radiusMap[radius]) * 2}px`)
}

/**
 * 시스템 다크모드 감지
 */
function getSystemThemeMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 실제 테마 모드 결정
 */
export function resolveThemeMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return getSystemThemeMode()
  }
  return mode
}

/**
 * 테마 로드 및 적용
 */
export function loadTheme(themeId: ThemeId, mode: ThemeMode = 'dark'): void {
  const theme = getTheme(themeId)
  if (!theme) {
    console.warn(`Theme "${themeId}" not found, falling back to "neon"`)
    loadTheme('neon', mode)
    return
  }

  const resolvedMode = resolveThemeMode(mode)
  const colors = resolvedMode === 'dark' ? theme.colors.dark : theme.colors.light

  // 데이터 속성 설정
  document.documentElement.setAttribute('data-theme', themeId)
  document.documentElement.setAttribute('data-mode', resolvedMode)

  // CSS 변수 적용
  applyThemeColors(colors)
  applyThemeFonts(theme)
  applyThemeBorderRadius(theme.borderRadius)

  // 효과 클래스 적용
  const effectClasses = theme.effects.map((effect) => `theme-effect-${effect}`)
  document.documentElement.classList.remove(
    'theme-effect-glow',
    'theme-effect-noise',
    'theme-effect-grid',
    'theme-effect-gradient',
    'theme-effect-shadow',
    'theme-effect-blur',
    'theme-effect-grain'
  )
  document.documentElement.classList.add(...effectClasses)
}

/**
 * 텍스트 방향 설정
 */
export function setTextDirection(direction: 'ltr' | 'rtl'): void {
  document.documentElement.setAttribute('dir', direction)
  setCSSVariable('--direction', direction)
  setCSSVariable('--start', direction === 'ltr' ? 'left' : 'right')
  setCSSVariable('--end', direction === 'ltr' ? 'right' : 'left')
}

/**
 * 시스템 테마 변경 감지 리스너
 */
export function watchSystemTheme(
  callback: (mode: 'light' | 'dark') => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light')
  }

  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}

/**
 * 테마 초기화
 */
export function initializeTheme(
  themeId: ThemeId = 'neon',
  mode: ThemeMode = 'dark',
  direction: 'ltr' | 'rtl' = 'ltr'
): void {
  loadTheme(themeId, mode)
  setTextDirection(direction)

  // 시스템 모드일 경우 변경 감지
  if (mode === 'system') {
    watchSystemTheme((newMode) => {
      loadTheme(themeId, newMode)
    })
  }
}
