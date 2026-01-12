



'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { loadTheme, type ThemeId } from '@/onesaas-core/plugins'
import { getAppName, getAppInitial } from '@/lib/branding'

// 로고 경로 (환경 변수에서)
const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || ''

// 개발자 모드 (데모/쇼케이스용) - 배포 시 false로 설정
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('neon')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark')

  // 모드 변경
  const toggleMode = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(newMode)
    loadTheme(currentTheme, newMode)
    localStorage.setItem('onesaas-mode', newMode)
  }

  // 초기 테마 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem('onesaas-theme') as ThemeId | null
    const savedMode = localStorage.getItem('onesaas-mode') as 'light' | 'dark' | null
    const theme = savedTheme || 'neon'
    const mode = savedMode || 'dark'
    setCurrentTheme(theme)
    setThemeMode(mode)
    loadTheme(theme, mode)
  }, [])

  // 로그인 상태 확인
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setIsLoggedIn(true)
        }
      })
      .catch(() => {})
  }, [])

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
            {logoPath ? (
              <Image
                src={logoPath}
                alt={getAppName()}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {getAppInitial()}
              </span>
            )}
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
            {/* 라이트/다크 토글 - Desktop */}
            <button
              onClick={toggleMode}
              className="hidden md:flex p-2 rounded-lg transition-colors hover:opacity-80"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
              title={themeMode === 'dark' ? '라이트 모드' : '다크 모드'}
            >
              {themeMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons & Admin */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {/* 관리자 링크 - 로그인했을 때만 표시 */}
              {isLoggedIn && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  관리자
                </Link>
              )}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-2 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    무료 시작
                  </Link>
                </>
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

              {/* Mobile Theme Controls */}
              <div className="flex items-center gap-2 px-4 py-2">
                <button
                  onClick={toggleMode}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                >
                  {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {themeMode === 'dark' ? '라이트 모드' : '다크 모드'}
                </button>
              </div>

              <div className="my-2" style={{ borderTop: '1px solid var(--color-border)' }} />

              {/* 관리자 링크 - Mobile */}
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                관리자
              </Link>

              <div className="my-2" style={{ borderTop: '1px solid var(--color-border)' }} />

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false) }}
                    className="px-4 py-3 rounded-lg text-left"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg"
                    style={{ color: 'var(--color-text)' }}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="mx-4 px-4 py-3 rounded-lg text-center font-medium"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    무료 시작
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
