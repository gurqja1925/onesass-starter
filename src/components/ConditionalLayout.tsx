'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Navigation from '@/onesaas-managed/components/Navigation'
import Footer from '@/onesaas-managed/components/Footer'

interface ConditionalLayoutProps {
  children: ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()

  // DashboardLayout을 사용하는 경로들 (Navigation/Footer 숨김)
  const hideNavAndFooter = pathname?.startsWith('/dashboard') ||
                          pathname?.startsWith('/admin') ||
                          pathname?.startsWith('/service') ||
                          pathname === '/login' ||
                          pathname === '/signup'

  if (hideNavAndFooter) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
