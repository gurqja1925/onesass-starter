'use client'

/**
 * TossPayments 결제 모듈
 *
 * @see https://docs.tosspayments.com
 */

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPaymentsInstance
  }
}

interface TossPaymentsInstance {
  requestPayment: (
    method: string,
    params: TossPaymentParams
  ) => Promise<TossPaymentResponse>
}

export interface TossPaymentParams {
  amount: number
  orderId: string
  orderName: string
  customerName?: string
  customerEmail?: string
  successUrl: string
  failUrl: string
}

export interface TossPaymentResponse {
  paymentKey: string
  orderId: string
  amount: number
}

/**
 * TossPayments SDK 초기화
 */
export function initTossPayments(clientKey: string): Promise<TossPaymentsInstance> {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) {
      resolve(window.TossPayments(clientKey))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1/payment'
    script.onload = () => {
      if (window.TossPayments) {
        resolve(window.TossPayments(clientKey))
      } else {
        reject(new Error('TossPayments SDK 로드 실패'))
      }
    }
    script.onerror = () => reject(new Error('TossPayments SDK 로드 실패'))
    document.head.appendChild(script)
  })
}

/**
 * TossPayments 결제 요청
 */
export async function requestTossPayment(
  clientKey: string,
  method: '카드' | '가상계좌' | '계좌이체' | '휴대폰',
  params: TossPaymentParams
): Promise<TossPaymentResponse> {
  const toss = await initTossPayments(clientKey)
  return toss.requestPayment(method, params)
}

/**
 * 결제 승인 (서버에서 호출)
 */
export async function confirmTossPayment(
  secretKey: string,
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      const error = await response.json()
      return { success: false, error: error.message || '결제 승인 실패' }
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
