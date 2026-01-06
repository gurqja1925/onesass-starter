'use client'

/**
 * Sidebar 컴포넌트
 * 사이드바 레이아웃
 */

import { HTMLAttributes, forwardRef, ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  width?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  position?: 'left' | 'right'
  overlay?: boolean
  header?: ReactNode
  footer?: ReactNode
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      width = '280px',
      collapsible = true,
      defaultCollapsed = false,
      position = 'left',
      overlay = false,
      header,
      footer,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
      <>
        {/* 모바일 오버레이 */}
        {overlay && isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* 모바일 토글 버튼 */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-4 right-4 z-50 lg:hidden p-3 rounded-full shadow-lg"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
          }}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 사이드바 */}
        <aside
          ref={ref}
          className={`
            fixed ${position === 'left' ? 'left-0' : 'right-0'} top-0 h-full z-50
            flex flex-col border-r transition-all duration-300
            lg:relative lg:translate-x-0
            ${isMobileOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
            ${isCollapsed ? 'lg:w-16' : ''}
            ${className}
          `}
          style={{
            width: isCollapsed ? '64px' : width,
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
          }}
          {...props}
        >
          {/* 모바일 닫기 버튼 */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 lg:hidden"
            style={{ color: 'var(--color-text)' }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* 헤더 */}
          {header && (
            <div
              className="flex-shrink-0 p-4 border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {header}
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>

          {/* 푸터 */}
          {footer && (
            <div
              className="flex-shrink-0 p-4 border-t"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {footer}
            </div>
          )}

          {/* 접기 토글 (데스크탑) */}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full items-center justify-center shadow-md border"
              style={{
                background: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <svg
                className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </aside>
      </>
    )
  }
)

Sidebar.displayName = 'Sidebar'
