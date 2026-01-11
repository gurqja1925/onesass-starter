import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/onesaas-managed/components/Navigation'
import Footer from '@/onesaas-managed/components/Footer'
import { AuthProvider } from '@/onesaas-core/auth/provider'
import { TemplateProvider } from '@/onesaas-core/templates/TemplateProvider'

// SEO 메타데이터 (환경 변수에서 읽음 - AI 생성 SEO 지원)
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'OneSaaS'
const seoTitle = process.env.NEXT_PUBLIC_SEO_TITLE || appName // AI 생성 SEO 타이틀
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || '클릭 몇 번으로 완성하는 SaaS'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: seoTitle,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  keywords: process.env.NEXT_PUBLIC_SEO_KEYWORDS?.split(',') || ['SaaS', '스타트업', '웹서비스'],
  authors: [{ name: process.env.NEXT_PUBLIC_COMPANY_NAME || appName }],
  creator: process.env.NEXT_PUBLIC_COMPANY_NAME || appName,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: appName,
    title: seoTitle,
    description: appDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoTitle,
    description: appDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
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
