'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

interface Subscription {
  id: string
  userId: string
  plan: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt: string | null
  trialEnd: string | null
  createdAt: string
  user: {
    email: string
    name: string | null
  }
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stats, setStats] = useState({ active: 0, canceled: 0, expired: 0, trial: 0 })

  // 모달 상태
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [extendDays, setExtendDays] = useState(30)
  const [processing, setProcessing] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/subscriptions?page=${page}&limit=20${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`)
      const data = await res.json()
      setSubscriptions(data.subscriptions || [])
      setTotal(data.total || 0)
      setStats(data.stats || { active: 0, canceled: 0, expired: 0, trial: 0 })
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

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

  // 연장 모달 열기
  const handleExtendClick = (sub: Subscription) => {
    setSelectedSubscription(sub)
    setExtendDays(30)
    setShowExtendModal(true)
  }

  // 구독 연장
  const handleExtend = async () => {
    if (!selectedSubscription) return

    setProcessing(true)
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSubscription.id,
          action: 'extend',
          days: extendDays,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '연장에 실패했습니다')
      }

      alert(`구독이 ${extendDays}일 연장되었습니다`)
      setShowExtendModal(false)
      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    } finally {
      setProcessing(false)
    }
  }

  // 구독 취소
  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`${sub.user.name || sub.user.email}의 구독을 취소하시겠습니까?`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sub.id,
          action: 'cancel',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '취소에 실패했습니다')
      }

      alert('구독이 취소되었습니다')
      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    }
  }

  // 구독 재활성화
  const handleReactivate = async (sub: Subscription) => {
    if (!confirm(`${sub.user.name || sub.user.email}의 구독을 재활성화하시겠습니까?`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sub.id,
          action: 'reactivate',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '재활성화에 실패했습니다')
      }

      alert('구독이 재활성화되었습니다')
      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    }
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

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                {stats.active}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                활성 구독
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                {stats.trial}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                체험 중
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                {stats.canceled}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                취소됨
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#6b7280' }}>
                {stats.expired}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                만료됨
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
          ) : subscriptions.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              구독이 없습니다
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>사용자</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>플랜</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>상태</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>시작일</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>만료일</th>
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
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={planBadge}
                          >
                            {sub.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ background: statusBadge.bg, color: statusBadge.color }}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(sub.currentPeriodStart)}
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(sub.currentPeriodEnd)}
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
                          {(sub.status === 'active' || sub.status === 'trial') && (
                            <>
                              <button
                                onClick={() => handleExtendClick(sub)}
                                className="px-3 py-1 text-sm rounded mr-2"
                                style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                              >
                                연장
                              </button>
                              {!sub.canceledAt && (
                                <button
                                  onClick={() => handleCancel(sub)}
                                  className="px-3 py-1 text-sm rounded"
                                  style={{ background: '#ef4444', color: 'white' }}
                                >
                                  취소
                                </button>
                              )}
                            </>
                          )}
                          {(sub.status === 'canceled' || sub.status === 'expired') && (
                            <button
                              onClick={() => handleReactivate(sub)}
                              className="px-3 py-1 text-sm rounded"
                              style={{ background: '#10b981', color: 'white' }}
                            >
                              재활성화
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
        {total > 20 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="px-4 py-2" style={{ color: 'var(--color-text)' }}>
              {page} / {Math.ceil(total / 20)}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
            >
              다음
            </Button>
          </div>
        )}
      </div>

      {/* 연장 모달 */}
      {showExtendModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-full max-w-md rounded-xl p-6"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                구독 연장
              </h2>
              <button
                onClick={() => setShowExtendModal(false)}
                className="text-2xl"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>사용자</p>
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                  {selectedSubscription.user.name || selectedSubscription.user.email}
                </p>
              </div>

              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>현재 만료일</p>
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                  {formatDate(selectedSubscription.currentPeriodEnd)}
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  연장 기간
                </label>
                <div className="flex gap-2">
                  {[7, 30, 90, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => setExtendDays(days)}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: extendDays === days ? 'var(--color-accent)' : 'var(--color-bg)',
                        color: extendDays === days ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      {days === 365 ? '1년' : `${days}일`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>새 만료일</p>
                <p className="font-medium text-lg" style={{ color: 'var(--color-accent)' }}>
                  {formatDate(new Date(new Date(selectedSubscription.currentPeriodEnd).getTime() + extendDays * 24 * 60 * 60 * 1000).toISOString())}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" onClick={() => setShowExtendModal(false)} disabled={processing}>
                  취소
                </Button>
                <Button onClick={handleExtend} disabled={processing}>
                  {processing ? '처리 중...' : '연장하기'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
