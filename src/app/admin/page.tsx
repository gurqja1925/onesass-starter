'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout, DashboardStats, RecentActivity, useAppMode, Activity } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { sampleData } from '@/lib/mode'

interface TopUser {
  id: string
  email: string
  name: string | null
  plan: string
  paymentCount: number
  aiUsageCount: number
}

interface RevenueData {
  date: string
  value: number
}

export default function AdminPage() {
  const { isDemoMode, mounted } = useAppMode()
  const [activities, setActivities] = useState<Activity[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [planStats, setPlanStats] = useState<{ plan: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    // 데모 모드: 샘플 데이터 사용
    if (isDemoMode) {
      setActivities(sampleData.activities as Activity[])
      setTopUsers(sampleData.users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        plan: u.plan,
        paymentCount: Math.floor(Math.random() * 10),
        aiUsageCount: Math.floor(Math.random() * 50),
      })))
      // 최근 7일 샘플 매출 데이터
      const last7Days = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 15) + 5,
      })).reverse()
      setRevenueData(last7Days)
      setPlanStats([
        { plan: 'free', count: 850 },
        { plan: 'pro', count: 320 },
        { plan: 'enterprise', count: 64 },
      ])
      setLoading(false)
      return
    }

    // 운영 모드: API에서 실제 데이터 가져오기
    try {
      const [activitiesRes, usersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/activities?limit=8'),
        fetch('/api/admin/users?limit=5'),
        fetch('/api/admin/analytics?days=7'),
      ])

      const activitiesData = await activitiesRes.json()
      const usersData = await usersRes.json()
      const analyticsData = await analyticsRes.json()

      setActivities(activitiesData.activities || [])
      setTopUsers(usersData.users || [])
      setRevenueData(analyticsData.chartData?.payment || [])
      setPlanStats(analyticsData.planDistribution || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [isDemoMode])

  useEffect(() => {
    if (mounted) {
      fetchDashboardData()
    }
  }, [fetchDashboardData, mounted])

  const totalPlanUsers = planStats.reduce((sum, p) => sum + p.count, 0)
  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            대시보드
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            서비스 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* 관리자 권한 안내 */}
        <div className="p-4 rounded-xl border" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)' }}>
          <div className="flex items-start gap-3">
            <span className="text-xl">👑</span>
            <div>
              <h4 className="font-bold mb-1" style={{ color: '#facc15' }}>관리자 권한 안내</h4>
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                <strong style={{ color: '#fde047' }}>처음 가입한 사용자가 관리자(Admin)입니다.</strong>
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                이 페이지는 관리자만 접근 가능합니다. 사용자 관리, 결제 현황, 통계를 확인하고 관리할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 주요 통계 */}
        <DashboardStats />

        {/* 주간 매출 차트 & 플랜 분포 */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>주간 결제 추이</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
              ) : revenueData.length > 0 ? (
                <div className="space-y-3">
                  {revenueData.slice(-7).map((data) => (
                    <div key={data.date} className="flex items-center gap-4">
                      <span
                        className="w-16 text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {new Date(data.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                        <div
                          className="h-full rounded-lg transition-all"
                          style={{
                            width: `${(data.value / maxRevenue) * 100}%`,
                            background: 'linear-gradient(90deg, var(--color-accent), #10b981)',
                          }}
                        />
                      </div>
                      <span
                        className="w-12 text-right font-medium text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {data.value}건
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)' }}>데이터가 없습니다</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>플랜 분포</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
              ) : (
                <div className="space-y-4">
                  {[
                    { key: 'free', label: '무료', color: '#6b7280' },
                    { key: 'pro', label: '프로', color: 'var(--color-accent)' },
                    { key: 'enterprise', label: '엔터프라이즈', color: '#8b5cf6' },
                  ].map(({ key, label, color }) => {
                    const count = planStats.find(p => p.plan === key)?.count || 0
                    const percentage = totalPlanUsers > 0 ? (count / totalPlanUsers) * 100 : 0
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: 'var(--color-text)' }}>{label}</span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>{count}명 ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${percentage}%`, background: color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 & 상위 사용자 & 빠른 작업 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 최근 활동 */}
          {loading ? (
            <Card>
              <CardContent>
                <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
              </CardContent>
            </Card>
          ) : (
            <RecentActivity activities={activities} />
          )}

          {/* 상위 사용자 */}
          <Card>
            <CardHeader>
              <CardTitle>활발한 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
              ) : (
                <div className="space-y-3">
                  {topUsers.slice(0, 5).map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ background: index === 0 ? 'var(--color-bg)' : 'transparent' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background: index === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                          color: index === 0 ? 'var(--color-bg)' : 'var(--color-text)',
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                          {user.name || user.email.split('@')[0]}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
                          AI {user.aiUsageCount}회 / 결제 {user.paymentCount}회
                        </p>
                      </div>
                      <span
                        className="px-2 py-0.5 text-xs rounded"
                        style={{
                          background: user.plan === 'enterprise' ? '#8b5cf6' : user.plan === 'pro' ? 'var(--color-accent)' : 'var(--color-border)',
                          color: user.plan === 'free' ? 'var(--color-text)' : 'white',
                        }}
                      >
                        {user.plan}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 빠른 작업 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: '/admin/users', icon: '👥', label: '사용자 관리' },
                  { href: '/admin/payments', icon: '💳', label: '결제 관리' },
                  { href: '/admin/subscriptions', icon: '📋', label: '구독 관리' },
                  { href: '/admin/ai-usage', icon: '🤖', label: 'AI 사용량' },
                  { href: '/admin/contents', icon: '📝', label: '콘텐츠 관리' },
                  { href: '/admin/analytics', icon: '📈', label: '통계' },
                  { href: '/admin/logs', icon: '📜', label: '활동 로그' },
                  { href: '/admin/settings', icon: '⚙️', label: '설정' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="p-3 rounded-lg text-center transition-all hover:scale-105"
                    style={{ background: 'var(--color-bg)' }}
                  >
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text)' }}>{item.label}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 시스템 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '서버 상태', status: 'online', statusLabel: '정상' },
                { label: '데이터베이스', status: 'online', statusLabel: '연결됨' },
                { label: '결제 시스템', status: 'online', statusLabel: 'PortOne' },
                { label: 'AI 서비스', status: 'online', statusLabel: '활성화' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-lg text-center"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.status === 'online' ? '#10b981' : '#ef4444' }}
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.statusLabel}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
