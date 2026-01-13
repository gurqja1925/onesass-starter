'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function SecurityGuidePage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* 뒤로가기 */}
        <Link
          href="/admin/guides"
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: 'var(--color-accent)' }}
        >
          ← 가이드 목록으로
        </Link>

        {/* 헤더 */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🔒</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                보안 가이드
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                서비스 보안을 강화하는 방법
              </p>
            </div>
          </div>
        </div>

        {/* 보안이 뭐예요? */}
        <Card>
          <CardHeader>
            <CardTitle>🤔 보안이 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p style={{ color: 'var(--color-text)' }}>
                <strong>보안</strong>은 나쁜 사람들로부터 우리 서비스를 <strong>지키는 것</strong>이에요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
                <p className="text-2xl mb-2">🦹</p>
                <p className="font-medium" style={{ color: '#991b1b' }}>해커가 노리는 것</p>
                <p className="text-sm" style={{ color: '#991b1b' }}>
                  비밀번호, 카드 정보,
                  <br />
                  개인정보 등
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-2xl mb-2">🛡️</p>
                <p className="font-medium" style={{ color: '#166534' }}>보안으로 지키면</p>
                <p className="text-sm" style={{ color: '#166534' }}>
                  사용자 정보 안전!
                  <br />
                  서비스 안정적 운영!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 관리자 계정 보안 */}
        <Card>
          <CardHeader>
            <CardTitle>👤 관리자 계정 보안</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              관리자 계정이 털리면 모든 게 끝나요! 꼭 지켜주세요:
            </p>

            <div className="space-y-4">
              {/* 규칙 1 */}
              <div className="flex gap-4 p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-3xl">1️⃣</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                    강력한 비밀번호 사용
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    최소 12자 이상, 대소문자 + 숫자 + 특수문자 조합
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="p-2 rounded" style={{ background: '#fef2f2' }}>
                      <p className="text-xs" style={{ color: '#991b1b' }}>❌ 나쁜 예: 1234, password</p>
                    </div>
                    <div className="p-2 rounded" style={{ background: '#dcfce7' }}>
                      <p className="text-xs" style={{ color: '#166534' }}>✅ 좋은 예: Ks8#mP2$xL9!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 규칙 2 */}
              <div className="flex gap-4 p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-3xl">2️⃣</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                    2단계 인증 사용 (2FA)
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    비밀번호만으로는 부족해요. 휴대폰 인증도 추가하세요!
                  </p>
                  <p className="mt-2 text-xs" style={{ color: 'var(--color-accent)' }}>
                    Supabase 대시보드 → Authentication → Settings에서 설정
                  </p>
                </div>
              </div>

              {/* 규칙 3 */}
              <div className="flex gap-4 p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-3xl">3️⃣</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                    관리자 이메일 제한
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    환경변수에서 관리자 이메일을 지정해요
                  </p>
                  <div className="mt-2 p-2 rounded font-mono text-xs" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                    NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API 키 보안 */}
        <Card>
          <CardHeader>
            <CardTitle>🔑 API 키 보안</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>⚠️ API 키가 유출되면?</strong>
                <br />
                해커가 내 서비스를 마음대로 사용할 수 있어요!
                <br />
                결제 키가 유출되면 돈을 잃을 수도 있어요! 😱
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>
              API 키 지키는 방법:
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>환경변수에만 저장</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>코드에 직접 쓰면 안 돼요!</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>GitHub에 올리지 않기</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>.env 파일은 .gitignore에 포함되어 있어요</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>NEXT_PUBLIC_ 주의</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>비밀 키에는 절대 NEXT_PUBLIC_를 붙이지 마세요!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 이미 적용된 보안 */}
        <Card>
          <CardHeader>
            <CardTitle>🛡️ 이미 적용된 보안 기능</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              걱정 마세요! 이 서비스에는 이미 많은 보안 기능이 적용되어 있어요:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>관리자 인증</p>
                <p className="text-sm" style={{ color: '#166534' }}>관리자 API는 인증 필수</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>요청 제한 (Rate Limit)</p>
                <p className="text-sm" style={{ color: '#166534' }}>분당 요청 수 제한</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>결제 검증</p>
                <p className="text-sm" style={{ color: '#166534' }}>금액 위조 방지</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>XSS 방지</p>
                <p className="text-sm" style={{ color: '#166534' }}>악성 스크립트 차단</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>HTTPS 암호화</p>
                <p className="text-sm" style={{ color: '#166534' }}>Vercel이 자동 적용</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>SQL 인젝션 방지</p>
                <p className="text-sm" style={{ color: '#166534' }}>Prisma가 자동 처리</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 체크리스트 */}
        <Card>
          <CardHeader>
            <CardTitle>📋 보안 체크리스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              서비스 운영 전 확인하세요:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>강력한 비밀번호 설정했나요?</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>환경변수가 Vercel에 제대로 설정되어 있나요?</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>.env 파일이 GitHub에 올라가지 않았나요?</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>관리자 이메일이 올바르게 설정되어 있나요?</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>HTTPS로 접속되나요? (주소창에 자물쇠 아이콘)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 해킹 당했을 때 */}
        <Card>
          <CardHeader>
            <CardTitle>🚨 해킹이 의심될 때</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
              <p style={{ color: '#991b1b' }}>
                이상한 일이 생겼다면 빠르게 대응하세요!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  1
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>
                    비밀번호 즉시 변경
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Supabase, GitHub, Vercel 모두 변경
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  2
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>
                    API 키 재발급
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    모든 API 키를 새로 발급받고 교체
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  3
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>
                    로그 확인
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Vercel Logs에서 이상한 접근 확인
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  4
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>
                    사용자 알림
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    필요시 사용자들에게 비밀번호 변경 안내
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides/environment"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 환경변수 가이드
          </Link>
          <Link
            href="/admin/guides/troubleshooting"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            다음: 문제 해결 가이드 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
