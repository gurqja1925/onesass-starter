'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { formatPrice } from '@/onesaas-core/payment/config'

interface PaymentHistory {
  id: string
  type: 'onetime' | 'subscription'
  orderName: string
  amount: number
  status: 'completed' | 'active' | 'pending' | 'failed' | 'canceled' | 'expired'
  date: string
  orderId: string
  billingCycle?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
  daysRemaining?: number
}

type ModalType = 'cancel' | 'change' | null

export default function PaymentHistoryPage() {
  const [history, setHistory] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState<ModalType>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)

  // 결제 내역 및 구독 상태 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 결제 내역 가져오기
        const historyRes = await fetch('/api/payment/history')
        const historyData = await historyRes.json()

        if (historyData.success) {
          // 구독 상태별로 남은 기간 계산
          const enrichedHistory = historyData.history.map((item: any) => {
            if (item.type === 'subscription' && item.currentPeriodEnd) {
              const now = new Date()
              const periodEnd = new Date(item.currentPeriodEnd)
              const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              
              return {
                ...item,
                daysRemaining: Math.max(0, daysRemaining)
              }
            }
            return item
          })
          
          setHistory(enrichedHistory || [])
        }

        // 구독 상태 가져오기
        const subscriptionRes = await fetch('/api/subscription/check')
        const subscriptionData = await subscriptionRes.json()
        
        if (subscriptionRes.ok) {
          setSubscriptionStatus(subscriptionData)
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const getStatusBadge = (status: PaymentHistory['status']) => {
    const styles = {
      completed: { bg: '#10b981', text: '완료' },
      active: { bg: 'var(--color-accent)', text: '활성' },
      pending: { bg: '#f59e0b', text: '대기' },
      failed: { bg: '#ef4444', text: '실패' },
      canceled: { bg: '#6b7280', text: '취소됨' },
      expired: { bg: '#6b7280', text: '만료됨' }
    }

    const style = styles[status] || styles.completed

    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ background: style.bg, color: '#fff' }}
      >
        {style.text}
      </span>
    )
  }

  const getTypeBadge = (type: 'onetime' | 'subscription') => {
    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)'
        }}
      >
        {type === 'onetime' ? '💳 일반' : '🔄 구독'}
      </span>
    )
  }

  const handleCancelSubscription = (payment: PaymentHistory) => {
    setSelectedPayment(payment)
    setShowModal('cancel')
  }

  const handleChangePlan = (payment: PaymentHistory) => {
    setSelectedPayment(payment)
    setShowModal('change')
  }

  const confirmCancel = async () => {
    if (!selectedPayment) return

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: selectedPayment.id,
          reason: '사용자 요청',
          immediate: false // 기간 종료 시 취소
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('구독이 취소되었습니다. 현재 구독 기간 종료 시 자동으로 해지됩니다.')
        // 페이지 새로고침 (실제로는 상태 업데이트)
        window.location.reload()
      } else {
        alert(`취소 실패: ${data.error}`)
      }
    } catch (error) {
      alert('구독 취소 중 오류가 발생했습니다.')
      console.error(error)
    } finally {
      setShowModal(null)
      setSelectedPayment(null)
    }
  }

  const confirmChange = async (newPlan: string) => {
    if (!selectedPayment) return

    try {
      const response = await fetch('/api/subscription/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: selectedPayment.id,
          newPlan: newPlan.toLowerCase(),
          immediate: true // 즉시 변경
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`플랜이 ${newPlan}으로 변경되었습니다.`)
        // 페이지 새로고침 (실제로는 상태 업데이트)
        window.location.reload()
      } else {
        alert(`플랜 변경 실패: ${data.error}`)
      }
    } catch (error) {
      alert('플랜 변경 중 오류가 발생했습니다.')
      console.error(error)
    } finally {
      setShowModal(null)
      setSelectedPayment(null)
    }
  }

  return (
    <DashboardLayout title="결제 내역">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">📜 결제 내역</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            지금까지의 결제 및 구독 내역을 확인하세요
          </p>
        </div>

        {/* Subscription Status Card */}
        {subscriptionStatus && subscriptionStatus.hasActiveSubscription && (
          <div
            className="p-4 rounded-xl mb-6"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-accent), #10b981)', 
              border: '1px solid var(--color-border)' 
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  🎯 현재 구독 중
                </h2>
                <p className="text-sm text-white/90 mb-2">
                  {subscriptionStatus.subscription?.planName}
                </p>
                {subscriptionStatus.subscription?.currentPeriodEnd && (
                  <div className="text-xs text-white/80">
                    다음 결제일: {new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
                    {subscriptionStatus.subscription?.daysRemaining && (
                      <span> (남은 {subscriptionStatus.subscription.daysRemaining}일)</span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {formatPrice(subscriptionStatus.subscription?.amount || 0)}
                </div>
                <div className="text-xs text-white/80">
                  {subscriptionStatus.subscription?.billingCycle === 'monthly' ? '월간' : '연간'} 구독
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History List */}
        {loading ? (
          <div
            className="p-8 rounded-xl text-center"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              결제 내역을 불러오는 중...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.length === 0 ? (
              <div
                className="p-8 rounded-xl text-center"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  아직 결제 내역이 없습니다
                </p>
              </div>
            ) : (
              history.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 rounded-xl transition-all hover:shadow-lg"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-bold">{payment.orderName}</h3>
                        {getTypeBadge(payment.type)}
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        <span>📅 {payment.date}</span>
                        <span className="truncate">🔑 {payment.orderId}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
                        {formatPrice(payment.amount)}
                      </div>
                      {payment.type === 'subscription' && (
                        <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                          {payment.billingCycle === 'monthly' ? '월간' : '연간'} 자동결제
                        </div>
                      )}
                      {payment.type === 'subscription' && payment.currentPeriodEnd && (
                        <div className="text-xs mt-0.5 space-y-0.5">
                          <div style={{ color: payment.daysRemaining && payment.daysRemaining <= 7 ? '#ef4444' : 'var(--color-text-secondary)' }}>
                            📅 {payment.currentPeriodEnd}까지
                          </div>
                          {payment.daysRemaining !== undefined && (
                            <div style={{ 
                              color: payment.daysRemaining <= 7 ? '#ef4444' : 'var(--color-text-secondary)',
                              fontWeight: payment.daysRemaining <= 7 ? 'bold' : 'normal'
                            }}>
                              {payment.daysRemaining > 0 
                                ? `남은 기간: ${payment.daysRemaining}일` 
                                : payment.daysRemaining === 0 
                                  ? '오늘 만료' 
                                  : '만료됨'
                              }
                            </div>
                          )}
                        </div>
                      )}
                      {payment.cancelAtPeriodEnd && (
                        <div className="text-xs mt-0.5" style={{ color: '#ef4444' }}>
                          🚫 취소 예정
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {payment.type === 'subscription' && payment.status === 'active' && !payment.cancelAtPeriodEnd && (
                    <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <button
                        onClick={() => handleChangePlan(payment)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        🔀 플랜 변경
                      </button>
                      <button
                        onClick={() => handleCancelSubscription(payment)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: '#ef4444', color: '#fff' }}
                      >
                        ❌ 구독 취소
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Info */}
        <div
          className="p-4 rounded-xl mt-6"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="text-base font-bold mb-2">💡 안내</h3>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <li>✓ 일반 결제는 1회성 결제입니다</li>
            <li>✓ 구독 결제는 선택한 주기로 자동으로 결제됩니다</li>
            <li>✓ 구독은 언제든지 취소할 수 있습니다</li>
            <li>✓ 영수증은 이메일로 자동 발송됩니다</li>
          </ul>
        </div>

        {/* Cancel Modal */}
        {showModal === 'cancel' && selectedPayment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div
              className="max-w-lg w-full p-6 rounded-xl"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <h2 className="text-xl font-bold mb-3">❌ 구독 취소</h2>
              <div className="mb-4">
                <p className="text-sm mb-3">
                  <strong>{selectedPayment.orderName}</strong> 구독을 취소하시겠습니까?
                </p>
                <div
                  className="p-3 rounded-lg mb-3"
                  style={{ background: 'var(--color-bg-secondary)' }}
                >
                  <h3 className="text-sm font-bold mb-1.5">취소 정책 안내</h3>
                  <ul className="text-xs space-y-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <li>✓ 취소 즉시 다음 결제가 중단됩니다</li>
                    <li>✓ 현재 구독 기간까지 서비스를 이용할 수 있습니다</li>
                    <li>✓ 이미 결제된 금액은 환불되지 않습니다</li>
                    <li>✓ 언제든지 다시 구독할 수 있습니다</li>
                  </ul>
                </div>
                <div
                  className="p-3 rounded-lg text-xs"
                  style={{ background: '#fef3c7', color: '#92400e' }}
                >
                  <strong>⚠️ 주의:</strong> 구독 취소 후에는 프리미엄 기능을 사용할 수 없습니다.
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowModal(null)
                    setSelectedPayment(null)
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  돌아가기
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{ background: '#ef4444', color: '#fff' }}
                >
                  취소하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Plan Modal */}
        {showModal === 'change' && selectedPayment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div
              className="max-w-2xl w-full p-6 rounded-xl"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <h2 className="text-xl font-bold mb-3">🔀 플랜 변경</h2>
              <p className="text-sm mb-4">
                현재: <strong>{selectedPayment.orderName}</strong>
              </p>

              {/* Plan Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {[
                  { name: 'Starter', price: 10000, features: ['기본 기능', '월 1,000회'] },
                  { name: 'Pro', price: 30000, features: ['모든 기능', '월 10,000회'] },
                  { name: 'Enterprise', price: 100000, features: ['무제한', '24/7 지원'] }
                ].map((plan) => (
                  <button
                    key={plan.name}
                    onClick={() => confirmChange(plan.name)}
                    className="p-3 rounded-lg text-left transition-all hover:opacity-80"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '2px solid var(--color-border)'
                    }}
                  >
                    <h3 className="font-bold text-base mb-1.5">{plan.name}</h3>
                    <div className="text-lg font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                      {formatPrice(plan.price)}
                      <span className="text-xs font-normal" style={{ color: 'var(--color-text-secondary)' }}>
                        /월
                      </span>
                    </div>
                    <ul className="text-xs space-y-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      {plan.features.map((f, i) => (
                        <li key={i}>✓ {f}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div
                className="p-3 rounded-lg mb-4"
                style={{ background: 'var(--color-bg-secondary)' }}
              >
                <h3 className="text-sm font-bold mb-1.5">플랜 변경 안내</h3>
                <ul className="text-xs space-y-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>✓ 즉시 새로운 플랜으로 변경됩니다</li>
                  <li>✓ 남은 기간에 대해 일할 계산으로 차액 정산</li>
                  <li>✓ 다음 결제일부터 새로운 금액이 청구됩니다</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowModal(null)
                  setSelectedPayment(null)
                }}
                className="w-full py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
