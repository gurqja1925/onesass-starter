'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { ProtectedRoute } from '@/onesaas-core/auth/components'
import { useAuth } from '@/onesaas-core/auth/provider'
import { useAdminAuth } from '@/onesaas-core/admin/hooks'
import { RequireSubscription, SubscriptionExpiryWarning } from '@/onesaas-core/subscription/middleware'

interface MenuItem {
  href: string
  label: string
  icon: string
}

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  menuItems?: MenuItem[]
}

const defaultMenuItems: MenuItem[] = [
  { href: '/service', label: '홈', icon: '🏠' },
  { href: '/service/payment', label: '결제', icon: '💳' },
  { href: '/service/payment/history', label: '결제내역', icon: '📜' },
  { href: '/service/settings', label: '설정', icon: '⚙️' },
]

export function DashboardLayout({
  children,
  title = '서비스',
  menuItems = defaultMenuItems
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdminAuth()

  // 구독 체크 비활성화 (개발 중)
  // 실제 운영 시 RequireSubscription 주석 해제
  const ENABLE_SUBSCRIPTION_CHECK = false

  return (
    <ProtectedRoute>
      {ENABLE_SUBSCRIPTION_CHECK ? (
        <RequireSubscription>
          <DashboardContent
            pathname={pathname}
            menuItems={menuItems}
            isAdmin={isAdmin}
            signOut={signOut}
            title={title}
          >
            {children}
          </DashboardContent>
        </RequireSubscription>
      ) : (
        <DashboardContent
          pathname={pathname}
          menuItems={menuItems}
          isAdmin={isAdmin}
          signOut={signOut}
          title={title}
        >
          {children}
        </DashboardContent>
      )}
    </ProtectedRoute>
  )
}

// 대시보드 컨텐츠 컴포넌트 분리
function DashboardContent({
  children,
  pathname,
  menuItems,
  isAdmin,
  signOut,
  title
}: {
  children: React.ReactNode
  pathname: string | null
  menuItems: MenuItem[]
  isAdmin: boolean
  signOut: () => Promise<void>
  title: string
}) {
  const router = useRouter()

  return (
    <>
      <div className="min-h-screen flex" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        {/* Sidebar */}
      <aside
        className="w-64 fixed left-0 top-0 h-screen overflow-y-auto flex flex-col"
        style={{
          background: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--color-border)'
        }}
      >
        {/* Logo */}
        <div className="p-6">
          <Link
            href="/"
            className="text-lg font-bold"
            style={{ color: 'var(--color-accent)' }}
          >
            {title}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2 flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              // 정확한 경로 매칭: 하위 경로가 있는 경우 정확히 일치해야 함
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                    style={{
                      background: isActive ? 'var(--color-accent)' : 'transparent',
                      color: isActive ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--color-border)' }}>
          {isAdmin && (
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all hover:opacity-80 text-sm"
              style={{ color: 'var(--color-text-secondary)', textAlign: 'left' }}
            >
              <span className="text-base">👑</span>
              <span className="font-medium">관리자</span>
            </Link>
          )}
          <button
            onClick={async () => {
              await signOut()
              window.location.href = '/'
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all hover:opacity-80 text-sm"
            style={{ color: 'var(--color-text-secondary)', textAlign: 'left' }}
          >
            <span className="text-base">🚪</span>
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Subscription Warning Banner */}
        <SubscriptionExpiryWarning />

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
      </div>
    </>
  )
}
