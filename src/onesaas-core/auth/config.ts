/**
 * 인증 설정
 *
 * onesaas.json에서 인증 설정을 읽어옵니다.
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface AuthConfig {
  enabled: boolean
  providers: string[]
}

// 지원하는 인증 제공자
export const SUPPORTED_PROVIDERS = ['email', 'google', 'kakao', 'github'] as const
export type AuthProvider = (typeof SUPPORTED_PROVIDERS)[number]

// 제공자별 메타데이터
export const PROVIDER_META: Record<
  AuthProvider,
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

let cachedConfig: AuthConfig | null = null

/**
 * 인증 설정 로드
 */
export function getAuthConfig(): AuthConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    const configPath = join(process.cwd(), 'onesaas.json')
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
      cachedConfig = {
        enabled: config.features?.auth?.enabled ?? true,
        providers: config.features?.auth?.providers ?? ['email'],
      }
      return cachedConfig
    }
  } catch {
    // 설정 파일 없으면 기본값
  }

  return {
    enabled: true,
    providers: ['email'],
  }
}

/**
 * 특정 제공자 활성화 여부
 */
export function isProviderEnabled(provider: AuthProvider): boolean {
  const config = getAuthConfig()
  return config.enabled && config.providers.includes(provider)
}

/**
 * 활성화된 제공자 목록
 */
export function getEnabledProviders(): AuthProvider[] {
  const config = getAuthConfig()
  if (!config.enabled) return []
  return config.providers.filter((p): p is AuthProvider =>
    SUPPORTED_PROVIDERS.includes(p as AuthProvider)
  )
}
