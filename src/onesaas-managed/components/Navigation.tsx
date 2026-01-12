



'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { loadTheme, type ThemeId } from '@/onesaas-core/plugins'
import { getAppName, getAppInitial } from '@/lib/branding'
import { useAuth } from '@/onesaas-core/auth/provider'
import AuthModal from '@/components/AuthModal'

// 개발자 모드 (데모/쇼케이스용) - 배포 시 false로 설정
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

// 관리자 이메일 목록 (임시로 하드코딩)
const ADMIN_EMAILS = ['johunsang@gmail.com']

// 관리자 이메일 확인
function isAdminUser(email: string | undefined): boolean {
  if (!email) {
    console.log('🔍 Admin check: No email')
    return false
  }

  const emailLower = email.toLowerCase()
  const isAdminResult = ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === emailLower)

  console.log('🔍 Admin check:', {
    email: emailLower,
    adminEmails: ADMIN_EMAILS,
    isAdmin: isAdminResult
  })

  return isAdminResult
}

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const isLoggedIn = !!user
  const isAdmin = isAdminUser(user?.email)

  useEffect(() => {
    console.log('👤 User:', user)
    console.log('🔐 Is Admin:', isAdmin)
  }, [user, isAdmin])

  // 메뉴 아이템 (DEV_MODE일 때만 쇼케이스, 문서 표시)
  const menuItems = [
    ...(DEV_MODE ? [{ href: '/showcase', label: '쇼케이스' }] : []),
    ...(DEV_MODE ? [{ href: '/docs', label: '문서' }] : []),
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg"
      style={{
        background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {getAppInitial()}
            </span>
            <span
              className="font-bold text-lg"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              {getAppName()}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isActive ? 'var(--color-accent)' : 'transparent',
                    color: isActive ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Auth Buttons & Admin */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/service"
                    className="px-4 py-2 text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    서비스
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut()
                      window.location.href = '/'
                    }}
                    className="px-4 py-2 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true)
                  }}
                  className="px-6 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  시작하기
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--color-text)' }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium"
                    style={{
                      background: isActive ? 'var(--color-accent)' : 'transparent',
                      color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}

              <div className="my-2" style={{ borderTop: '1px solid var(--color-border)' }} />

              {isLoggedIn ? (
                <>
                  <Link
                    href="/service"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg"
                    style={{ color: 'var(--color-text)' }}
                  >
                    서비스
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut()
                      setIsMenuOpen(false)
                      window.location.href = '/'
                    }}
                    className="px-4 py-3 rounded-lg text-left"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="mx-4 px-4 py-3 rounded-lg text-center font-medium"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  시작하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  )
}
