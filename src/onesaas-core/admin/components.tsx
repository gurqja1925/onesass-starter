'use client'

/**
 * 관리자 컴포넌트
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAdminMenuItems } from './config'
import { useAdminAuth, useAdminStats } from './hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Loading } from '../ui/Loading'

/**
 * 관리자 레이아웃
 */
export function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminAuth()
  const pathname = usePathname()
  const menuItems = getAdminMenuItems()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-bg)' }}
      >
        <Loading size="lg" text="권한 확인 중..." />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-bg)' }}
      >
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-6xl mb-4">🔒</p>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              접근 권한이 없습니다
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              관리자 권한이 필요한 페이지입니다
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-2 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              홈으로 돌아가기
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* 사이드바 */}
      <aside
        className="w-64 border-r flex-shrink-0"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <span
              className="text-xl font-bold"
              style={{ color: 'var(--color-accent)' }}
            >
              관리자
            </span>
          </Link>
        </div>

        <nav className="px-4 py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors"
                style={{
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

/**
 * 통계 카드
 */
interface StatCardProps {
  title: string
  value: string | number
  icon: string
  change?: number
  changeLabel?: string
}

export function StatCard({ title, value, icon, change, changeLabel }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: 'var(--color-bg)' }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {title}
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {value}
          </p>
        </div>
        {change !== undefined && (
          <div
            className="text-sm font-medium"
            style={{ color: change >= 0 ? '#10b981' : '#ef4444' }}
          >
            {change >= 0 ? '+' : ''}{change}%
            {changeLabel && (
              <span
                className="block text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * 대시보드 통계
 */
export function DashboardStats() {
  const { stats, loading, error } = useAdminStats()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent>
              <Loading size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {error || '통계를 불러올 수 없습니다'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="전체 사용자"
        value={stats.totalUsers.toLocaleString()}
        icon="👥"
        change={12}
        changeLabel="지난달 대비"
      />
      <StatCard
        title="오늘 신규 가입"
        value={stats.newUsersToday}
        icon="✨"
      />
      <StatCard
        title="활성 구독"
        value={stats.activeSubscriptions.toLocaleString()}
        icon="💳"
        change={5}
        changeLabel="지난달 대비"
      />
      <StatCard
        title="월 매출"
        value={`₩${stats.monthlyRevenue.toLocaleString()}`}
        icon="💰"
        change={8}
        changeLabel="지난달 대비"
      />
    </div>
  )
}

/**
 * 사용자 테이블
 */
interface UserTableProps {
  users: Array<{
    id: string
    email: string
    createdAt: string
    lastSignIn?: string
    plan?: string
  }>
  loading?: boolean
}

export function UserTable({ users, loading }: UserTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <Loading text="사용자 목록 로딩 중..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th
                className="text-left px-6 py-4 text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                이메일
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                가입일
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                마지막 로그인
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                플랜
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <td
                  className="px-6 py-4"
                  style={{ color: 'var(--color-text)' }}
                >
                  {user.email}
                </td>
                <td
                  className="px-6 py-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </td>
                <td
                  className="px-6 py-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {user.lastSignIn
                    ? new Date(user.lastSignIn).toLocaleDateString('ko-KR')
                    : '-'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      background: user.plan === 'pro' ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: user.plan === 'pro' ? 'var(--color-bg)' : 'var(--color-text)',
                    }}
                  >
                    {user.plan || '무료'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/**
 * 최근 활동 리스트
 */
interface Activity {
  id: string
  type: 'signup' | 'payment' | 'login'
  user: string
  timestamp: string
  detail?: string
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'signup':
        return '✨'
      case 'payment':
        return '💳'
      case 'login':
        return '👋'
      default:
        return '📌'
    }
  }

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'signup':
        return '신규 가입'
      case 'payment':
        return '결제 완료'
      case 'login':
        return '로그인'
      default:
        return '활동'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 py-2"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p style={{ color: 'var(--color-text)' }}>
                  <strong>{activity.user}</strong>님이{' '}
                  {getActivityLabel(activity.type)}
                  {activity.detail && ` - ${activity.detail}`}
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {new Date(activity.timestamp).toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
