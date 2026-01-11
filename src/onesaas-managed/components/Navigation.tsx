






'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Palette, ChevronDown } from 'lucide-react'
import { loadTheme, type ThemeId } from '@/onesaas-core/plugins'

// 테마 목록
const THEMES: { id: ThemeId; name: string; colors: string[] }[] = [
  // 기본 테마 10개
  { id: 'neon', name: '네온', colors: ['#0a0a0a', '#00ff88'] },
  { id: 'minimal', name: '미니멀', colors: ['#ffffff', '#000000'] },
  { id: 'luxury', name: '럭셔리', colors: ['#1a1a2e', '#d4af37'] },
  { id: 'playful', name: '플레이풀', colors: ['#fef3c7', '#f472b6'] },
  { id: 'brutalist', name: '브루탈리스트', colors: ['#f5f5f5', '#000000'] },
  { id: 'corporate', name: '코퍼레이트', colors: ['#1e293b', '#3b82f6'] },
  { id: 'startup', name: '스타트업', colors: ['#0f172a', '#8b5cf6'] },
  { id: 'fintech', name: '핀테크', colors: ['#0a1929', '#00d9ff'] },
  { id: 'healthcare', name: '헬스케어', colors: ['#ecfdf5', '#10b981'] },
  { id: 'ecommerce', name: '이커머스', colors: ['#18181b', '#f97316'] },
  // 특이한 테마 10개
  { id: 'retrowave', name: '레트로웨이브', colors: ['#0f0015', '#ff00ff'] },
  { id: 'cyberpunk', name: '사이버펑크', colors: ['#020617', '#ff0080'] },
  { id: 'aurora', name: '오로라', colors: ['#001a0f', '#10b981'] },
  { id: 'tokyo', name: '도쿄 나이트', colors: ['#1a1b26', '#ff9e64'] },
  { id: 'forest', name: '포레스트', colors: ['#0d1f0d', '#7cb668'] },
  { id: 'ocean', name: '딥 오션', colors: ['#001020', '#38bdf8'] },
  { id: 'sunset', name: '선셋', colors: ['#1c0a00', '#fb923c'] },
  { id: 'space', name: '스페이스', colors: ['#0a0014', '#a855f7'] },
  { id: 'candy', name: '캔디', colors: ['#2d0a14', '#f472b6'] },
  { id: 'terminal', name: '터미널', colors: ['#000000', '#00ff00'] },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('neon')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark')
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)

  // 테마 변경
  const handleThemeChange = (themeId: ThemeId) => {
    setCurrentTheme(themeId)
    loadTheme(themeId, themeMode)
    localStorage.setItem('onesaas-theme', themeId)
    setShowThemeDropdown(false)
  }

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

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = () => setShowThemeDropdown(false)
    if (showThemeDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showThemeDropdown])

  // 메뉴 아이템
  const menuItems = [
    { href: '/showcase', label: '쇼케이스' },
    { href: '/admin', label: '관리자' },
    { href: '/docs', label: '문서' },
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
              O
            </span>
            <span
              className="font-bold text-lg"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              OneSaaS
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
            {/* Theme Controls - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {/* 라이트/다크 토글 */}
              <button
                onClick={toggleMode}
                className="p-2 rounded-lg transition-colors hover:opacity-80"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                title={themeMode === 'dark' ? '라이트 모드' : '다크 모드'}
              >
                {themeMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* 테마 선택 */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowThemeDropdown(!showThemeDropdown) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-sm hidden lg:inline">{THEMES.find(t => t.id === currentTheme)?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showThemeDropdown && (
                  <div
                    className="absolute right-0 top-full mt-2 p-4 rounded-xl shadow-2xl z-50 w-[480px] max-h-[70vh] overflow-y-auto"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                      🎨 테마 선택 (20가지)
                    </h4>

                    {/* 기본 테마 */}
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>기본 테마</p>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {THEMES.slice(0, 10).map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className={`p-2 rounded-lg text-center transition-all hover:scale-105 ${currentTheme === theme.id ? 'ring-2' : ''}`}
                          style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            ['--tw-ring-color' as string]: currentTheme === theme.id ? 'var(--color-accent)' : undefined,
                          }}
                          title={theme.name}
                        >
                          <div className="flex justify-center gap-1 mb-1">
                            {theme.colors.map((color, i) => (
                              <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                            ))}
                          </div>
                          <p className="text-[10px] font-medium truncate" style={{ color: 'var(--color-text)' }}>
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* 특이한 테마 */}
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>특별 테마</p>
                    <div className="grid grid-cols-5 gap-2">
                      {THEMES.slice(10).map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className={`p-2 rounded-lg text-center transition-all hover:scale-105 ${currentTheme === theme.id ? 'ring-2' : ''}`}
                          style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            ['--tw-ring-color' as string]: currentTheme === theme.id ? 'var(--color-accent)' : undefined,
                          }}
                          title={theme.name}
                        >
                          <div className="flex justify-center gap-1 mb-1">
                            {theme.colors.map((color, i) => (
                              <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                            ))}
                          </div>
                          <p className="text-[10px] font-medium truncate" style={{ color: 'var(--color-text)' }}>
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 ml-2">
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

              <div className="px-4 max-h-48 overflow-y-auto">
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>기본 테마</p>
                <div className="grid grid-cols-5 gap-1 mb-3">
                  {THEMES.slice(0, 10).map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => { handleThemeChange(theme.id); setIsMenuOpen(false) }}
                      className={`p-1.5 rounded-lg text-center ${currentTheme === theme.id ? 'ring-2' : ''}`}
                      style={{
                        background: 'var(--color-bg-secondary)',
                        ['--tw-ring-color' as string]: currentTheme === theme.id ? 'var(--color-accent)' : undefined,
                      }}
                    >
                      <div className="flex justify-center gap-0.5 mb-0.5">
                        {theme.colors.map((color, i) => (
                          <div key={i} className="w-2 h-2 rounded-full" style={{ background: color }} />
                        ))}
                      </div>
                      <p className="text-[8px] truncate" style={{ color: 'var(--color-text)' }}>{theme.name}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>특별 테마</p>
                <div className="grid grid-cols-5 gap-1">
                  {THEMES.slice(10).map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => { handleThemeChange(theme.id); setIsMenuOpen(false) }}
                      className={`p-1.5 rounded-lg text-center ${currentTheme === theme.id ? 'ring-2' : ''}`}
                      style={{
                        background: 'var(--color-bg-secondary)',
                        ['--tw-ring-color' as string]: currentTheme === theme.id ? 'var(--color-accent)' : undefined,
                      }}
                    >
                      <div className="flex justify-center gap-0.5 mb-0.5">
                        {theme.colors.map((color, i) => (
                          <div key={i} className="w-2 h-2 rounded-full" style={{ background: color }} />
                        ))}
                      </div>
                      <p className="text-[8px] truncate" style={{ color: 'var(--color-text)' }}>{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

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
