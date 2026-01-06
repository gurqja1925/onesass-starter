'use client'

/**
 * 인풋 컴포넌트
 */

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg transition-colors ${className}`}
          style={{
            background: 'var(--color-bg-secondary)',
            border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
            color: 'var(--color-text)',
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg transition-colors resize-none ${className}`}
          style={{
            background: 'var(--color-bg-secondary)',
            border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
            color: 'var(--color-text)',
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg transition-colors ${className}`}
          style={{
            background: 'var(--color-bg-secondary)',
            border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
            color: 'var(--color-text)',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
