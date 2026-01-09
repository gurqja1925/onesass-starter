'use client'

/**
 * Tabs 컴포넌트
 * 탭 네비게이션
 */

import { useState, createContext, useContext, ReactNode, HTMLAttributes, forwardRef } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultTab?: string
  value?: string
  onChange?: (value: string) => void
  variant?: 'default' | 'pills' | 'underline' | 'enclosed'
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultTab,
      value,
      onChange,
      variant = 'default',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [internalActive, setInternalActive] = useState(defaultTab || '')
    const activeTab = value !== undefined ? value : internalActive

    const setActiveTab = (id: string) => {
      if (value === undefined) {
        setInternalActive(id)
      }
      onChange?.(id)
    }

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={className} data-variant={variant} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={`flex gap-1 border-b ${className}`}
        style={{ borderColor: 'var(--color-border)' }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabList.displayName = 'TabList'

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ value, disabled, className = '', children, ...props }, ref) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('Tab must be used within Tabs')

    const { activeTab, setActiveTab } = context
    const isActive = activeTab === value

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => setActiveTab(value)}
        className={`
          px-4 py-2.5 text-sm font-medium transition-all relative
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        style={{
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        }}
        {...props}
      >
        {children}
        {isActive && (
          <span
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: 'var(--color-accent)' }}
          />
        )}
      </button>
    )
  }
)

Tab.displayName = 'Tab'

export interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {}

export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  )
)

TabPanels.displayName = 'TabPanels'

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabPanel must be used within Tabs')

    if (context.activeTab !== value) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabPanel.displayName = 'TabPanel'
