'use client'

/**
 * DashboardSaaS 템플릿
 * SaaS 대시보드
 */

import { useState } from 'react'
import {
  Users, CreditCard, Activity, Zap,
  ArrowUpRight, ArrowDownRight, ChevronRight,
  CheckCircle, XCircle, Clock
} from 'lucide-react'
import { AreaChart } from '@/onesaas-core/ui/charts'

interface Subscription {
  plan: string
  count: number
  revenue: number
  color: string
}

interface Customer {
  id: string
  name: string
  email: string
  plan: string
  status: 'active' | 'trial' | 'churned'
  mrr: number
}

interface DashboardSaaSProps {
  subscriptions?: Subscription[]
  customers?: Customer[]
  className?: string
}

export function DashboardSaaS({
  subscriptions,
  customers,
  className = '',
}: DashboardSaaSProps) {
  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const stats = [
    { title: 'MRR', value: `₩${formatKRW(45670000)}`, change: 12.5, trend: 'up', icon: <CreditCard className="w-5 h-5" /> },
    { title: '활성 구독자', value: '1,234', change: 8.2, trend: 'up', icon: <Users className="w-5 h-5" /> },
    { title: '이탈률', value: '2.3%', change: -0.5, trend: 'down', icon: <Activity className="w-5 h-5" /> },
    { title: 'ARPU', value: `₩${formatKRW(37000)}`, change: 3.1, trend: 'up', icon: <Zap className="w-5 h-5" /> },
  ]

  const defaultSubscriptions: Subscription[] = subscriptions || [
    { plan: 'Enterprise', count: 45, revenue: 22500000, color: '#8b5cf6' },
    { plan: 'Pro', count: 234, revenue: 16380000, color: '#3b82f6' },
    { plan: 'Starter', count: 567, revenue: 5670000, color: '#10b981' },
    { plan: 'Free Trial', count: 388, revenue: 0, color: '#94a3b8' },
  ]

  const defaultCustomers: Customer[] = customers || [
    { id: '1', name: '(주)테크코퍼레이션', email: 'admin@techcorp.kr', plan: 'Enterprise', status: 'active', mrr: 500000 },
    { id: '2', name: '스타트업인큐', email: 'ceo@startupinc.kr', plan: 'Pro', status: 'active', mrr: 70000 },
    { id: '3', name: '디자인스튜디오', email: 'hello@design.kr', plan: 'Pro', status: 'trial', mrr: 70000 },
    { id: '4', name: '마케팅허브', email: 'info@mkhub.kr', plan: 'Starter', status: 'churned', mrr: 10000 },
  ]

  const statusIcons = {
    active: <CheckCircle className="w-4 h-4 text-green-500" />,
    trial: <Clock className="w-4 h-4 text-yellow-500" />,
    churned: <XCircle className="w-4 h-4 text-red-500" />,
  }

  const statusLabels = {
    active: '활성',
    trial: '체험판',
    churned: '이탈',
  }

  const totalRevenue = defaultSubscriptions.reduce((sum, sub) => sum + sub.revenue, 0)

  return (
    <div className={`p-6 ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            SaaS 대시보드
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            구독 현황 및 수익 분석
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium"
          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          리포트 다운로드
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {stat.icon}
              </div>
              <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <h3 className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.title}</h3>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* MRR 추이 차트 */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>MRR 추이 (최근 6개월)</h3>
        <AreaChart
          data={{
            labels: ['8월', '9월', '10월', '11월', '12월', '1월'],
            datasets: [
              {
                label: 'MRR',
                data: [32500000, 35200000, 38900000, 41200000, 43800000, 45670000],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.2)',
              },
            ],
          }}
          height={200}
          showLegend={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 플랜별 구독 현황 */}
        <div
          className="p-6 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>플랜별 현황</h3>

          <div className="space-y-4">
            {defaultSubscriptions.map((sub) => (
              <div key={sub.plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{sub.plan}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {sub.count}명
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(sub.revenue / totalRevenue) * 100}%`,
                      background: sub.color,
                    }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  ₩{formatKRW(sub.revenue)}/월
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 고객 */}
        <div
          className="lg:col-span-2 p-6 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>최근 고객</h3>
            <button className="text-sm flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
              전체보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <th className="pb-3 font-medium">고객</th>
                <th className="pb-3 font-medium">플랜</th>
                <th className="pb-3 font-medium">상태</th>
                <th className="pb-3 font-medium text-right">MRR</th>
              </tr>
            </thead>
            <tbody>
              {defaultCustomers.map((customer) => (
                <tr key={customer.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-3">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{customer.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{customer.email}</p>
                  </td>
                  <td className="py-3">
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                    >
                      {customer.plan}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {statusIcons[customer.status]}
                      <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                        {statusLabels[customer.status]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium" style={{ color: 'var(--color-text)' }}>
                    ₩{formatKRW(customer.mrr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
