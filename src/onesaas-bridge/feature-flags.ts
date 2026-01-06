/**
 * 기능 플래그 관리
 *
 * onesaas.json 설정에 따라 기능 활성화/비활성화를 결정합니다.
 */

import { getConfig, isFeatureEnabled } from './config'

/**
 * 인증 관련 플래그
 */
export const auth = {
  isEnabled: () => isFeatureEnabled('auth'),

  isProviderEnabled: (provider: string) => {
    const config = getConfig()
    if (!config.features.auth.enabled) return false
    return config.features.auth.providers.includes(provider)
  },

  getEnabledProviders: () => {
    const config = getConfig()
    if (!config.features.auth.enabled) return []
    return config.features.auth.providers
  },
}

/**
 * 결제 관련 플래그
 */
export const payment = {
  isEnabled: () => isFeatureEnabled('payment'),

  getProvider: () => {
    const config = getConfig()
    return config.features.payment.provider
  },
}

/**
 * 관리자 대시보드 플래그
 */
export const admin = {
  isEnabled: () => isFeatureEnabled('admin'),
}

/**
 * 블로그 플래그
 */
export const blog = {
  isEnabled: () => isFeatureEnabled('blog'),
}

/**
 * AI 기능 플래그
 */
export const ai = {
  isEnabled: () => isFeatureEnabled('ai'),

  getProvider: () => {
    const config = getConfig()
    return config.features.ai.provider || 'openai'
  },
}

/**
 * 모든 플래그 내보내기
 */
export const featureFlags = {
  auth,
  payment,
  admin,
  blog,
  ai,
}

export default featureFlags
