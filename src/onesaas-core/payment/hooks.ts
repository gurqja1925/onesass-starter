'use client'

/**
 * 결제 관련 훅 - TossPayments
 */

import { useState, useEffect } from 'react'
import { getPaymentConfig } from './config'
import {
  initTossPayments,
  requestTossPayment,
  requestTossBilling,
  generateOrderId,
  generateCustomerKey,
  type TossPaymentOptions
} from './toss-payments'

interface UsePaymentResult {
  isReady: boolean
  pay: (params: PaymentParams) => Promise<PaymentResult>
  subscribe: (params: SubscriptionParams) => Promise<PaymentResult>
}

interface PaymentParams {
  orderId?: string
  orderName: string
  amount: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

interface SubscriptionParams {
  customerKey?: string
  planName: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId?: string
  customerKey?: string
  error?: string
}

/**
 * TossPayments 결제 훅
 */
export function usePayment(): UsePaymentResult {
  const [isReady, setIsReady] = useState(false)
  const [tossPayments, setTossPayments] = useState<any>(null)

  useEffect(() => {
    const config = getPaymentConfig()
    if (!config.enabled || !config.clientKey) {
      setIsReady(false)
      return
    }

    const init = async () => {
      try {
        const toss = await initTossPayments(config.clientKey)
        setTossPayments(toss)
        setIsReady(true)
      } catch (error) {
        console.error('TossPayments 초기화 실패:', error)
      }
    }

    init()
  }, [])

  const pay = async (params: PaymentParams) => {
    if (!isReady || !tossPayments) {
      return {
        success: false,
        error: '결제 시스템이 준비되지 않았습니다'
      }
    }

    try {
      const orderId = params.orderId || generateOrderId()

      // 현재 URL 기반으로 성공/실패 URL 생성
      const baseUrl = window.location.origin

      const tossOptions: TossPaymentOptions = {
        amount: params.amount,
        orderId,
        orderName: params.orderName,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerMobilePhone: params.customerPhone || '01012345678',
        successUrl: `${baseUrl}/service/payment/success`,
        failUrl: `${baseUrl}/service/payment/fail`,
      }

      await requestTossPayment(tossPayments, tossOptions)

      // requestTossPayment는 리다이렉트하므로 여기까지 오지 않음
      // 성공 시 successUrl로, 실패 시 failUrl로 이동
      return {
        success: true,
        orderId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 요청 실패',
      }
    }
  }

  const subscribe = async (params: SubscriptionParams) => {
    if (!isReady || !tossPayments) {
      return {
        success: false,
        error: '결제 시스템이 준비되지 않았습니다'
      }
    }

    try {
      // 고객 키 생성 (실제로는 사용자 ID 기반으로 생성해야 함)
      const customerKey = params.customerKey || generateCustomerKey('user_' + Date.now())

      // 현재 URL 기반으로 성공/실패 URL 생성
      const baseUrl = window.location.origin

      await requestTossBilling(tossPayments, {
        customerKey,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerMobilePhone: params.customerPhone || '01012345678',
        successUrl: `${baseUrl}/service/payment/subscription/success?planName=${encodeURIComponent(params.planName)}`,
        failUrl: `${baseUrl}/service/payment/fail`,
      })

      // requestTossBilling은 리다이렉트하므로 여기까지 오지 않음
      return {
        success: true,
        customerKey,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '구독 등록 실패',
      }
    }
  }

  return { isReady, pay, subscribe }
}

export { generateOrderId }
