'use client'

/**
 * Accordion 컴포넌트
 * 접히는 패널
 */

import { useState, createContext, useContext, ReactNode, HTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (id: string) => void
  allowMultiple: boolean
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  allowMultiple?: boolean
  defaultOpen?: string[]
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      allowMultiple = false,
      defaultOpen = [],
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

    const toggleItem = (id: string) => {
      setOpenItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return allowMultiple ? [...prev, id] : [id]
      })
    }

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
        <div
          ref={ref}
          className={`divide-y divide-[var(--color-border)] ${className}`}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = 'Accordion'

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled, className = '', children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error('AccordionItem must be used within Accordion')

    return (
      <div
        ref={ref}
        data-state={context.openItems.includes(value) ? 'open' : 'closed'}
        data-disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AccordionItem.displayName = 'AccordionItem'

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error('AccordionTrigger must be used within Accordion')

    const isOpen = context.openItems.includes(value)

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        onClick={() => context.toggleItem(value)}
        className={`
          flex items-center justify-between w-full py-4 text-left font-medium
          transition-colors hover:opacity-80
          ${className}
        `}
        style={{ color: 'var(--color-text)' }}
        {...props}
      >
        {children}
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-text-secondary)' }}
        />
      </button>
    )
  }
)

AccordionTrigger.displayName = 'AccordionTrigger'

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error('AccordionContent must be used within Accordion')

    const isOpen = context.openItems.includes(value)

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className={`pb-4 ${className}`}
        style={{ color: 'var(--color-text-secondary)' }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AccordionContent.displayName = 'AccordionContent'
