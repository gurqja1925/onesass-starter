'use client'

/**
 * OneSaaS Theme Provider
 * 테마 컨텍스트 및 프로바이더
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { ThemeId, ThemeMode, TextDirection } from '../plugins'
import {
  loadTheme,
  setTextDirection,
  watchSystemTheme,
  resolveThemeMode,
  getTheme,
  getAllThemes,
} from '../plugins'
import { plugins } from '@/onesaas-bridge/plugins'

// 테마 컨텍스트 타입
interface ThemeContextType {
  // 현재 테마
  themeId: ThemeId
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  direction: TextDirection

  // 테마 변경 함수
  setTheme: (themeId: ThemeId) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  setDirection: (direction: TextDirection) => void
  toggleDirection: () => void

  // 테마 정보
  themes: ReturnType<typeof getAllThemes>
  currentTheme: ReturnType<typeof getTheme>
}

// 기본값
const defaultContext: ThemeContextType = {
  themeId: 'neon',
  mode: 'dark',
  resolvedMode: 'dark',
  direction: 'ltr',
  setTheme: () => {},
  setMode: () => {},
  toggleMode: () => {},
  setDirection: () => {},
  toggleDirection: () => {},
  themes: [],
  currentTheme: undefined,
}

// 컨텍스트 생성
const ThemeContext = createContext<ThemeContextType>(defaultContext)

// 로컬 스토리지 키
const STORAGE_KEY = 'onesaas-theme'

// 저장된 설정 불러오기
function loadSavedSettings(): {
  themeId?: ThemeId
  mode?: ThemeMode
  direction?: TextDirection
} {
  if (typeof window === 'undefined') return {}

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('Failed to load theme settings:', e)
  }

  return {}
}

// 설정 저장
function saveSettings(settings: {
  themeId: ThemeId
  mode: ThemeMode
  direction: TextDirection
}): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('Failed to save theme settings:', e)
  }
}

// Provider Props
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeId
  defaultMode?: ThemeMode
  defaultDirection?: TextDirection
  persistSettings?: boolean
}

/**
 * ThemeProvider 컴포넌트
 */
export function ThemeProvider({
  children,
  defaultTheme = plugins.theme.active,
  defaultMode = plugins.theme.mode,
  defaultDirection = plugins.theme.direction,
  persistSettings = true,
}: ThemeProviderProps) {
  // 초기값 설정 (저장된 값 또는 기본값)
  const savedSettings = persistSettings ? loadSavedSettings() : {}

  const [themeId, setThemeId] = useState<ThemeId>(
    savedSettings.themeId || defaultTheme
  )
  const [mode, setModeState] = useState<ThemeMode>(
    savedSettings.mode || defaultMode
  )
  const [direction, setDirectionState] = useState<TextDirection>(
    savedSettings.direction || defaultDirection
  )
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('dark')

  // 테마 적용
  useEffect(() => {
    const resolved = resolveThemeMode(mode)
    setResolvedMode(resolved)
    loadTheme(themeId, mode)
  }, [themeId, mode])

  // 방향 적용
  useEffect(() => {
    setTextDirection(direction)
  }, [direction])

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (mode !== 'system') return

    return watchSystemTheme((newMode) => {
      setResolvedMode(newMode)
      loadTheme(themeId, newMode)
    })
  }, [mode, themeId])

  // 설정 저장
  useEffect(() => {
    if (persistSettings) {
      saveSettings({ themeId, mode, direction })
    }
  }, [themeId, mode, direction, persistSettings])

  // 테마 변경
  const setTheme = useCallback((newThemeId: ThemeId) => {
    setThemeId(newThemeId)
  }, [])

  // 모드 변경
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
  }, [])

  // 모드 토글
  const toggleMode = useCallback(() => {
    setModeState((current) => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }, [])

  // 방향 변경
  const setDirection = useCallback((newDirection: TextDirection) => {
    setDirectionState(newDirection)
  }, [])

  // 방향 토글
  const toggleDirection = useCallback(() => {
    setDirectionState((current) => (current === 'ltr' ? 'rtl' : 'ltr'))
  }, [])

  // 컨텍스트 값
  const value: ThemeContextType = {
    themeId,
    mode,
    resolvedMode,
    direction,
    setTheme,
    setMode,
    toggleMode,
    setDirection,
    toggleDirection,
    themes: getAllThemes(),
    currentTheme: getTheme(themeId),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme 훅
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

/**
 * 테마 모드 아이콘 가져오기
 */
export function getThemeModeIcon(mode: ThemeMode): string {
  switch (mode) {
    case 'light':
      return '☀️'
    case 'dark':
      return '🌙'
    case 'system':
      return '💻'
    default:
      return '🌙'
  }
}

/**
 * 테마 모드 레이블 가져오기
 */
export function getThemeModeLabel(mode: ThemeMode): string {
  switch (mode) {
    case 'light':
      return '라이트 모드'
    case 'dark':
      return '다크 모드'
    case 'system':
      return '시스템 설정'
    default:
      return '다크 모드'
  }
}
