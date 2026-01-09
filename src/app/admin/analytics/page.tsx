'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

interface ChartData {
  pageview: Array<{ date: string; value: number }>
  signup: Array<{ date: string; value: number }>
  payment: Array<{ date: string; value: number }>
  ai_usage: Array<{ date: string; value: number }>
}

interface Summary {
  totalPageviews: number
  totalSignups: number
  totalPayments: number
  totalAIUsage: number
}

interface PlanDistribution {
  plan: string
  count: number
}

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<ChartData>({
    pageview: [],
    signup: [],
    payment: [],
    ai_usage: [],
  })
  const [summary, setSummary] = useState<Summary>({
    totalPageviews: 0,
    totalSignups: 0,
    totalPayments: 0,
    totalAIUsage: 0,
  })
  const [planDistribution, setPlanDistribution] = useState<PlanDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`)
      const data = await res.json()
      setChartData(data.chartData || { pageview: [], signup: [], payment: [], ai_usage: [] })
      setSummary(data.summary || { totalPageviews: 0, totalSignups: 0, totalPayments: 0, totalAIUsage: 0 })
      setPlanDistribution(data.planDistribution || [])
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // 차트 데이터 변환 - 최근 6개 항목만 표시
  const signupData = chartData.signup.slice(-6)
  const paymentData = chartData.payment.slice(-6)

  const maxSignups = Math.max(...signupData.map(d => d.value), 1)
  const maxPayments = Math.max(...paymentData.map(d => d.value), 1)

  // 플랜별 사용자 수
  const planCounts = planDistribution.reduce((acc, p) => {
    acc[p.plan] = p.count
    return acc
  }, {} as Record<string, number>)

  const totalUsers = planDistribution.reduce((sum, p) => sum + p.count, 0)
  const paidUsers = (planCounts['pro'] || 0) + (planCounts['enterprise'] || 0)
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : '0'

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              통계
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              서비스 성장 추이를 확인하세요
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: days === d ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: days === d ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {d}일
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            로딩 중...
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 가입자 차트 */}
              <Card>
                <CardHeader>
                  <CardTitle>일별 신규 가입</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {signupData.length > 0 ? (
                      signupData.map((data) => (
                        <div key={data.date} className="flex items-center gap-4">
                          <span
                            className="w-20 text-sm"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {new Date(data.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                            <div
                              className="h-full rounded-lg transition-all"
                              style={{
                                width: `${(data.value / maxSignups) * 100}%`,
                                background: 'var(--color-accent)',
                              }}
                            />
                          </div>
                          <span
                            className="w-16 text-right font-medium"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {data.value}명
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--color-text-secondary)' }}>데이터가 없습니다</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 결제 차트 */}
              <Card>
                <CardHeader>
                  <CardTitle>일별 결제</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentData.length > 0 ? (
                      paymentData.map((data) => (
                        <div key={data.date} className="flex items-center gap-4">
                          <span
                            className="w-20 text-sm"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {new Date(data.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                            <div
                              className="h-full rounded-lg transition-all"
                              style={{
                                width: `${(data.value / maxPayments) * 100}%`,
                                background: '#10b981',
                              }}
                            />
                          </div>
                          <span
                            className="w-16 text-right font-medium"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {data.value}건
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--color-text-secondary)' }}>데이터가 없습니다</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 요약 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                    {summary.totalSignups}
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {days}일간 신규 가입
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-4xl font-bold" style={{ color: '#10b981' }}>
                    {summary.totalPayments}
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {days}일간 결제 건수
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {conversionRate}%
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    유료 전환율
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {summary.totalAIUsage}
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {days}일간 AI 사용
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 플랜별 분포 */}
            <Card>
              <CardHeader>
                <CardTitle>플랜별 사용자 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {['free', 'pro', 'enterprise'].map((plan) => {
                    const count = planCounts[plan] || 0
                    const percentage = totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : '0'
                    return (
                      <div
                        key={plan}
                        className="p-4 rounded-lg text-center"
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                          {count}명
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {plan === 'free' ? '무료' : plan === 'pro' ? '프로' : '엔터프라이즈'} ({percentage}%)
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
