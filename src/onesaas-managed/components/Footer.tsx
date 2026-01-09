import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                O
              </span>
              <span
                className="font-bold text-lg"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
              >
                OneSaaS
              </span>
            </Link>
            <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
              클릭 몇 번으로 완성하는 SaaS.
              결제, 인증, 관리자 페이지까지 모두 포함.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              서비스
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/showcase"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  쇼케이스
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  문서
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  대시보드
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              법적 고지
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            © {new Date().getFullYear()} OneSaaS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
