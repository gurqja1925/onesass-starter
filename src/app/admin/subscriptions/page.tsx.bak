'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

interface Subscription {
  id: string
  userId: string
  plan: string
  planName: string
  amount: number
  billingCycle: string
  status: string
  startDate: string
  currentPeriodStart: string
  currentPeriodEnd: string
  nextBillingDate: string | null
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
  trialEnd: string | null
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface SubscriptionStats {
  byStatus: {
    [key: string]: {
      count: number
      revenue: number
    }
  }
  byPlan: {
    [key: string]: {
      count: number
      revenue: number
    }
  }
  mrr: number
  activeCount: number
  trialCount: number
  canceledCount: number
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString())
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  // 연도 목록
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const years = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(planFilter !== 'all' && { plan: planFilter }),
        ...(year && { year }),
        ...(month !== 'all' && { month })
      })

      const res = await fetch(`/api/admin/subscriptions?${params}`)
      const data = await res.json()

      setSubscriptions(data.subscriptions || [])
      setTotal(data.pagination?.total || 0)
      setTotalPages(data.pagination?.totalPages || 0)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, planFilter, year, month])

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('이 구독을 취소하시겠습니까? 현재 기간 종료 시 자동으로 해지됩니다.')) {
      return
    }

    setProcessing(subscriptionId)
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          reason: '관리자 취소',
          immediate: false
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('구독이 취소되었습니다.')
        fetchData()
      } else {
        alert(data.error || '취소 실패')
      }
    } catch (error) {
      alert('구독 취소 중 오류가 발생했습니다.')
    } finally {
      setProcessing(null)
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      free: { bg: 'var(--color-bg)', color: 'var(--color-text)' },
      pro: { bg: 'var(--color-accent)', color: 'var(--color-bg)' },
      enterprise: { bg: '#8b5cf6', color: 'white' },
    }
    return styles[plan] || styles.free
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      active: { bg: '#10b981', color: 'white', label: '활성' },
      canceled: { bg: '#ef4444', color: 'white', label: '취소됨' },
      expired: { bg: '#6b7280', color: 'white', label: '만료됨' },
      trial: { bg: '#f59e0b', color: 'white', label: '체험중' },
    }
    return styles[status] || styles.active
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            구독 관리
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            사용자 구독 현황을 관리하세요
          </p>
        </div>

        {/* 연도/월 및 플랜 필터 */}
        <div className="flex gap-4 items-center flex-wrap">
          <div>
            <label className="text-sm font-medium mr-2" style={{ color: 'var(--color-text)' }}>연도:</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1) }}
              className="px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mr-2" style={{ color: 'var(--color-text)' }}>월:</label>
            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); setPage(1) }}
              className="px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <option value="all">전체</option>
              {months.map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mr-2" style={{ color: 'var(--color-text)' }}>플랜:</label>
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1) }}
              className="px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <option value="all">전체</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                {stats?.activeCount || 0}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                활성 구독
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                ₩{(stats?.mrr || 0).toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                MRR (월간 반복 수익)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                {stats?.trialCount || 0}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                체험 중
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                {stats?.canceledCount || 0}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                취소됨
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'active', label: '활성' },
            { value: 'trial', label: '체험중' },
            { value: 'canceled', label: '취소됨' },
            { value: 'expired', label: '만료됨' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setStatusFilter(value); setPage(1) }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: statusFilter === value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: statusFilter === value ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 구독 테이블 */}
        <Card padding="none">
          {loading ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              로딩 중...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>사용자</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>플랜</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>금액</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>주기</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>상태</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>시작일</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>다음 결제일</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>남은 기간</th>
                    <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => {
                    const planBadge = getPlanBadge(sub.plan)
                    const statusBadge = getStatusBadge(sub.status)
                    const daysRemaining = getDaysRemaining(sub.currentPeriodEnd)
                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{sub.user.name || '-'}</p>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{sub.user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={planBadge}
                            >
                              {sub.planName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text)' }}>
                          ₩{sub.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                          {sub.billingCycle === 'monthly' ? '월간' : '연간'}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{ background: statusBadge.bg, color: statusBadge.color }}
                            >
                              {statusBadge.label}
                            </span>
                            {sub.cancelAtPeriodEnd && (
                              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                                기간 종료 시 해지 예정
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(sub.startDate)}
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                          {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="font-medium"
                            style={{
                              color: daysRemaining <= 7 ? '#ef4444' : daysRemaining <= 30 ? '#f59e0b' : 'var(--color-text)',
                            }}
                          >
                            {daysRemaining > 0 ? `${daysRemaining}일` : '만료됨'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {sub.status === 'active' && !sub.cancelAtPeriodEnd && (
                            <button
                              onClick={() => handleCancelSubscription(sub.id)}
                              disabled={processing === sub.id}
                              className="px-3 py-1 text-sm rounded disabled:opacity-50"
                              style={{ background: '#ef4444', color: 'white' }}
                            >
                              {processing === sub.id ? '처리중...' : '취소'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="px-4 py-2" style={{ color: 'var(--color-text)' }}>
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
            >
              다음
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
