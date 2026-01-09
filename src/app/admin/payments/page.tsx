'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout, useAppMode } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import { sampleData } from '@/lib/mode'

interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: string
  method: string | null
  description: string | null
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface PaymentStats {
  [key: string]: {
    count: number
    total: number
  }
}

export default function PaymentsPage() {
  const { isDemoMode, mounted } = useAppMode()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState<PaymentStats>({})
  const [filter, setFilter] = useState<string>('all')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)

    // 데모 모드: 샘플 데이터 사용
    if (isDemoMode) {
      const demoPayments = sampleData.payments.map((p, i) => ({
        id: p.id,
        userId: `user-${i}`,
        amount: p.amount,
        currency: 'KRW',
        status: p.status,
        method: p.method,
        description: `${['Pro 플랜', 'Enterprise 플랜', '추가 크레딧'][i % 3]} 결제`,
        createdAt: p.createdAt,
        user: {
          id: `user-${i}`,
          email: `${p.user.toLowerCase().replace(/\s/g, '')}@example.com`,
          name: p.user,
        },
      }))
      setPayments(demoPayments as Payment[])
      setTotal(demoPayments.length)
      setStats({
        completed: { count: 2, total: 128000 },
        pending: { count: 1, total: 299000 },
        refunded: { count: 1, total: 29000 },
      })
      setLoading(false)
      return
    }

    // 운영 모드: API에서 실제 데이터
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : ''
      const res = await fetch(`/api/admin/payments?page=${page}&limit=20${statusParam}`)
      const data = await res.json()
      setPayments(data.payments || [])
      setTotal(data.total || 0)
      setStats(data.stats || {})
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }, [page, filter, isDemoMode])

  useEffect(() => {
    if (mounted) {
      fetchPayments()
    }
  }, [fetchPayments, mounted])

  // 환불 처리
  const handleRefund = async (paymentId: string) => {
    if (!confirm('정말 환불하시겠습니까?')) return

    setProcessing(paymentId)
    try {
      if (isDemoMode) {
        // 데모 모드: UI만 업데이트
        setPayments(prev =>
          prev.map(p => p.id === paymentId ? { ...p, status: 'refunded' } : p)
        )
        alert('환불이 처리되었습니다 (데모)')
      } else {
        // 운영 모드: API 호출
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
      if (isDemoMode) {
        setPayments(prev =>
          prev.map(p => p.id === paymentId ? { ...p, status: 'completed' } : p)
        )
        alert('결제가 확인되었습니다 (데모)')
      } else {
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
      }
    } catch {
      alert('처리 중 오류가 발생했습니다')
    } finally {
      setProcessing(null)
    }
  }

  const totalRevenue = stats.completed?.total || 0
  const pendingAmount = stats.pending?.total || 0
  const refundedAmount = stats.refunded?.total || 0
  const completedCount = stats.completed?.count || 0

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
              <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                ₩{pendingAmount.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                대기 중
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#6b7280' }}>
                ₩{refundedAmount.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                환불액
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {completedCount}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                완료 건수
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
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
              onClick={() => { setFilter(value); setPage(1) }}
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
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>설명</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>금액</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>결제수단</th>
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
                        <td className="px-6 py-4" style={{ color: 'var(--color-text)' }}>{payment.description || '-'}</td>
                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text)' }}>
                          ₩{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{payment.method || '-'}</td>
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
                          {payment.status === 'completed' && (
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

        {/* 결제 설정 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>결제 연동 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>PortOne</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>카드, 계좌이체, 간편결제</p>
                </div>
                <span className="px-3 py-1 rounded text-sm font-medium" style={{ background: '#10b981', color: 'white' }}>
                  연결됨
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>토스페이먼츠</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>카드, 토스페이</p>
                </div>
                <Button size="sm" variant="secondary">연결하기</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>구독 플랜 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: '무료', price: 0 },
                { name: '프로', price: 9900 },
                { name: '엔터프라이즈', price: 99000 },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{plan.name}</p>
                  </div>
                  <p className="font-bold" style={{ color: 'var(--color-accent)' }}>
                    ₩{plan.price.toLocaleString()}/월
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
