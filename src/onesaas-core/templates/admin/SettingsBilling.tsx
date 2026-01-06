'use client'

/**
 * SettingsBilling 템플릿
 * 결제/청구 설정
 */

import { useState } from 'react'
import {
  CreditCard, Check, Crown, Zap, Building, Download,
  ChevronRight, AlertTriangle
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

interface SettingsBillingProps {
  currentPlan?: string
  plans?: Plan[]
  invoices?: Invoice[]
  paymentMethod?: { last4: string; brand: string; expiry: string }
  onUpgrade?: (planId: string) => void
  className?: string
}

export function SettingsBilling({
  currentPlan = 'pro',
  plans,
  invoices,
  paymentMethod,
  onUpgrade,
  className = '',
}: SettingsBillingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const defaultPlans: Plan[] = plans || [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 9900 : 99000,
      interval: billingCycle,
      features: ['사용자 3명', '기본 분석', '이메일 지원', '1GB 저장공간'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 29900 : 299000,
      interval: billingCycle,
      features: ['사용자 10명', '고급 분석', '우선 지원', '10GB 저장공간', 'API 접근'],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 99900 : 999000,
      interval: billingCycle,
      features: ['무제한 사용자', '맞춤 분석', '전담 지원', '무제한 저장공간', 'API 접근', 'SSO'],
    },
  ]

  const defaultInvoices: Invoice[] = invoices || [
    { id: 'INV-001', date: '2024-01-01', amount: 29900, status: 'paid' },
    { id: 'INV-002', date: '2023-12-01', amount: 29900, status: 'paid' },
    { id: 'INV-003', date: '2023-11-01', amount: 29900, status: 'paid' },
  ]

  const defaultPayment = paymentMethod || {
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
  }

  const statusLabels = {
    paid: { label: '결제완료', color: 'bg-green-100 text-green-700' },
    pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
    failed: { label: '실패', color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className={`p-6 max-w-4xl mx-auto ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          결제 및 청구
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          구독 플랜과 결제 정보를 관리하세요
        </p>
      </div>

      {/* 현재 플랜 */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <Crown className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>현재 플랜</p>
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {defaultPlans.find(p => p.id === currentPlan)?.name || 'Pro'} 플랜
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>다음 결제일</p>
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>2024년 2월 1일</p>
          </div>
        </div>
      </div>

      {/* 플랜 선택 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            플랜 변경
          </h2>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              className="px-4 py-2 text-sm rounded-md transition-all"
              style={{
                background: billingCycle === 'monthly' ? 'var(--color-accent)' : 'transparent',
                color: billingCycle === 'monthly' ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              월간
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className="px-4 py-2 text-sm rounded-md transition-all flex items-center gap-1"
              style={{
                background: billingCycle === 'yearly' ? 'var(--color-accent)' : 'transparent',
                color: billingCycle === 'yearly' ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              연간 <span className="text-xs text-green-500">-17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {defaultPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-xl relative ${plan.popular ? 'ring-2' : ''}`}
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                ...(plan.popular && { borderColor: 'var(--color-accent)' }),
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  인기
                </span>
              )}

              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                  ₩{formatKRW(plan.price)}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  /{billingCycle === 'monthly' ? '월' : '년'}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onUpgrade?.(plan.id)}
                disabled={plan.id === currentPlan}
                className="w-full py-2 rounded-lg font-medium transition-all"
                style={{
                  background: plan.id === currentPlan ? 'var(--color-bg)' : 'var(--color-accent)',
                  color: plan.id === currentPlan ? 'var(--color-text-secondary)' : 'var(--color-bg)',
                  cursor: plan.id === currentPlan ? 'default' : 'pointer',
                }}
              >
                {plan.id === currentPlan ? '현재 플랜' : '업그레이드'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 수단 */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          결제 수단
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-bg)' }}
            >
              <CreditCard className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                {defaultPayment.brand} •••• {defaultPayment.last4}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                만료: {defaultPayment.expiry}
              </p>
            </div>
          </div>
          <button className="text-sm px-3 py-1 rounded" style={{ color: 'var(--color-accent)' }}>
            변경
          </button>
        </div>
      </div>

      {/* 청구 내역 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            청구 내역
          </h2>
          <button className="text-sm flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
            전체보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <th className="pb-3 font-medium">청구서</th>
              <th className="pb-3 font-medium">날짜</th>
              <th className="pb-3 font-medium">금액</th>
              <th className="pb-3 font-medium">상태</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {defaultInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="py-3 font-medium" style={{ color: 'var(--color-text)' }}>
                  {invoice.id}
                </td>
                <td className="py-3" style={{ color: 'var(--color-text)' }}>
                  {invoice.date}
                </td>
                <td className="py-3" style={{ color: 'var(--color-text)' }}>
                  ₩{formatKRW(invoice.amount)}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusLabels[invoice.status].color}`}>
                    {statusLabels[invoice.status].label}
                  </span>
                </td>
                <td className="py-3">
                  <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Download className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
