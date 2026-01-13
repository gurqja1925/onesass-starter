'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: string
  type: string
  method: string | null
  description: string | null
  orderName: string | null
  refundedAmount: number
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface PaymentStats {
  totalAmount: number
  totalRefunded: number
  totalCount: number
  byStatus: {
    [key: string]: {
      count: number
      amount: number
    }
  }
  byType: {
    [key: string]: {
      count: number
      amount: number
    }
  }
}

interface PricingPlan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  features: string[]
  popular: boolean
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 0 })
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = useState<string>('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])

  // 연도 목록 생성 (2024년부터 현재까지)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i)

  // 월 목록
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const fetchPayments = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '50',
        ...(filter !== 'all' && { status: filter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(year && { year }),
        ...(month !== 'all' && { month })
      })

      const res = await fetch(`/api/admin/payments?${params}`)
      const data = await res.json()

      if (data.success) {
        setPayments(data.data.payments || [])
        setPagination(data.data.pagination)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, filter, typeFilter, year, month])

  const fetchPricingPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/pricing')
      const data = await res.json()
      if (data.success) {
        setPricingPlans(data.plans || [])
      }
    } catch (error) {
      console.error('Failed to fetch pricing plans:', error)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  useEffect(() => {
    fetchPricingPlans()
  }, [fetchPricingPlans])

  // 환불 처리
  const handleRefund = async (paymentId: string) => {
    if (!confirm('정말 환불하시겠습니까?')) return

    setProcessing(paymentId)
    try {
      // API 호출
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refund', reason: '관리자 환불' }),
      })
      const data = await res.json()
      if (data.success) {
        fetchPayments()
        alert('환불이 처리되었습니다')
      } else {
        alert(data.error || '환불 처리 실패')
      }
    } catch {
      alert('환불 처리 중 오류가 발생했습니다')
    } finally {
      setProcessing(null)
    }
  }

  // 대기 결제 확인
  const handleConfirm = async (paymentId: string) => {
    setProcessing(paymentId)
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      const data = await res.json()
      if (data.success) {
        fetchPayments()
        alert('결제가 확인되었습니다')
      }
    } catch {
      alert('처리 중 오류가 발생했습니다')
    } finally {
      setProcessing(null)
    }
  }

  const totalRevenue = stats?.totalAmount || 0
  const totalRefunded = stats?.totalRefunded || 0
  const totalCount = stats?.totalCount || 0
  const completedCount = stats?.byStatus?.completed?.count || 0
  const pendingAmount = stats?.byStatus?.pending?.amount || 0
  const onetimeCount = stats?.byType?.onetime?.count || 0
  const subscriptionCount = stats?.byType?.subscription?.count || 0

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      completed: { bg: '#10b981', color: 'white', label: '완료' },
      pending: { bg: '#f59e0b', color: 'white', label: '대기' },
      failed: { bg: '#ef4444', color: 'white', label: '실패' },
      refunded: { bg: '#6b7280', color: 'white', label: '환불' },
    }
    return styles[status] || styles.completed
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            결제 관리
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            결제 내역 및 매출을 관리하세요
          </p>
        </div>

        {/* 연도/월 필터 */}
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium mr-2" style={{ color: 'var(--color-text)' }}>연도:</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
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
              onChange={(e) => { setMonth(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
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
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                ₩{totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                총 매출
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                ₩{totalRefunded.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                환불액
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {totalCount}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                총 결제 건수
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-2xl font-bold" style={{ color: '#6b7280' }}>
                💳 {onetimeCount} / 🔄 {subscriptionCount}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                일반 / 구독
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
        <div className="flex gap-4">
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>상태 필터</p>
            <div className="flex gap-2">
              {[
                { value: 'all', label: '전체' },
                { value: 'completed', label: '완료' },
                { value: 'pending', label: '대기' },
                { value: 'failed', label: '실패' },
                { value: 'refunded', label: '환불' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFilter(value); setPagination(p => ({ ...p, page: 1 })) }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: filter === value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                    color: filter === value ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>유형 필터</p>
            <div className="flex gap-2">
              {[
                { value: 'all', label: '전체' },
                { value: 'onetime', label: '💳 일반' },
                { value: 'subscription', label: '🔄 구독' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setTypeFilter(value); setPagination(p => ({ ...p, page: 1 })) }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: typeFilter === value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                    color: typeFilter === value ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결제 내역 테이블 */}
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
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>주문명</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>유형</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>금액</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>환불</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>상태</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>날짜</th>
                    <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const badge = getStatusBadge(payment.status)
                    return (
                      <tr key={payment.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{payment.user.name || '-'}</p>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{payment.user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text)' }}>{payment.orderName || payment.description || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm">
                            {payment.type === 'onetime' ? '💳 일반' : '🔄 구독'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text)' }}>
                          ₩{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4" style={{ color: payment.refundedAmount > 0 ? '#ef4444' : 'var(--color-text-secondary)' }}>
                          {payment.refundedAmount > 0 ? `₩${payment.refundedAmount.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ background: badge.bg, color: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{formatDate(payment.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          {payment.status === 'completed' && payment.refundedAmount < payment.amount && (
                            <button
                              onClick={() => handleRefund(payment.id)}
                              disabled={processing === payment.id}
                              className="px-3 py-1 text-sm rounded disabled:opacity-50"
                              style={{ background: '#ef4444', color: 'white' }}
                            >
                              {processing === payment.id ? '처리중...' : '환불'}
                            </button>
                          )}
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(payment.id)}
                              disabled={processing === payment.id}
                              className="px-3 py-1 text-sm rounded disabled:opacity-50"
                              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                            >
                              {processing === payment.id ? '처리중...' : '확인'}
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
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page === 1}
            >
              이전
            </Button>
            <span className="px-4 py-2" style={{ color: 'var(--color-text)' }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
            >
              다음
            </Button>
          </div>
        )}

        {/* 결제 설정 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>결제 연동 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>TossPayments</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>카드, 토스페이, 간편결제</p>
                  <p className="text-xs mt-1" style={{ color: '#f59e0b' }}>
                    ⚠️ 테스트 모드 - 실제 결제 전 실제 키로 변경 필요
                  </p>
                </div>
                <span className="px-3 py-1 rounded text-sm font-medium" style={{ background: '#10b981', color: 'white' }}>
                  연결됨
                </span>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>결제 유형:</strong> 일반결제, 정기결제(구독) 지원<br />
                  <strong>테스트 키:</strong> test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq<br />
                  <strong>프로덕션:</strong> .env 파일에서 실제 키로 변경 후 배포
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>관련 메뉴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => window.location.href = '/admin/subscriptions'}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>구독 관리</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      활성 구독 및 구독자 관리
                    </p>
                  </div>
                </div>
                <span style={{ color: 'var(--color-text-secondary)' }}>→</span>
              </button>

              <button
                onClick={() => window.location.href = '/admin/pricing'}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>프라이싱 설정</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      가격 플랜 생성 및 편집
                    </p>
                  </div>
                </div>
                <span style={{ color: 'var(--color-text-secondary)' }}>→</span>
              </button>

              <button
                onClick={() => window.location.href = '/admin/payment-settings'}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>결제 설정</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      환불 정책 및 결제 규칙
                    </p>
                  </div>
                </div>
                <span style={{ color: 'var(--color-text-secondary)' }}>→</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
