/**
 * 결제 설정 - TossPayments
 */

export interface PaymentConfig {
  enabled: boolean
  clientKey: string
  currency: 'KRW' | 'USD'
}

/**
 * 결제 설정 가져오기
 */
export function getPaymentConfig(): PaymentConfig {
  return {
    enabled: process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true',
    clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '',
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
 * 가격 포맷팅 (한국 원화)
 */
export function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}
