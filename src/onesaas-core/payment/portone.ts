'use client'

/**
 * PortOne 결제 모듈
 *
 * @see https://portone.io/docs
 */

declare global {
  interface Window {
    IMP?: {
      init: (merchantId: string) => void
      request_pay: (params: PortOnePaymentParams, callback: (response: PortOneResponse) => void) => void
    }
  }
}

export interface PortOnePaymentParams {
  pg: string // 결제대행사
  pay_method: string // 결제수단
  merchant_uid: string // 주문번호
  name: string // 상품명
  amount: number // 결제금액
  buyer_email?: string
  buyer_name?: string
  buyer_tel?: string
  buyer_addr?: string
  buyer_postcode?: string
  m_redirect_url?: string // 모바일 결제 후 리다이렉트 URL
}

export interface PortOneResponse {
  success: boolean
  error_msg?: string
  imp_uid?: string
  merchant_uid?: string
  paid_amount?: number
  status?: string
}

/**
 * PortOne SDK 초기화
 */
export function initPortOne(merchantId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.IMP) {
      window.IMP.init(merchantId)
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.iamport.kr/v1/iamport.js'
    script.onload = () => {
      if (window.IMP) {
        window.IMP.init(merchantId)
        resolve()
      } else {
        reject(new Error('PortOne SDK 로드 실패'))
      }
    }
    script.onerror = () => reject(new Error('PortOne SDK 로드 실패'))
    document.head.appendChild(script)
  })
}

/**
 * PortOne 결제 요청
 */
export function requestPortOnePayment(params: PortOnePaymentParams): Promise<PortOneResponse> {
  return new Promise((resolve, reject) => {
    if (!window.IMP) {
      reject(new Error('PortOne SDK가 초기화되지 않았습니다'))
      return
    }

    window.IMP.request_pay(params, (response) => {
      if (response.success) {
        resolve(response)
      } else {
        reject(new Error(response.error_msg || '결제 실패'))
      }
    })
  })
}

/**
 * PG사 코드
 */
export const PG_PROVIDERS = {
  kakaopay: 'kakaopay',
  tosspay: 'tosspay',
  naverpay: 'naverpay',
  payco: 'payco',
  kcp: 'kcp',
  inicis: 'html5_inicis',
  nice: 'nice',
} as const

/**
 * 결제 수단
 */
export const PAY_METHODS = {
  card: 'card', // 신용카드
  trans: 'trans', // 실시간 계좌이체
  vbank: 'vbank', // 가상계좌
  phone: 'phone', // 휴대폰 소액결제
  kakaopay: 'kakaopay',
  tosspay: 'tosspay',
  naverpay: 'naverpay',
} as const
