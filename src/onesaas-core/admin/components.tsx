'use client'

/**
 * 관리자 컴포넌트
 */

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getAdminMenuItems } from './config'
import { useAdminAuth, useAdminStats } from './hooks'
import { useAuth } from '../auth/provider'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Loading } from '../ui/Loading'
import AuthModal from '@/components/AuthModal'

/**
 * 관리자 레이아웃
 */
export function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, isAdmin, loading } = useAdminAuth()
  const pathname = usePathname()
  const menuItems = getAdminMenuItems()
  const { signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // 로그인하지 않았으면 모달 표시
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    }
  }, [loading, user])

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
      <>
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
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {user ? '어드민 권한이 필요한 페이지입니다' : '어드민 로그인이 필요합니다'}
              </p>
              <div className="flex gap-3 justify-center">
                {!user ? (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-block px-6 py-2 rounded-lg font-medium"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    로그인
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="inline-block px-6 py-2 rounded-lg font-medium"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                  >
                    홈으로 돌아가기
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectUrl="/admin"
        />
      </>
    )
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* 사이드바 */}
      <aside
        className="w-64 border-r flex-shrink-0 flex flex-col"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <span
              className="text-lg font-bold"
              style={{ color: 'var(--color-accent)' }}
            >
              관리자
            </span>
          </Link>
        </div>

        <nav className="px-4 py-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors text-sm"
                style={{
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 하단 메뉴 */}
        <div className="px-4 py-4 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
          <Link
            href="/service"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-opacity-10 text-sm"
            style={{
              background: 'transparent',
              color: 'var(--color-text)',
              textAlign: 'left',
            }}
          >
            <span className="text-base">🏠</span>
            <span>서비스</span>
          </Link>
          <button
            onClick={async () => {
              await signOut()
              router.push('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-opacity-10 text-sm"
            style={{
              background: 'transparent',
              color: 'var(--color-text)',
              textAlign: 'left',
            }}
          >
            <span className="text-base">🚪</span>
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/admin"
      />
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
export interface Activity {
  id: string
  type: 'signup' | 'payment' | 'login' | 'ai_usage'
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
      case 'ai_usage':
        return '🤖'
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
      case 'ai_usage':
        return 'AI 사용'
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
