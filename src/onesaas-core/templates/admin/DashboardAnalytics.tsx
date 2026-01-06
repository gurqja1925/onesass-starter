'use client'

/**
 * DashboardAnalytics 템플릿
 * 분석 대시보드
 */

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Users, Eye, Clock, Activity,
  ArrowUpRight, ArrowDownRight, MoreVertical
} from 'lucide-react'
import { LineChart } from '@/onesaas-core/ui/charts'

interface StatCard {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: React.ReactNode
}

interface DashboardAnalyticsProps {
  stats?: StatCard[]
  recentActivity?: { title: string; time: string; type: string }[]
  className?: string
}

export function DashboardAnalytics({
  stats,
  recentActivity,
  className = '',
}: DashboardAnalyticsProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')

  const defaultStats: StatCard[] = stats || [
    { title: '총 방문자', value: '24,512', change: 12.5, trend: 'up', icon: <Users className="w-5 h-5" /> },
    { title: '페이지뷰', value: '89,234', change: 8.2, trend: 'up', icon: <Eye className="w-5 h-5" /> },
    { title: '평균 체류시간', value: '4분 23초', change: -3.1, trend: 'down', icon: <Clock className="w-5 h-5" /> },
    { title: '전환율', value: '3.24%', change: 0.8, trend: 'up', icon: <Activity className="w-5 h-5" /> },
  ]

  const defaultActivity = recentActivity || [
    { title: '새로운 사용자 가입', time: '2분 전', type: 'user' },
    { title: '결제 완료', time: '15분 전', type: 'payment' },
    { title: '문의 접수', time: '1시간 전', type: 'support' },
    { title: '리뷰 작성', time: '2시간 전', type: 'review' },
  ]

  return (
    <div className={`p-6 ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            분석 대시보드
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            실시간 통계 및 분석
          </p>
        </div>

        {/* 기간 선택 */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
          {(['day', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-2 text-sm rounded-md transition-all"
              style={{
                background: period === p ? 'var(--color-accent)' : 'transparent',
                color: period === p ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              {p === 'day' ? '일간' : p === 'week' ? '주간' : '월간'}
            </button>
          ))}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {defaultStats.map((stat, i) => (
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
              <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                <MoreVertical className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <h3 className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.title}
            </h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {stat.value}
              </span>
              <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 차트 */}
        <div
          className="lg:col-span-2 p-6 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>방문자 추이</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                이번 주
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                지난 주
              </span>
            </div>
          </div>
          <LineChart
            data={{
              labels: ['월', '화', '수', '목', '금', '토', '일'],
              datasets: [
                {
                  label: '이번 주',
                  data: [3200, 4100, 3800, 5200, 4800, 3900, 4500],
                  borderColor: '#00ff88',
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                },
                {
                  label: '지난 주',
                  data: [2800, 3500, 3200, 4100, 4200, 3600, 4000],
                  borderColor: '#6b7280',
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                },
              ],
            }}
            height={256}
            showLegend={false}
          />
        </div>

        {/* 최근 활동 */}
        <div
          className="p-6 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>최근 활동</h3>
          <div className="space-y-4">
            {defaultActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 mt-2 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {activity.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
