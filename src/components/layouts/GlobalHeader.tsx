'use client'

/**
 * 글로벌 헤더 컴포넌트
 * 모든 페이지에서 일관된 헤더 제공
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, Palette, ChevronDown } from 'lucide-react'
import { loadTheme, type ThemeId } from '@/onesaas-core/plugins'

// 테마 목록
const THEMES: { id: ThemeId; name: string; colors: string[] }[] = [
  { id: 'neon', name: '네온', colors: ['#0a0a0a', '#00ff88'] },
  { id: 'minimal', name: '미니멀', colors: ['#ffffff', '#000000'] },
  { id: 'luxury', name: '럭셔리', colors: ['#1a1a2e', '#d4af37'] },
  { id: 'playful', name: '플레이풀', colors: ['#fef3c7', '#f472b6'] },
  { id: 'brutalist', name: '브루탈리스트', colors: ['#f5f5f5', '#ff0000'] },
  { id: 'corporate', name: '코퍼레이트', colors: ['#1e293b', '#3b82f6'] },
  { id: 'startup', name: '스타트업', colors: ['#0f172a', '#8b5cf6'] },
  { id: 'fintech', name: '핀테크', colors: ['#0a1929', '#00d9ff'] },
  { id: 'healthcare', name: '헬스케어', colors: ['#ecfdf5', '#10b981'] },
  { id: 'ecommerce', name: '이커머스', colors: ['#18181b', '#f97316'] },
]

// 메뉴 아이템
const NAV_ITEMS = [
  { href: '/showcase', label: '쇼케이스' },
]

interface GlobalHeaderProps {
  showThemePicker?: boolean
  variant?: 'default' | 'transparent' | 'solid'
}

export function GlobalHeader({
  showThemePicker = true,
  variant = 'default',
}: GlobalHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const bgStyle = variant === 'transparent'
    ? { background: 'transparent' }
    : variant === 'solid'
    ? { background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }
    : { background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }

  return (
    <header className="sticky top-0 z-50" style={bgStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              O
            </span>
            OneSaaS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isActive ? 'var(--color-accent)' : 'transparent',
                    color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Picker */}
            {showThemePicker && (
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
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowThemeDropdown(!showThemeDropdown)
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                  >
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">{THEMES.find(t => t.id === currentTheme)?.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showThemeDropdown && (
                    <div
                      className="absolute right-0 top-full mt-2 p-3 rounded-xl shadow-2xl z-50 w-72"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                        테마 선택
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={`p-3 rounded-lg text-left transition-all hover:scale-[1.02] ${currentTheme === theme.id ? 'ring-2' : ''}`}
                            style={{
                              background: 'var(--color-bg)',
                              border: '1px solid var(--color-border)',
                              ...(currentTheme === theme.id ? { ringColor: 'var(--color-accent)' } : {}),
                            }}
                          >
                            <div className="flex gap-1 mb-2">
                              {theme.colors.map((color, i) => (
                                <div key={i} className="w-4 h-4 rounded-full border" style={{ background: color, borderColor: 'var(--color-border)' }} />
                              ))}
                            </div>
                            <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                              {theme.name}
                              {currentTheme === theme.id && ' ✓'}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--color-text)' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-medium"
                    style={{
                      background: isActive ? 'var(--color-accent)' : 'transparent',
                      color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Theme Picker */}
            {showThemePicker && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-sm font-semibold mb-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>테마</p>
                <div className="flex items-center gap-2 px-4 mb-3">
                  <button
                    onClick={toggleMode}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                  >
                    {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {themeMode === 'dark' ? '라이트' : '다크'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 px-4">
                  {THEMES.slice(0, 6).map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        handleThemeChange(theme.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`p-2 rounded-lg text-center ${currentTheme === theme.id ? 'ring-2' : ''}`}
                      style={{
                        background: 'var(--color-bg-secondary)',
                        ...(currentTheme === theme.id ? { ringColor: 'var(--color-accent)' } : {}),
                      }}
                    >
                      <div className="flex justify-center gap-1 mb-1">
                        {theme.colors.map((color, i) => (
                          <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text)' }}>{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
