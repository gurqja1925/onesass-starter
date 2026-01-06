'use client'

/**
 * DatePicker 컴포넌트
 * 날짜 선택
 */

import { useState, forwardRef, InputHTMLAttributes } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  format?: string
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, value, onChange, minDate, maxDate, className = '', ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [viewDate, setViewDate] = useState(value || new Date())

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const weekDays = ['일', '월', '화', '수', '목', '금', '토']

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))

    const selectDate = (day: number) => {
      const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      onChange?.(selected)
      setIsOpen(false)
    }

    const isSelected = (day: number) => {
      if (!value) return false
      return value.getFullYear() === viewDate.getFullYear() &&
             value.getMonth() === viewDate.getMonth() &&
             value.getDate() === day
    }

    const isToday = (day: number) => {
      const today = new Date()
      return today.getFullYear() === viewDate.getFullYear() &&
             today.getMonth() === viewDate.getMonth() &&
             today.getDate() === day
    }

    const formatDate = (date: Date | null) => {
      if (!date) return ''
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    }

    return (
      <div className={`relative ${className}`}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="text"
            readOnly
            value={formatDate(value || null)}
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2.5 pr-10 rounded-lg border outline-none cursor-pointer"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: error ? '#ef4444' : 'var(--color-border)',
            }}
            placeholder="날짜 선택"
            {...props}
          />
          <Calendar
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
            style={{ color: 'var(--color-text-secondary)' }}
          />
        </div>

        {isOpen && (
          <div
            className="absolute top-full left-0 mt-2 p-4 rounded-xl shadow-lg z-50 w-72"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1" style={{ color: 'var(--color-text)' }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
              </span>
              <button onClick={nextMonth} className="p-1" style={{ color: 'var(--color-text)' }}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium py-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => selectDate(day)}
                  className={`
                    w-8 h-8 rounded-lg text-sm transition-all
                    ${isSelected(day) ? 'font-bold' : ''}
                    ${isToday(day) && !isSelected(day) ? 'ring-1 ring-[var(--color-accent)]' : ''}
                  `}
                  style={{
                    background: isSelected(day) ? 'var(--color-accent)' : 'transparent',
                    color: isSelected(day) ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => { onChange?.(new Date()); setIsOpen(false) }}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
              >
                오늘
              </button>
              <button
                onClick={() => { onChange?.(null); setIsOpen(false) }}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
              >
                초기화
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
