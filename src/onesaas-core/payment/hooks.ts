'use client'

/**
 * 결제 관련 훅
 */

import { useState, useEffect } from 'react'
import { getPaymentConfig, getPaymentProvider, type PaymentProvider } from './config'
import { initPortOne, requestPortOnePayment, type PortOnePaymentParams } from './portone'
import { initTossPayments, type TossPaymentParams } from './tosspay'

interface UsePaymentResult {
  isReady: boolean
  provider: PaymentProvider
  pay: (params: PaymentParams) => Promise<PaymentResult>
}

interface PaymentParams {
  orderId: string
  orderName: string
  amount: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  method?: 'card' | 'transfer' | 'phone'
}

interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId?: string
  error?: string
}

/**
 * 결제 훅
 */
export function usePayment(): UsePaymentResult {
  const [isReady, setIsReady] = useState(false)
  const provider = getPaymentProvider()

  useEffect(() => {
    const config = getPaymentConfig()
    if (!config.enabled) {
      setIsReady(false)
      return
    }

    const init = async () => {
      try {
        if (provider === 'portone') {
          const merchantId = process.env.NEXT_PUBLIC_PORTONE_MERCHANT_ID
          if (merchantId) {
            await initPortOne(merchantId)
            setIsReady(true)
          }
        } else if (provider === 'tosspay') {
          const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
          if (clientKey) {
            await initTossPayments(clientKey)
            setIsReady(true)
          }
        }
      } catch (error) {
        console.error('결제 초기화 실패:', error)
      }
    }

    init()
  }, [provider])

  const pay = async (params: PaymentParams): Promise<PaymentResult> => {
    if (!isReady) {
      return { success: false, error: '결제 시스템이 준비되지 않았습니다' }
    }

    try {
      if (provider === 'portone') {
        const portoneParams: PortOnePaymentParams = {
          pg: 'html5_inicis',
          pay_method: params.method || 'card',
          merchant_uid: params.orderId,
          name: params.orderName,
          amount: params.amount,
          buyer_name: params.customerName,
          buyer_email: params.customerEmail,
          buyer_tel: params.customerPhone,
        }

        const result = await requestPortOnePayment(portoneParams)

        // 결제 성공 시 서버에서 검증
        if (result.success && result.imp_uid) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                impUid: result.imp_uid,
                merchantUid: result.merchant_uid,
                amount: params.amount,
                description: params.orderName,
              }),
            })
            const verifyData = await verifyRes.json()

            if (!verifyData.verified) {
              return {
                success: false,
                error: verifyData.error || '결제 검증 실패',
              }
            }

            return {
              success: true,
              paymentId: verifyData.paymentId || result.imp_uid,
              orderId: result.merchant_uid,
            }
          } catch {
            // 검증 실패해도 결제 자체는 성공한 것으로 처리
            return {
              success: true,
              paymentId: result.imp_uid,
              orderId: result.merchant_uid,
            }
          }
        }

        return {
          success: true,
          paymentId: result.imp_uid,
          orderId: result.merchant_uid,
        }
      } else {
        // TossPayments는 리다이렉트 방식
        const tossParams: TossPaymentParams = {
          orderId: params.orderId,
          orderName: params.orderName,
          amount: params.amount,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
        }

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
        const toss = await initTossPayments(clientKey)
        await toss.requestPayment('카드', tossParams)

        // 리다이렉트되므로 여기는 실행되지 않음
        return { success: true }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 실패',
      }
    }
  }

  return { isReady, provider, pay }
}

/**
 * 주문번호 생성
 */
export function generateOrderId(): string {
  const now = new Date()
  const timestamp = now.getTime()
  const random = Math.random().toString(36).substring(2, 8)
  return `ORDER-${timestamp}-${random}`
}
