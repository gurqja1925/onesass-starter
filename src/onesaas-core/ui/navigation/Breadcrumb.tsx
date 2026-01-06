'use client'

/**
 * Breadcrumb 컴포넌트
 * 경로 탐색 표시
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: ReactNode
  showHome?: boolean
  homeHref?: string
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator = <ChevronRight className="w-4 h-4" />,
      showHome = true,
      homeHref = '/',
      className = '',
      ...props
    },
    ref
  ) => {
    const allItems = showHome
      ? [{ label: '홈', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
      : items

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={className}
        {...props}
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1

            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {separator}
                  </span>
                )}

                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <span
                    className="flex items-center gap-1.5 text-sm font-medium"
                    style={{ color: isLast ? 'var(--color-text)' : 'var(--color-text-secondary)' }}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
