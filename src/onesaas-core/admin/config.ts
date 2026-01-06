/**
 * 관리자 설정
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface AdminConfig {
  enabled: boolean
  features: {
    analytics: boolean
    userManagement: boolean
    contentManagement: boolean
    settings: boolean
  }
}

let cachedConfig: AdminConfig | null = null

/**
 * 관리자 설정 로드
 */
export function getAdminConfig(): AdminConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    const configPath = join(process.cwd(), 'onesaas.json')
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
      cachedConfig = {
        enabled: config.features?.admin?.enabled ?? false,
        features: {
          analytics: config.features?.admin?.analytics ?? true,
          userManagement: config.features?.admin?.userManagement ?? true,
          contentManagement: config.features?.admin?.contentManagement ?? false,
          settings: config.features?.admin?.settings ?? true,
        },
      }
      return cachedConfig
    }
  } catch {
    // 설정 파일 없으면 기본값
  }

  return {
    enabled: false,
    features: {
      analytics: true,
      userManagement: true,
      contentManagement: false,
      settings: true,
    },
  }
}

/**
 * 관리자 기능 활성화 여부
 */
export function isAdminEnabled(): boolean {
  return getAdminConfig().enabled
}

/**
 * 관리자 메뉴 항목
 */
export interface AdminMenuItem {
  id: string
  label: string
  icon: string
  href: string
  enabled: boolean
}

export function getAdminMenuItems(): AdminMenuItem[] {
  const config = getAdminConfig()

  return [
    {
      id: 'dashboard',
      label: '대시보드',
      icon: '📊',
      href: '/admin',
      enabled: config.enabled,
    },
    {
      id: 'users',
      label: '사용자 관리',
      icon: '👥',
      href: '/admin/users',
      enabled: config.features.userManagement,
    },
    {
      id: 'analytics',
      label: '통계',
      icon: '📈',
      href: '/admin/analytics',
      enabled: config.features.analytics,
    },
    {
      id: 'content',
      label: '콘텐츠',
      icon: '📝',
      href: '/admin/content',
      enabled: config.features.contentManagement,
    },
    {
      id: 'settings',
      label: '설정',
      icon: '⚙️',
      href: '/admin/settings',
      enabled: config.features.settings,
    },
  ].filter((item) => item.enabled)
}
