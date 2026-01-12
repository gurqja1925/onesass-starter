'use client'

import { useEffect } from 'react'

/**
 * 테마를 Brutalist로 강제 고정하는 컴포넌트
 * localStorage를 무시하고 항상 brutalist 테마 적용
 */
export function ThemeLocker() {
  useEffect(() => {
    // 모든 테마 관련 localStorage 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onesaas-theme')
      localStorage.removeItem('onesaas_theme')
      localStorage.removeItem('onesaas_mode')

      // Brutalist 테마 강제 적용
      const root = document.documentElement

      // CSS 변수 직접 설정
      root.style.setProperty('--color-bg', '#000000')
      root.style.setProperty('--color-bg-secondary', '#0a0a0a')
      root.style.setProperty('--color-text', '#ffffff')
      root.style.setProperty('--color-text-secondary', '#a3a3a3')
      root.style.setProperty('--color-accent', '#ffffff')
      root.style.setProperty('--color-accent-hover', '#e5e5e5')
      root.style.setProperty('--color-border', '#ffffff')
      root.style.setProperty('--color-success', '#22c55e')
      root.style.setProperty('--color-warning', '#f59e0b')
      root.style.setProperty('--color-error', '#ef4444')
      root.style.setProperty('--color-info', '#3b82f6')

      // 폰트 설정
      root.style.setProperty('--font-display', "'JetBrains Mono', monospace")
      root.style.setProperty('--font-body', "'JetBrains Mono', monospace")
      root.style.setProperty('--font-mono', "'JetBrains Mono', monospace")

      // Border Radius 제거 (Brutalist 스타일)
      root.style.setProperty('--radius', '0')
      root.style.setProperty('--radius-sm', '0')
      root.style.setProperty('--radius-lg', '0')
      root.style.setProperty('--radius-full', '0')
    }
  }, [])

  // 페이지가 변경될 때마다 localStorage 감시 및 제거
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('onesaas-theme')
        if (saved && saved !== 'brutalist') {
          localStorage.removeItem('onesaas-theme')
          localStorage.removeItem('onesaas_theme')
          localStorage.removeItem('onesaas_mode')
        }
      }
    }, 100) // 100ms마다 체크

    return () => clearInterval(interval)
  }, [])

  return null
}
