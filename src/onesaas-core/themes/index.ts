/**
 * OneSaaS Theme System
 * 테마 시스템 메인 export
 */

// ThemeProvider 및 훅
export {
  ThemeProvider,
  useTheme,
  getThemeModeIcon,
  getThemeModeLabel,
} from './ThemeProvider'

// 플러그인 시스템에서 re-export
export {
  // 타입
  type ThemeId,
  type ThemeMode,
  type TextDirection,
  type ThemeMeta,
  type ThemeColors,
  type ThemeFonts,
  type ThemeEffect,
  // 함수
  loadTheme,
  setTextDirection,
  watchSystemTheme,
  initializeTheme,
  resolveThemeMode,
  registerTheme,
  getTheme,
  getAllThemes,
  defaultThemes,
} from '../plugins'
