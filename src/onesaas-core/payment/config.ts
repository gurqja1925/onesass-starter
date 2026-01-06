/**
 * 결제 설정
 *
 * onesaas.json에서 결제 설정을 읽어옵니다.
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export type PaymentProvider = 'portone' | 'tosspay'

export interface PaymentConfig {
  enabled: boolean
  provider: PaymentProvider
  currency: string
}

let cachedConfig: PaymentConfig | null = null

/**
 * 결제 설정 로드
 */
export function getPaymentConfig(): PaymentConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    const configPath = join(process.cwd(), 'onesaas.json')
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
      cachedConfig = {
        enabled: config.features?.payment?.enabled ?? false,
        provider: config.features?.payment?.provider ?? 'portone',
        currency: 'KRW',
      }
      return cachedConfig
    }
  } catch {
    // 설정 파일 없으면 기본값
  }

  return {
    enabled: false,
    provider: 'portone',
    currency: 'KRW',
  }
}

/**
 * 결제 활성화 여부
 */
export function isPaymentEnabled(): boolean {
  return getPaymentConfig().enabled
}

/**
 * 현재 결제 제공자
 */
export function getPaymentProvider(): PaymentProvider {
  return getPaymentConfig().provider
}

/**
 * 금액 포맷
 */
export function formatPrice(amount: number, currency = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
