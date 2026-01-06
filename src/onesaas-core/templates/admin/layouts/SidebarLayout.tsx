'use client'

/**
 * SaaS/Admin 사이드바 레이아웃
 * 왼쪽 사이드바 + 상단 헤더 + 메인 콘텐츠 구조
 */

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Users, ShoppingCart, Package, BarChart3, Settings,
  Bell, Search, Menu, X, ChevronDown, LogOut, User,
  CreditCard, FileText, MessageSquare, HelpCircle, Zap,
  LucideIcon
} from 'lucide-react'

// 네비게이션 아이템 타입
export interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: string | number
  children?: NavItem[]
}

// 레이아웃 Props
export interface SidebarLayoutProps {
  children: ReactNode
  logo?: ReactNode
  logoText?: string
  navItems?: NavItem[]
  userInfo?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
}

// 기본 네비게이션 아이템
const defaultNavItems: NavItem[] = [
  { icon: Home, label: '대시보드', href: '/dashboard' },
  { icon: Users, label: '사용자', href: '/users' },
  { icon: ShoppingCart, label: '주문', href: '/orders', badge: 5 },
  { icon: Package, label: '상품', href: '/products' },
  { icon: BarChart3, label: '분석', href: '/analytics' },
  { icon: CreditCard, label: '결제', href: '/billing' },
  { icon: MessageSquare, label: '메시지', href: '/messages', badge: 3 },
  { icon: FileText, label: '리포트', href: '/reports' },
  { icon: Settings, label: '설정', href: '/settings' },
]

export function SidebarLayout({
  children,
  logo,
  logoText = 'OneSaaS',
  navItems = defaultNavItems,
  userInfo = { name: '관리자', email: 'admin@example.com' },
  onLogout,
}: SidebarLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all
          ${isActive
            ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {isSidebarOpen && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={`
                  px-2 py-0.5 text-xs rounded-full
                  ${isActive ? 'bg-white/20' : 'bg-[var(--color-accent)] text-[var(--color-bg)]'}
                `}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 사이드바 - 데스크톱 */}
      <aside
        className={`
          hidden md:flex flex-col fixed left-0 top-0 h-screen
          bg-gray-900 text-white border-r border-gray-800
          transition-all duration-300 z-40
          ${isSidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* 로고 */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {logo || (
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {logoText[0]}
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-lg">{logoText}</span>
              )}
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, i) => (
            <NavLink key={i} item={item} />
          ))}
        </nav>

        {/* 하단 */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/help"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            {isSidebarOpen && <span>도움말</span>}
          </Link>
        </div>
      </aside>

      {/* 사이드바 - 모바일 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
              <span className="font-bold text-lg">{logoText}</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item, i) => (
                <NavLink key={i} item={item} />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* 메인 영역 */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen
          transition-all duration-300
          ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
        `}
      >
        {/* 상단 헤더 */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30"
          style={{
            background: 'var(--color-bg)',
            borderColor: 'var(--color-border)'
          }}
        >
          {/* 왼쪽: 모바일 메뉴 버튼 + 검색 */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="검색..."
                className="bg-transparent border-none outline-none w-48 text-sm"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
          </div>

          {/* 오른쪽: 알림, 사용자 */}
          <div className="flex items-center gap-4">
            {/* 업그레이드 버튼 */}
            <Link
              href="/upgrade"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              <Zap className="w-4 h-4" />
              업그레이드
            </Link>

            {/* 알림 */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 사용자 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {userInfo.avatar ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${userInfo.avatar})` }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {userInfo.name[0]}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {userInfo.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {userInfo.email}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: 'var(--color-text-secondary)' }} />
              </button>

              {/* 드롭다운 메뉴 */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border py-2"
                  style={{
                    background: 'var(--color-bg)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    <span style={{ color: 'var(--color-text)' }}>프로필</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    <span style={{ color: 'var(--color-text)' }}>설정</span>
                  </Link>
                  <hr className="my-2" style={{ borderColor: 'var(--color-border)' }} />
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      onLogout?.()
                    }}
                    className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default SidebarLayout
