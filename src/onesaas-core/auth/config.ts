/**
 * 인증 설정
 *
 * 환경 변수 기반 설정 (클라이언트/서버 모두 사용 가능)
 */

export interface AuthConfig {
  enabled: boolean
  providers: string[]
}

// 지원하는 인증 제공자
export const SUPPORTED_PROVIDERS = ['email', 'google', 'kakao', 'github'] as const
export type AuthProviderType = (typeof SUPPORTED_PROVIDERS)[number]

// 제공자별 메타데이터
export const PROVIDER_META: Record<
  AuthProviderType,
  { name: string; icon: string; color: string; bgColor: string }
> = {
  email: {
    name: '이메일',
    icon: '✉️',
    color: '#ffffff',
    bgColor: '#6366f1',
  },
  google: {
    name: 'Google',
    icon: '🔵',
    color: '#ffffff',
    bgColor: '#4285f4',
  },
  kakao: {
    name: '카카오',
    icon: '💬',
    color: '#3c1e1e',
    bgColor: '#fee500',
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    color: '#ffffff',
    bgColor: '#24292e',
  },
}

/**
 * 인증 설정 로드 (환경 변수 기반)
 *
 * 환경 변수:
 * - NEXT_PUBLIC_AUTH_ENABLED: "true" | "false"
 * - NEXT_PUBLIC_AUTH_PROVIDERS: "email,google,kakao,github"
 * - ADMIN_AUTH_PROVIDERS: "email" (관리자용 - 기본값: email만)
 */
export function getAuthConfig(): AuthConfig {
  const enabled = process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'false'
  const providersEnv = process.env.NEXT_PUBLIC_AUTH_PROVIDERS || 'email,google,kakao'
  const providers = providersEnv.split(',').map((p) => p.trim()).filter(Boolean)

  return {
    enabled,
    providers,
  }
}

/**
 * 관리자 인증 설정 로드
 * 관리자는 이메일/비밀번호만 지원
 */
export function getAdminAuthConfig(): AuthConfig {
  const adminProvidersEnv = process.env.ADMIN_AUTH_PROVIDERS || 'email'
  const providers = adminProvidersEnv.split(',').map((p) => p.trim()).filter(Boolean)

  return {
    enabled: true,
    providers,
  }
}

/**
 * 특정 제공자 활성화 여부
 */
export function isProviderEnabled(provider: AuthProviderType): boolean {
  const config = getAuthConfig()
  return config.enabled && config.providers.includes(provider)
}

/**
 * 활성화된 제공자 목록
 */
export function getEnabledProviders(): AuthProviderType[] {
  const config = getAuthConfig()
  if (!config.enabled) return []
  return config.providers.filter((p): p is AuthProviderType =>
    SUPPORTED_PROVIDERS.includes(p as AuthProviderType)
  )
}
