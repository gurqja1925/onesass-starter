'use client'

import { useState, useEffect } from 'react'
import { themePresets, Theme, applyTheme, getThemeById } from './index'

interface ThemeSelectorProps {
  onThemeChange?: (themeId: string) => void
  currentTheme?: string
}

export function ThemeSelector({ onThemeChange, currentTheme }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'modern-minimalist')
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  useEffect(() => {
    // 저장된 테마 불러오기
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onesaas_theme')
      const savedMode = localStorage.getItem('onesaas_mode') as 'light' | 'dark'
      if (saved) setSelectedTheme(saved)
      if (savedMode) setMode(savedMode)
    }
  }, [])

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    applyTheme(themeId, mode)
    localStorage.setItem('onesaas_theme', themeId)
    onThemeChange?.(themeId)
  }

  const handleModeChange = (newMode: 'light' | 'dark') => {
    setMode(newMode)
    applyTheme(selectedTheme, newMode)
    localStorage.setItem('onesaas_mode', newMode)
  }

  const categories = ['modern', 'creative', 'professional', 'vibrant', 'elegant'] as const
  const categoryLabels: Record<string, string> = {
    modern: '모던',
    creative: '크리에이티브',
    professional: '프로페셔널',
    vibrant: '비비드',
    elegant: '엘레강트',
  }

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div>
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          색상 모드
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('light')}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: mode === 'light' ? 'var(--color-accent)' : 'var(--color-bg)',
              color: mode === 'light' ? 'var(--color-bg)' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}
          >
            라이트 모드
          </button>
          <button
            onClick={() => handleModeChange('dark')}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: mode === 'dark' ? 'var(--color-accent)' : 'var(--color-bg)',
              color: mode === 'dark' ? 'var(--color-bg)' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}
          >
            다크 모드
          </button>
        </div>
      </div>

      {/* 카테고리별 테마 */}
      {categories.map(category => {
        const categoryThemes = themePresets.filter(t => t.category === category)
        if (categoryThemes.length === 0) return null

        return (
          <div key={category}>
            <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
              {categoryLabels[category]}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {categoryThemes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  mode={mode}
                  isSelected={selectedTheme === theme.id}
                  isHovered={hoveredTheme === theme.id}
                  onSelect={() => handleThemeSelect(theme.id)}
                  onHover={() => setHoveredTheme(theme.id)}
                  onLeave={() => setHoveredTheme(null)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface ThemeCardProps {
  theme: Theme
  mode: 'light' | 'dark'
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: () => void
  onLeave: () => void
}

function ThemeCard({ theme, mode, isSelected, isHovered, onSelect, onHover, onLeave }: ThemeCardProps) {
  const colors = theme.colors[mode]

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative p-3 rounded-lg text-left transition-all"
      style={{
        background: isSelected ? 'var(--color-accent)' : 'var(--color-bg)',
        border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* 컬러 프리뷰 */}
      <div className="flex gap-1 mb-2">
        <div
          className="w-6 h-6 rounded"
          style={{ background: colors.primary }}
          title="Primary"
        />
        <div
          className="w-6 h-6 rounded"
          style={{ background: colors.secondary }}
          title="Secondary"
        />
        <div
          className="w-6 h-6 rounded"
          style={{ background: colors.accent }}
          title="Accent"
        />
        <div
          className="w-6 h-6 rounded border"
          style={{ background: colors.background, borderColor: colors.border }}
          title="Background"
        />
      </div>

      {/* 테마 이름 */}
      <p
        className="text-sm font-medium"
        style={{ color: isSelected ? 'var(--color-bg)' : 'var(--color-text)' }}
      >
        {theme.nameKo}
      </p>
      <p
        className="text-xs"
        style={{ color: isSelected ? 'var(--color-bg)' : 'var(--color-text-secondary)', opacity: isSelected ? 0.8 : 1 }}
      >
        {theme.name}
      </p>

      {/* 선택 표시 */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <span className="text-xs">✓</span>
        </div>
      )}
    </button>
  )
}

// 테마 프리뷰 컴포넌트
export function ThemePreview({ themeId }: { themeId: string }) {
  const theme = getThemeById(themeId)
  if (!theme) return null

  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: theme.colors.dark.surface, border: `1px solid ${theme.colors.dark.border}` }}
    >
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: theme.colors.dark.text, fontFamily: theme.fonts.display }}
      >
        {theme.nameKo}
      </h3>
      <p
        className="text-sm mb-3"
        style={{ color: theme.colors.dark.textSecondary, fontFamily: theme.fonts.body }}
      >
        {theme.description}
      </p>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded text-sm font-medium"
          style={{
            background: theme.colors.dark.primary,
            color: theme.colors.dark.background,
            borderRadius: theme.borderRadius,
          }}
        >
          Primary
        </button>
        <button
          className="px-4 py-2 rounded text-sm font-medium"
          style={{
            background: theme.colors.dark.secondary,
            color: theme.colors.dark.background,
            borderRadius: theme.borderRadius,
          }}
        >
          Secondary
        </button>
      </div>
    </div>
  )
}
