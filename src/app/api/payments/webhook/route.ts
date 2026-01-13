/**
 * TossPayments 웹훅 엔드포인트
 * 
 * TossPayments에서 결제 상태가 변경될 때마다 이 엔드포인트로 알림을 보냅니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// 웹훅 서명 검증
function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET
  if (!webhookSecret) return false
  
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body, 'utf8')
    .digest('base64')
  
  return signature === computedSignature
}

// 결제 성공 처리
async function handlePaymentSuccess(data: any) {
  const { 
    paymentKey, 
    orderId, 
    orderName, 
    approvedAt, 
    method, 
    totalAmount,
    card,
    virtualAccount,
    transfer,
    mobilePhone,
    giftCertificate,
    cashReceipt
  } = data
  
  try {
    // 기존 결제 기록 찾기
    let payment = await prisma.payment.findFirst({
      where: { paymentKey }
    })
    
    if (!payment) {
      // orderId로도 검색
      payment = await prisma.payment.findFirst({
        where: { orderId }
      })
    }
    
    if (payment) {
      // 결제 상태 업데이트
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          method: method || 'card',
          orderName: orderName,
          metadata: {
            ...(payment.metadata as Record<string, any> || {}),
            approvedAt,
            card,
            virtualAccount,
            transfer,
            mobilePhone,
            giftCertificate,
            cashReceipt,
            webhookProcessedAt: new Date().toISOString()
          }
        }
      })
      
      // 구독 결제인 경우 구독 처리
      if (payment.type === 'subscription') {
        // 결제 메타데이터에서 구독 정보 추출
        const subscriptionInfo = payment.metadata as any
        const plan = subscriptionInfo?.plan
        
        if (plan) {
          // 기존 구독 찾기
          let subscription = await prisma.subscription.findFirst({
            where: { userId: payment.userId }
          })
          
          const now = new Date()
          
          if (subscription) {
            // 기존 구독 갱신
            const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
            const nextPeriodEnd = currentPeriodEnd > now 
              ? new Date(currentPeriodEnd.getTime() + 30 * 24 * 60 * 60 * 1000)
              : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                status: 'active',
                currentPeriodStart: now,
                currentPeriodEnd: nextPeriodEnd,
                nextBillingDate: nextPeriodEnd,
                lastPaymentId: paymentKey,
                lastPaymentDate: now,
                failedPaymentCount: 0,
                cancelAtPeriodEnd: false
              }
            })
          } else {
            // 새 구독 생성
            await prisma.subscription.create({
              data: {
                userId: payment.userId,
                plan,
                planName: `${plan.charAt(0).toUpperCase() + plan.slice(1)} 월간 구독`,
                amount: totalAmount,
                status: 'active',
                currentPeriodStart: now,
                currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                nextBillingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
              }
            })
          }
          
          // 사용자 플랜 업데이트
          await prisma.user.update({
            where: { id: payment.userId },
            data: { plan }
          })
          
          console.log(`Subscription processed for user ${payment.userId}`)
        }
      }
      
      // 분석 기록
      await prisma.analytics.create({
        data: {
          type: 'payment',
          value: totalAmount,
          metadata: {
            paymentId: payment.id,
            paymentKey,
            orderId,
            method,
            plan: (payment.metadata as any)?.plan,
            source: 'webhook'
          }
        }
      })
      
      return { success: true, paymentId: payment.id }
    } else {
      throw new Error('Payment record not found')
    }
  } catch (error) {
    console.error('Payment success handler error:', error)
    throw error
  }
}

// 결제 실패 처리
async function handlePaymentFailure(data: any) {
  const { paymentKey, orderId, failReason, status } = data
  
  try {
    const payment = await prisma.payment.findFirst({
      where: { 
        OR: [{ paymentKey }, { orderId }]
      }
    })
    
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          metadata: {
            ...(payment.metadata as Record<string, any> || {}),
            failReason,
            status,
            webhookProcessedAt: new Date().toISOString()
          }
        }
      })
      
      console.log(`Payment ${payment.id} marked as failed: ${failReason}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Payment failure handler error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('Webhook-Signature')
    
    // 서명 검증
    if (!verifyWebhookSignature(body, signature || '')) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    const data = JSON.parse(body)
    const { eventName, data: eventData } = data
    
    console.log(`Toss webhook received: ${eventName}`)
    
    let result
    
    switch (eventName) {
      case 'PAYMENT_SUCCESS':
        result = await handlePaymentSuccess(eventData)
        break
        
      case 'PAYMENT_FAILED':
        result = await handlePaymentFailure(eventData)
        break
        
      case 'BILLING_KEY_SUCCESS':
        console.log('Billing key registered successfully')
        result = { success: true }
        break
        
      case 'BILLING_KEY_FAILED':
        console.log('Billing key registration failed')
        result = { success: true }
        break
        
      default:
        console.log(`Unhandled webhook event: ${eventName}`)
        result = { success: true, message: 'Webhook received but not processed' }
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Toss webhook processing error:', error)
    
    // 웹훅은 항상 200을 반환해야 함 (재시도 방지)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Webhook processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  }
}

// GET 요청 - 웹훅 상태 확인
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'TossPayments Webhook',
    timestamp: new Date().toISOString()
  })
}