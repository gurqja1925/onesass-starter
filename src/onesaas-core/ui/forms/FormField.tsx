'use client'

/**
 * FormField 컴포넌트
 * 폼 필드 래퍼
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  htmlFor?: string
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, required, error, hint, htmlFor, className = '', children, ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium mb-1.5"
          style={{ color: 'var(--color-text)' }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {hint}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
)

FormField.displayName = 'FormField'
