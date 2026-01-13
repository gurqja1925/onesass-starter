/**
 * 구독 관리 대시보드 페이지
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/onesaas-core/ui'
import { ProtectedRoute } from '@/onesaas-core/auth/components'

interface Plan {
  id: string
  name: string
  price: number | null
  features: string[]
  popular?: boolean
}

interface UsageData {
  usage: {
    creates: number
    aiCalls: number
    exports: number
    apiCalls: number
    storage: number
  }
  limits: {
    creates: number
    aiCalls: number
    exports: number
    apiCalls: number
    storage: number
  }
  remaining: {
    creates: number
    aiCalls: number
    exports: number
    apiCalls: number
    storage: number
  }
  percentUsed: {
    creates: number
    aiCalls: number
    exports: number
    apiCalls: number
    storage: number
  }
  period: string
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: '무료',
    price: 0,
    features: [
      '기본 기능 모두 포함',
      '월 5회 생성',
      '월 10회 AI 호출',
      '커뮤니티 지원',
    ],
  },
  {
    id: 'pro',
    name: '프로',
    price: 29000,
    features: [
      '무료 플랜의 모든 것',
      '월 100회 생성',
      '월 500회 AI 호출',
      '우선 이메일 지원',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: null,
    features: [
      '프로 플랜의 모든 것',
      '무제한 생성',
      '무제한 AI 호출',
      '전담 매니저',
    ],
  },
]

export default function SubscriptionPage() {
  const { user, subscription, loading, refresh } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [upgrading, setUpgrading] = useState(false)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [usageLoading, setUsageLoading] = useState(true)

  // 사용량 데이터 조회
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage')
        if (response.ok) {
          const data = await response.json()
          setUsageData(data)
        }
      } catch (error) {
        console.error('사용량 조회 오류:', error)
      } finally {
        setUsageLoading(false)
      }
    }

    if (!loading) {
      fetchUsage()
    }
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  const currentPlan = user?.plan || 'free'
  const daysLeft = subscription?.daysLeft ?? 0

  // 사용량 표시 헬퍼
  const formatUsage = (used: number, limit: number) => {
    if (limit === -1) return `${used} / 무제한`
    return `${used} / ${limit}`
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return '#ef4444' // red
    if (percent >= 70) return '#f59e0b' // amber
    return '#10b981' // green
  }

  const handlePlanChange = async (newPlan: string) => {
    if (newPlan === currentPlan) return

    setUpgrading(true)
    try {
      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: newPlan }),
      })

      if (response.ok) {
        await refresh()
        alert('플랜이 성공적으로 변경되었습니다!')
      } else {
        const data = await response.json()
        alert(data.error || '플랜 변경에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setUpgrading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('정말 구독을 취소하시겠습니까?')) return

    try {
      const response = await fetch('/api/subscription', {
        method: 'DELETE',
      })

      if (response.ok) {
        await refresh()
        alert('구독이 성공적으로 취소되었습니다.')
      } else {
        const data = await response.json()
        alert(data.error || '구독 취소에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              구독 관리
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              현재 플랜과 구독 상태를 관리할 수 있습니다.
            </p>
          </div>

          {/* 현재 구독 상태 */}
          <div className="mb-8 p-6 rounded-xl border">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              현재 구독 상태
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  현재 플랜
                </p>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  {PLANS.find(p => p.id === currentPlan)?.name || '알 수 없음'}
                </p>
              </div>
              
              <div>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  구독 상태
                </p>
                <p className="text-lg font-semibold">
                  <span 
                    className={`px-2 py-1 rounded text-sm ${
                      subscription?.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : subscription?.status === 'trial'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {subscription?.status === 'active' && '활성'}
                    {subscription?.status === 'trial' && '체험 중'}
                    {(!subscription || subscription.status === 'canceled') && '무료'}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  남은 기간
                </p>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  {daysLeft && daysLeft > 0 ? `${daysLeft}일` : '없음'}
                </p>
              </div>
            </div>

            {subscription && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      다음 결제일
                    </p>
                    <p style={{ color: 'var(--color-text)' }}>
                      {subscription.nextBillingDate 
                        ? new Date(subscription.nextBillingDate).toLocaleDateString('ko-KR')
                        : '예정 없음'
                      }
                    </p>
                  </div>
                  
                  {subscription.status === 'active' && (
                    <Button
                      variant="danger"
                      onClick={handleCancelSubscription}
                    >
                      구독 취소
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 사용량 현황 */}
          <div className="mb-8 p-6 rounded-xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
                이번 달 사용량
              </h2>
              {usageData && (
                <span className="text-sm px-3 py-1 rounded-full bg-gray-100" style={{ color: 'var(--color-text-secondary)' }}>
                  {usageData.period}
                </span>
              )}
            </div>
            
            {usageLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p style={{ color: 'var(--color-text-secondary)' }}>사용량 로딩 중...</p>
              </div>
            ) : usageData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 생성 */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: 'var(--color-text)' }}>생성</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatUsage(usageData.usage.creates, usageData.limits.creates)}
                    </span>
                  </div>
                  {usageData.limits.creates !== -1 && (
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(usageData.percentUsed.creates, 100)}%`,
                          background: getProgressColor(usageData.percentUsed.creates)
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {usageData.limits.creates === -1 ? '무제한' : `${usageData.remaining.creates}회 남음`}
                  </p>
                </div>

                {/* AI 호출 */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: 'var(--color-text)' }}>AI 호출</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatUsage(usageData.usage.aiCalls, usageData.limits.aiCalls)}
                    </span>
                  </div>
                  {usageData.limits.aiCalls !== -1 && (
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(usageData.percentUsed.aiCalls, 100)}%`,
                          background: getProgressColor(usageData.percentUsed.aiCalls)
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {usageData.limits.aiCalls === -1 ? '무제한' : `${usageData.remaining.aiCalls}회 남음`}
                  </p>
                </div>

                {/* 내보내기 */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: 'var(--color-text)' }}>내보내기</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatUsage(usageData.usage.exports, usageData.limits.exports)}
                    </span>
                  </div>
                  {usageData.limits.exports !== -1 && (
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(usageData.percentUsed.exports, 100)}%`,
                          background: getProgressColor(usageData.percentUsed.exports)
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {usageData.limits.exports === -1 ? '무제한' : `${usageData.remaining.exports}회 남음`}
                  </p>
                </div>

                {/* API 호출 */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: 'var(--color-text)' }}>API 호출</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatUsage(usageData.usage.apiCalls, usageData.limits.apiCalls)}
                    </span>
                  </div>
                  {usageData.limits.apiCalls !== -1 && (
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(usageData.percentUsed.apiCalls, 100)}%`,
                          background: getProgressColor(usageData.percentUsed.apiCalls)
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {usageData.limits.apiCalls === -1 ? '무제한' : `${usageData.remaining.apiCalls}회 남음`}
                  </p>
                </div>

                {/* 저장공간 */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: 'var(--color-text)' }}>저장공간</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {usageData.limits.storage === -1 
                        ? `${usageData.usage.storage}MB / 무제한`
                        : `${usageData.usage.storage}MB / ${usageData.limits.storage >= 1000 
                            ? `${(usageData.limits.storage / 1000).toFixed(0)}GB` 
                            : `${usageData.limits.storage}MB`}`
                      }
                    </span>
                  </div>
                  {usageData.limits.storage !== -1 && (
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(usageData.percentUsed.storage, 100)}%`,
                          background: getProgressColor(usageData.percentUsed.storage)
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {usageData.limits.storage === -1 ? '무제한' : `${usageData.remaining.storage}MB 남음`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
                사용량 정보를 불러올 수 없습니다.
              </p>
            )}
          </div>

          {/* 플랜 선택 */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              플랜 변경
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const isCurrent = plan.id === currentPlan
                const isDisabled = upgrading

                return (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      plan.popular ? 'border-blue-200 shadow-lg' : 'border'
                    } ${
                      isCurrent ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          인기
                        </span>
                      </div>
                    )}

                    {isCurrent && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          현재 플랜
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        {plan.price !== null ? (
                          <>
                            <span className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                              ₩{plan.price.toLocaleString()}
                            </span>
                            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              /월
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            문의
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span style={{ color: 'var(--color-text)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {!isCurrent && plan.price !== null && (
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'primary' : 'outline'}
                        disabled={isDisabled}
                        onClick={() => handlePlanChange(plan.id)}
                      >
                        {upgrading ? '처리 중...' : `${plan.name} 플랜으로 변경`}
                      </Button>
                    )}

                    {isCurrent && (
                      <Button className="w-full" disabled>
                        현재 플랜
                      </Button>
                    )}

                    {plan.price === null && (
                      <Button className="w-full" variant="outline">
                        문의하기
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="mt-8 p-6 rounded-xl border">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              계정 정보
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>이메일:</span>
                <span style={{ color: 'var(--color-text)' }}>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>권한:</span>
                <span style={{ color: 'var(--color-text)' }}>
                  {user?.role === 'admin' ? '관리자' : '사용자'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>상태:</span>
                <span style={{ color: 'var(--color-text)' }}>
                  {user?.status === 'active' ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}