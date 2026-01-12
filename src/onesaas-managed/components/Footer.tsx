import Link from 'next/link'
import { getAppName, getAppDescription, getAppInitial, getCompanyName } from '@/lib/branding'

export default function Footer() {
  const appName = getAppName()
  const appInitial = getAppInitial()
  const appDescription = getAppDescription()
  const companyName = getCompanyName()

  // 사업자 정보 (환경 변수에서 읽음)
  const businessNumber = process.env.NEXT_PUBLIC_BUSINESS_NUMBER
  const ecommerceNumber = process.env.NEXT_PUBLIC_ECOMMERCE_NUMBER
  const representativeName = process.env.NEXT_PUBLIC_REPRESENTATIVE_NAME
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE
  const privacyOfficer = process.env.NEXT_PUBLIC_PRIVACY_OFFICER

  return (
    <footer style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              이용약관
            </Link>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <Link
              href="/privacy"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              개인정보처리방침
            </Link>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <Link
              href="/admin"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              관리자
            </Link>
          </div>

          {/* Business Info */}
          {(businessNumber || ecommerceNumber || representativeName) && (
            <div className="text-center text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {companyName && <span>{companyName}</span>}
                {representativeName && <span>대표: {representativeName}</span>}
                {businessNumber && <span>사업자등록번호: {businessNumber}</span>}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1">
                {ecommerceNumber && <span>통신판매업신고: {ecommerceNumber}</span>}
              </div>
              {businessAddress && (
                <div className="mt-1">
                  <span>주소: {businessAddress}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1">
                {contactPhone && <span>전화: {contactPhone}</span>}
                {contactEmail && <span>이메일: {contactEmail}</span>}
              </div>
              {privacyOfficer && (
                <div className="mt-1">
                  <span>개인정보보호책임자: {privacyOfficer}</span>
                </div>
              )}
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            © {new Date().getFullYear()} {companyName}
          </p>
        </div>
      </div>
    </footer>
  )
}
