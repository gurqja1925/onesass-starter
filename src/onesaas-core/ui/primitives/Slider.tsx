'use client'

/**
 * Slider 컴포넌트
 * 범위 슬라이더
 */

import { forwardRef, InputHTMLAttributes } from 'react'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  showValue?: boolean
  showMinMax?: boolean
  formatValue?: (value: number) => string
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      showValue = true,
      showMinMax = false,
      formatValue = (v) => String(v),
      min = 0,
      max = 100,
      value,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`
    const numericValue = typeof value === 'number' ? value : Number(value) || 0
    const numericMin = typeof min === 'number' ? min : Number(min) || 0
    const numericMax = typeof max === 'number' ? max : Number(max) || 100
    const percentage = ((numericValue - numericMin) / (numericMax - numericMin)) * 100

    return (
      <div className={`w-full ${className}`}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {label}
              </label>
            )}
            {showValue && (
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-accent)' }}
              >
                {formatValue(numericValue)}
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            value={value}
            className={`
              w-full h-2 rounded-full appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--color-accent)]
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-[var(--color-accent)]
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer
            `}
            style={{
              background: `linear-gradient(to right, var(--color-accent) ${percentage}%, var(--color-border) ${percentage}%)`,
            }}
            {...props}
          />
        </div>

        {showMinMax && (
          <div className="flex items-center justify-between mt-1">
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {formatValue(numericMin)}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {formatValue(numericMax)}
            </span>
          </div>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'
