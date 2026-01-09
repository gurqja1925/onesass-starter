'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

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
  { href: '/dashboard', label: '홈', icon: '🏠' },
  { href: '/dashboard/ai-chat', label: 'AI 채팅', icon: '💬' },
  { href: '/dashboard/image-gen', label: '이미지 생성', icon: '🎨' },
  { href: '/dashboard/video-gen', label: '영상 생성', icon: '🎬' },
  { href: '/dashboard/notes', label: '노트', icon: '📝' },
  { href: '/dashboard/analytics', label: '분석 도구', icon: '📊' },
  { href: '/dashboard/templates', label: '템플릿', icon: '📋' },
  { href: '/dashboard/settings', label: '설정', icon: '⚙️' },
]

export function DashboardLayout({
  children,
  title = '대시보드',
  menuItems = defaultMenuItems
}: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Sidebar */}
      <aside
        className="w-64 fixed left-0 top-0 h-screen overflow-y-auto"
        style={{
          background: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--color-border)'
        }}
      >
        {/* Logo */}
        <div className="p-6">
          <Link
            href="/"
            className="text-xl font-bold"
            style={{ color: 'var(--color-accent)' }}
          >
            {title}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    style={{
                      background: isActive ? 'var(--color-accent)' : 'transparent',
                      color: isActive ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:opacity-80"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span className="text-lg">←</span>
            <span className="font-medium">홈으로</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-8 sticky top-0 z-10"
          style={{
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              ⚙️
            </Link>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
