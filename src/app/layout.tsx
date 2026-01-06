import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/onesaas-managed/components/Navigation'
import Footer from '@/onesaas-managed/components/Footer'
import { AuthProvider } from '@/onesaas-core/auth/provider'
import { TemplateProvider } from '@/onesaas-core/templates/TemplateProvider'

export const metadata: Metadata = {
  title: 'OneSaaS App',
  description: 'Built with OneSaaS Starter Kit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <AuthProvider>
          <TemplateProvider>
            <Navigation />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
          </TemplateProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
