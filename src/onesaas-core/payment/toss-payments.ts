/**
 * TossPayments SDK Integration
 * https://docs.tosspayments.com/reference
 */

declare global {
  interface Window {
    TossPayments?: any
  }
}

export interface TossPaymentOptions {
  amount: number
  orderId: string
  orderName: string
  customerName?: string
  customerEmail?: string
  customerMobilePhone?: string
  successUrl: string
  failUrl: string
}

export interface TossPaymentResult {
  success: boolean
  paymentKey?: string
  orderId?: string
  amount?: number
  error?: string
}

/**
 * TossPayments SDK 초기화
 */
export async function initTossPayments(clientKey: string): Promise<any> {
  // 이미 로드되어 있으면 재사용
  if (window.TossPayments) {
    return window.TossPayments(clientKey)
  }

  // SDK 스크립트 로드
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1/payment'
    script.async = true
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
 * TossPayments 일반 결제 요청
 */
export async function requestTossPayment(
  tossPayments: any,
  options: TossPaymentOptions
): Promise<void> {
  try {
    await tossPayments.requestPayment('카드', {
      amount: options.amount,
      orderId: options.orderId,
      orderName: options.orderName,
      customerName: options.customerName,
      customerEmail: options.customerEmail,
      customerMobilePhone: options.customerMobilePhone,
      successUrl: options.successUrl,
      failUrl: options.failUrl,
    })
  } catch (error: any) {
    throw new Error(error?.message || '결제 요청 실패')
  }
}

/**
 * TossPayments 정기결제(구독) 빌링키 발급 요청
 */
export async function requestTossBilling(
  tossPayments: any,
  options: {
    customerKey: string
    customerName?: string
    customerEmail?: string
    customerMobilePhone?: string
    successUrl: string
    failUrl: string
  }
): Promise<void> {
  try {
    await tossPayments.requestBillingAuth('카드', {
      customerKey: options.customerKey,
      customerName: options.customerName,
      customerEmail: options.customerEmail,
      customerMobilePhone: options.customerMobilePhone,
      successUrl: options.successUrl,
      failUrl: options.failUrl,
    })
  } catch (error: any) {
    throw new Error(error?.message || '구독 등록 실패')
  }
}

/**
 * 고유 고객 키 생성
 */
export function generateCustomerKey(userId: string): string {
  return `customer_${userId}_${Date.now()}`
}

/**
 * 고유 주문번호 생성
 */
export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `ORDER_${timestamp}_${random}`
}

/**
 * TossPayments 결제 승인 (서버 사이드)
 */
export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
  secretKey: string
): Promise<any> {
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 승인 실패')
  }

  return response.json()
}
