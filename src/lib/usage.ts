/**
 * 사용량 관리 유틸리티
 * 
 * 플랜별 사용량 한도 체크 및 사용량 증가/조회 기능
 * 
 * NOTE: prisma db push 실행 후 사용 가능
 */

import { prisma } from './prisma'
import { config } from '@/onesaas-bridge/config'

// 사용량 타입
export type UsageType = 'creates' | 'aiCalls' | 'exports' | 'apiCalls' | 'storage'

// 현재 기간 문자열 (YYYY-MM)
export function getCurrentPeriod(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// 플랜별 한도 가져오기
export function getPlanLimits(plan: string) {
  return config.planLimits[plan] || config.planLimits.free
}

// 사용자의 현재 사용량 조회
export async function getUserUsage(userId: string) {
  const period = getCurrentPeriod()
  
  // @ts-expect-error - Usage 모델은 prisma db push 후 사용 가능
  let usage = await prisma.usage.findUnique({
    where: {
      userId_period: {
        userId,
        period,
      },
    },
  })

  // 없으면 생성
  if (!usage) {
    // @ts-expect-error - Usage 모델은 prisma db push 후 사용 가능
    usage = await prisma.usage.create({
      data: {
        userId,
        period,
        creates: 0,
        aiCalls: 0,
        exports: 0,
        apiCalls: 0,
        storage: 0,
      },
    })
  }

  return usage
}

// 사용자의 사용량 + 한도 정보 조회
export async function getUserUsageWithLimits(userId: string, plan: string) {
  const usage = await getUserUsage(userId)
  const limits = getPlanLimits(plan)

  return {
    usage: {
      creates: usage.creates,
      aiCalls: usage.aiCalls,
      exports: usage.exports,
      apiCalls: usage.apiCalls,
      storage: usage.storage,
    },
    limits,
    period: usage.period,
    remaining: {
      creates: limits.creates === -1 ? -1 : Math.max(0, limits.creates - usage.creates),
      aiCalls: limits.aiCalls === -1 ? -1 : Math.max(0, limits.aiCalls - usage.aiCalls),
      exports: limits.exports === -1 ? -1 : Math.max(0, limits.exports - usage.exports),
      apiCalls: limits.apiCalls === -1 ? -1 : Math.max(0, limits.apiCalls - usage.apiCalls),
      storage: limits.storage === -1 ? -1 : Math.max(0, limits.storage - usage.storage),
    },
    percentUsed: {
      creates: limits.creates === -1 ? 0 : Math.round((usage.creates / limits.creates) * 100),
      aiCalls: limits.aiCalls === -1 ? 0 : Math.round((usage.aiCalls / limits.aiCalls) * 100),
      exports: limits.exports === -1 ? 0 : Math.round((usage.exports / limits.exports) * 100),
      apiCalls: limits.apiCalls === -1 ? 0 : Math.round((usage.apiCalls / limits.apiCalls) * 100),
      storage: limits.storage === -1 ? 0 : Math.round((usage.storage / limits.storage) * 100),
    },
  }
}

// 사용량 한도 체크 (사용 가능 여부)
export async function canUse(
  userId: string,
  plan: string,
  type: UsageType,
  amount: number = 1
): Promise<{ allowed: boolean; current: number; limit: number; remaining: number }> {
  const usage = await getUserUsage(userId)
  const limits = getPlanLimits(plan)
  
  const current = usage[type]
  const limit = limits[type]
  
  // 무제한인 경우 (-1)
  if (limit === -1) {
    return {
      allowed: true,
      current,
      limit: -1,
      remaining: -1,
    }
  }

  const remaining = Math.max(0, limit - current)
  const allowed = current + amount <= limit

  return {
    allowed,
    current,
    limit,
    remaining,
  }
}

// 사용량 증가
export async function incrementUsage(
  userId: string,
  type: UsageType,
  amount: number = 1
): Promise<{ success: boolean; newValue: number }> {
  const period = getCurrentPeriod()

  // @ts-expect-error - Usage 모델은 prisma db push 후 사용 가능
  const usage = await prisma.usage.upsert({
    where: {
      userId_period: {
        userId,
        period,
      },
    },
    create: {
      userId,
      period,
      [type]: amount,
    },
    update: {
      [type]: {
        increment: amount,
      },
    },
  })

  return {
    success: true,
    newValue: usage[type],
  }
}

// 사용량 체크 + 증가 (한 번에)
export async function useQuota(
  userId: string,
  plan: string,
  type: UsageType,
  amount: number = 1
): Promise<{ 
  success: boolean
  error?: string
  current: number
  limit: number
  remaining: number 
}> {
  const check = await canUse(userId, plan, type, amount)
  
  if (!check.allowed) {
    return {
      success: false,
      error: `월간 ${getUsageTypeName(type)} 한도에 도달했습니다. (${check.current}/${check.limit})`,
      current: check.current,
      limit: check.limit,
      remaining: check.remaining,
    }
  }

  const result = await incrementUsage(userId, type, amount)
  
  return {
    success: true,
    current: result.newValue,
    limit: check.limit,
    remaining: check.limit === -1 ? -1 : check.limit - result.newValue,
  }
}

// 사용량 타입 이름 (한글)
function getUsageTypeName(type: UsageType): string {
  const names: Record<UsageType, string> = {
    creates: '생성',
    aiCalls: 'AI 호출',
    exports: '내보내기',
    apiCalls: 'API 호출',
    storage: '저장공간',
  }
  return names[type]
}

// 구독 유효성 체크 (활성 구독이 있는지)
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ['active', 'trial'],
      },
      currentPeriodEnd: {
        gte: new Date(),
      },
    },
  })

  return !!subscription
}

// 사용자의 현재 플랜 조회
export async function getUserPlan(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  return user?.plan || 'free'
}
