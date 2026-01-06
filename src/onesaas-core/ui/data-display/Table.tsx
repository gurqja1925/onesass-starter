'use client'

/**
 * Table 컴포넌트
 * 기본 테이블
 */

import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, forwardRef } from 'react'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      striped = false,
      hoverable = true,
      bordered = false,
      compact = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => (
    <div className="overflow-x-auto">
      <table
        ref={ref}
        className={`
          w-full border-collapse
          ${bordered ? 'border border-[var(--color-border)]' : ''}
          ${className}
        `}
        data-striped={striped}
        data-hoverable={hoverable}
        data-compact={compact}
        {...props}
      >
        {children}
      </table>
    </div>
  )
)

Table.displayName = 'Table'

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', children, ...props }, ref) => (
    <thead
      ref={ref}
      className={className}
      style={{ background: 'var(--color-bg-secondary)' }}
      {...props}
    >
      {children}
    </thead>
  )
)

TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', children, ...props }, ref) => (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
)

TableBody.displayName = 'TableBody'

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', children, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={className}
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
      }}
      {...props}
    >
      {children}
    </tfoot>
  )
)

TableFooter.displayName = 'TableFooter'

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', children, ...props }, ref) => (
    <tr
      ref={ref}
      className={`
        border-b transition-colors
        hover:bg-[var(--color-bg-secondary)]/50
        ${className}
      `}
      style={{ borderColor: 'var(--color-border)' }}
      {...props}
    >
      {children}
    </tr>
  )
)

TableRow.displayName = 'TableRow'

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
  onSort?: () => void
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable, sorted, onSort, className = '', children, ...props }, ref) => (
    <th
      ref={ref}
      className={`
        px-4 py-3 text-left text-sm font-semibold
        ${sortable ? 'cursor-pointer select-none hover:opacity-80' : ''}
        ${className}
      `}
      style={{ color: 'var(--color-text)' }}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {sorted === 'asc' ? '▲' : sorted === 'desc' ? '▼' : '◇'}
          </span>
        )}
      </div>
    </th>
  )
)

TableHead.displayName = 'TableHead'

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', children, ...props }, ref) => (
    <td
      ref={ref}
      className={`px-4 py-3 text-sm ${className}`}
      style={{ color: 'var(--color-text)' }}
      {...props}
    >
      {children}
    </td>
  )
)

TableCell.displayName = 'TableCell'

// 빈 상태
export function TableEmpty({ message = '데이터가 없습니다' }: { message?: string }) {
  return (
    <TableRow>
      <TableCell colSpan={100} className="text-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>{message}</p>
      </TableCell>
    </TableRow>
  )
}
