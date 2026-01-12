'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/onesaas-managed/components/Navigation'
import Footer from '@/onesaas-managed/components/Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Navigation과 Footer를 표시하지 않을 경로들
  const hideNavAndFooter =
    pathname?.startsWith('/service') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/reset-password'

  if (hideNavAndFooter) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
