/**
 * OneSaaS Plugin System
 * 플러그인 시스템 - 테마, 템플릿, 컴포넌트 관리
 */

// 타입 내보내기
export type {
  ThemeId,
  ThemeMode,
  TextDirection,
  ThemeMeta,
  ThemeColors,
  ThemeFonts,
  ThemeEffect,
  TemplateMeta,
  TemplateCategory,
  ComponentBundle,
  KoreanBusinessConfig,
  ThemeConfig,
  LayoutConfig,
  TemplatesConfig,
  PluginsConfig,
  LayoutWidth,
  SidebarVariant,
  PositionType,
} from './types'

// 레지스트리 함수 내보내기
export {
  registerTheme,
  getTheme,
  getAllThemes,
  registerTemplate,
  getTemplate,
  getTemplatesByCategory,
  getAllTemplates,
  defaultThemes,
} from './registry'

// 로더 함수 내보내기
export {
  loadTheme,
  setTextDirection,
  watchSystemTheme,
  initializeTheme,
  resolveThemeMode,
} from './loader'
