'use client'

/**
 * Textarea 컴포넌트
 * 여러 줄 텍스트 입력
 */

import { forwardRef, TextareaHTMLAttributes, useRef, useEffect } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
  showCount?: boolean
  autoResize?: boolean
  minRows?: number
  maxRows?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      maxLength,
      showCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      className = '',
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

    // 자동 높이 조절
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24
        const minHeight = minRows * lineHeight
        const maxHeight = maxRows * lineHeight
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
        textarea.style.height = `${newHeight}px`
      }
    }, [value, autoResize, minRows, maxRows, textareaRef])

    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--color-text)' }}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            rows={autoResize ? minRows : undefined}
            className={`
              w-full px-4 py-3 rounded-lg border outline-none transition-all resize-none
              focus:ring-2 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[var(--color-accent)]'}
              ${autoResize ? 'overflow-hidden' : ''}
              ${className}
            `}
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: error ? '#ef4444' : 'var(--color-border)',
            }}
            {...props}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <div>
            {hint && !error && (
              <p
                className="text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {hint}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          {(showCount || maxLength) && (
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
