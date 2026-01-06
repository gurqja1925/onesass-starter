'use client'

/**
 * SearchInput 컴포넌트
 * 검색 입력 필드
 */

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  onClear?: () => void
  isLoading?: boolean
  showClearButton?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, isLoading, showClearButton = true, className = '', value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState('')
    const currentValue = value !== undefined ? String(value) : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e)
    }

    const handleClear = () => {
      setInternalValue('')
      onClear?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSearch?.(currentValue)
      }
    }

    return (
      <div className={`relative ${className}`}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: 'var(--color-text-secondary)' }}
        />
        <input
          ref={ref}
          type="search"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none focus:ring-2"
          style={{
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
          }}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-text-secondary)' }} />}
          {showClearButton && currentValue && !isLoading && (
            <button onClick={handleClear} style={{ color: 'var(--color-text-secondary)' }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
