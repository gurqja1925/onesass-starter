/**
 * 관리자 설정
 *
 * 환경 변수 기반 설정 (클라이언트/서버 모두 사용 가능)
 */

export interface AdminConfig {
  enabled: boolean
  features: {
    analytics: boolean
    userManagement: boolean
    contentManagement: boolean
    payments: boolean
    subscriptions: boolean
    aiUsage: boolean
    logs: boolean
    settings: boolean
  }
}

/**
 * 관리자 설정 로드 (환경 변수 기반)
 *
 * 환경 변수:
 * - NEXT_PUBLIC_ADMIN_ENABLED: "true" | "false"
 */
export function getAdminConfig(): AdminConfig {
  const enabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true'

  return {
    enabled,
    features: {
      analytics: true,
      userManagement: true,
      contentManagement: true,
      payments: true,
      subscriptions: true,
      aiUsage: true,
      logs: true,
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
    // 대시보드는 사이드바 헤더 "관리자" 클릭으로 접근하므로 메뉴에서 제거
    {
      id: 'users',
      label: '사용자 관리',
      icon: '👥',
      href: '/admin/users',
      enabled: config.features.userManagement,
    },
    {
      id: 'subscriptions',
      label: '구독 관리',
      icon: '📋',
      href: '/admin/subscriptions',
      enabled: config.features.subscriptions,
    },
    {
      id: 'payments',
      label: '결제 관리',
      icon: '💳',
      href: '/admin/payments',
      enabled: config.features.payments,
    },
    {
      id: 'ai-usage',
      label: 'AI 사용량',
      icon: '🤖',
      href: '/admin/ai-usage',
      enabled: config.features.aiUsage,
    },
    {
      id: 'contents',
      label: '콘텐츠 관리',
      icon: '📝',
      href: '/admin/contents',
      enabled: config.features.contentManagement,
    },
    {
      id: 'analytics',
      label: '통계',
      icon: '📈',
      href: '/admin/analytics',
      enabled: config.features.analytics,
    },
    {
      id: 'logs',
      label: '활동 로그',
      icon: '📜',
      href: '/admin/logs',
      enabled: config.features.logs,
    },
    {
      id: 'settings',
      label: '설정',
      icon: '⚙️',
      href: '/admin/settings',
      enabled: config.features.settings,
    },
    {
      id: 'agents',
      label: 'AI 에이전트',
      icon: '🤖',
      href: '/admin/agents',
      enabled: config.enabled,
    },
    {
      id: 'mcp',
      label: 'MCP 서버',
      icon: '🔌',
      href: '/admin/mcp',
      enabled: config.enabled,
    },
    {
      id: 'skills',
      label: '스킬 가이드',
      icon: '📚',
      href: '/admin/skills',
      enabled: config.enabled,
    },
    {
      id: 'setup',
      label: '초기 설정 가이드',
      icon: '📖',
      href: '/admin/setup',
      enabled: config.enabled,
    },
  ].filter((item) => item.enabled)
}
