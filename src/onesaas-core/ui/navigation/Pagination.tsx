'use client'

/**
 * Pagination 컴포넌트
 * 페이지 네비게이션
 */

import { HTMLAttributes, forwardRef } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      showPrevNext = true,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    }

    // 페이지 범위 계산
    const range = (start: number, end: number) => {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const generatePages = () => {
      const totalNumbers = siblingCount * 2 + 5 // 첫, 마지막, 현재, 양쪽 sibling, 양쪽 dots

      if (totalNumbers >= totalPages) {
        return range(1, totalPages)
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

      const showLeftDots = leftSiblingIndex > 2
      const showRightDots = rightSiblingIndex < totalPages - 1

      if (!showLeftDots && showRightDots) {
        const leftItemCount = 3 + siblingCount * 2
        return [...range(1, leftItemCount), 'dots', totalPages]
      }

      if (showLeftDots && !showRightDots) {
        const rightItemCount = 3 + siblingCount * 2
        return [1, 'dots', ...range(totalPages - rightItemCount + 1, totalPages)]
      }

      return [1, 'dots', ...range(leftSiblingIndex, rightSiblingIndex), 'dots', totalPages]
    }

    const pages = generatePages()

    const PageButton = ({
      page,
      isActive,
      disabled,
      children,
    }: {
      page?: number
      isActive?: boolean
      disabled?: boolean
      children: React.ReactNode
    }) => (
      <button
        onClick={() => page && onPageChange(page)}
        disabled={disabled}
        className={`
          ${sizes[size]} rounded-lg flex items-center justify-center font-medium
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
          ${isActive ? '' : 'hover:opacity-80'}
        `}
        style={{
          background: isActive ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
          color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
        }}
      >
        {children}
      </button>
    )

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={`flex items-center gap-1 ${className}`}
        {...props}
      >
        {/* 이전 버튼 */}
        {showPrevNext && (
          <PageButton
            page={currentPage - 1}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </PageButton>
        )}

        {/* 페이지 번호 */}
        {pages.map((page, index) => {
          if (page === 'dots') {
            return (
              <span
                key={`dots-${index}`}
                className={`${sizes[size]} flex items-center justify-center`}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )
          }

          return (
            <PageButton
              key={page}
              page={page as number}
              isActive={currentPage === page}
            >
              {page}
            </PageButton>
          )
        })}

        {/* 다음 버튼 */}
        {showPrevNext && (
          <PageButton
            page={currentPage + 1}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </PageButton>
        )}
      </nav>
    )
  }
)

Pagination.displayName = 'Pagination'
