/**
 * 정기결제 자동 갱신 스케줄러
 * 
 * 매일 실행하여 만료 예정인 구독을 자동으로 갱신합니다.
 * Cron Job: 0 0 * * * (매일 자정)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// TossPayments API로 자동 결제 요청
async function processAutoBilling(subscription: any) {
  if (!subscription.billingKey || !subscription.customerKey) {
    console.log(`Missing billing info for subscription ${subscription.id}`)
    return { success: false, error: 'Missing billing information' }
  }
  
  const apiKey = process.env.TOSS_CLIENT_KEY
  const apiSecret = process.env.TOSS_SECRET_KEY
  
  if (!apiKey || !apiSecret) {
    return { success: false, error: 'Toss API credentials not configured' }
  }
  
  try {
    // TossPayments 인증
    const authResponse = await fetch('https://api.tosspayments.com/v1/auth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with TossPayments')
    }
    
    const { accessToken } = await authResponse.json()
    
    // 자동 결제 요청
    const billingResponse = await fetch('https://api.tosspayments.com/v1/billing', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        billingKey: subscription.billingKey,
        customerKey: subscription.customerKey,
        amount: subscription.amount,
        orderId: `AUTO_${subscription.id}_${Date.now()}`,
        orderName: `${subscription.planName} 자동 결제`,
        customerEmail: subscription.user.email,
        customerName: subscription.user.name || '사용자'
      })
    })
    
    const billingData = await billingResponse.json()
    
    if (!billingResponse.ok) {
      throw new Error(billingData.message || 'Auto billing failed')
    }
    
    // 결제 성공 처리
    const payment = await prisma.payment.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        amount: subscription.amount,
        currency: 'KRW',
        status: 'completed',
        type: 'subscription',
        method: billingData.method || 'card',
        provider: 'tosspayments',
        paymentKey: billingData.paymentKey,
        orderId: billingData.orderId,
        orderName: billingData.orderName,
        metadata: {
          autoBilling: true,
          billingDate: new Date().toISOString(),
          approvedAt: billingData.approvedAt
        }
      }
    })
    
    // 구독 갱신
    const now = new Date()
    const nextPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: nextPeriodEnd,
        nextBillingDate: nextPeriodEnd,
        lastPaymentId: billingData.paymentKey,
        lastPaymentDate: now,
        failedPaymentCount: 0
      }
    })
    
    // 분석 기록
    await prisma.analytics.create({
      data: {
        type: 'payment',
        value: subscription.amount,
        metadata: {
          paymentId: payment.id,
          userId: subscription.userId,
          plan: subscription.plan,
          autoBilling: true
        }
      }
    })
    
    console.log(`Auto billing successful for subscription ${subscription.id}`)
    return { success: true, paymentId: payment.id }
    
  } catch (error) {
    console.error(`Auto billing failed for subscription ${subscription.id}:`, error)
    
    // 실패 횟수 증가
    const failedCount = subscription.failedPaymentCount + 1
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: failedCount >= 3 ? 'past_due' : 'active',
        failedPaymentCount: failedCount,
        metadata: {
          ...(subscription.metadata as Record<string, any> || {}),
          lastBillingError: error instanceof Error ? error.message : 'Unknown error',
          lastBillingAttempt: new Date().toISOString()
        }
      }
    })
    
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function GET(request: NextRequest) {
  try {
    // 인증 키 확인 (cron job 보안)
    const authHeader = request.headers.get('Authorization')
    const cronKey = process.env.CRON_SECRET_KEY
    
    if (!cronKey || authHeader !== `Bearer ${cronKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.log('Starting subscription renewal job...')
    
    // 오늘 만료될 구독 찾기 (다음 결제일이 오늘이거나 지난 구독)
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    
    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trial'] },
        nextBillingDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        cancelAtPeriodEnd: false, // 취소 예정이 아닌 구독만
        billingKey: { not: null } // 빌링키가 있는 구독만
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
    
    console.log(`Found ${expiringSubscriptions.length} subscriptions to renew`)
    
    const results = []
    
    for (const subscription of expiringSubscriptions) {
      const result = await processAutoBilling(subscription)
      results.push({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        plan: subscription.plan,
        amount: subscription.amount,
        ...result
      })
    }
    
    // 만료된 구독 처리 (3번 이상 실패한 구독)
    const failedSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
        failedPaymentCount: { gte: 3 }
      }
    })
    
    for (const subscription of failedSubscriptions) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'expired',
          endDate: now
        }
      })
      
      console.log(`Subscription ${subscription.id} expired due to repeated failures`)
    }
    
    return NextResponse.json({
      success: true,
      processed: expiringSubscriptions.length,
      expired: failedSubscriptions.length,
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Subscription renewal job error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST 요청으로도 실행 가능 (테스트용)
export async function POST(request: NextRequest) {
  return GET(request)
}