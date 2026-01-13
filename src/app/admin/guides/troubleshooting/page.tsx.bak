'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function TroubleshootingGuidePage() {
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
            <span className="text-5xl">🔧</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                문제 해결 가이드
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                자주 발생하는 문제와 해결 방법
              </p>
            </div>
          </div>
        </div>

        {/* 안내 */}
        <Card style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
          <CardContent>
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#92400e' }}>
                  문제가 생겼나요?
                </h3>
                <p style={{ color: '#92400e' }}>
                  당황하지 마세요! 대부분의 문제는 간단히 해결할 수 있어요.
                  <br />
                  아래에서 비슷한 문제를 찾아보세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 빌드 실패 */}
        <Card>
          <CardHeader>
            <CardTitle>🚫 배포(빌드)가 실패해요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>증상:</strong> Vercel에서 &quot;Build Failed&quot; 메시지가 나와요
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>해결 방법:</h4>

            <div className="space-y-4">
              {/* 해결 1 */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    로컬에서 먼저 테스트하기
                  </p>
                </div>
                <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  pnpm build
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  이 명령어로 내 컴퓨터에서 먼저 빌드가 되는지 확인해요
                </p>
              </div>

              {/* 해결 2 */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    환경변수 확인하기
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Vercel 대시보드 → Settings → Environment Variables
                  <br />
                  모든 필수 환경변수가 설정되어 있는지 확인하세요
                </p>
              </div>

              {/* 해결 3 */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    에러 로그 확인하기
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Vercel 대시보드 → Deployments → 실패한 배포 클릭 → Build Logs
                  <br />
                  빨간색 에러 메시지를 확인하세요
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 페이지 로딩 안됨 */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 페이지가 로딩되지 않아요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>증상:</strong> 페이지가 계속 로딩 중이거나 하얀 화면만 나와요
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>해결 방법:</h4>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    브라우저 새로고침 (Ctrl+Shift+R 또는 Cmd+Shift+R)
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  캐시를 무시하고 새로 불러와요
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    개발자 도구 확인 (F12)
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Console 탭에서 빨간색 에러 메시지 확인
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    데이터베이스 연결 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Supabase 대시보드에서 프로젝트가 정상인지 확인
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 로그인 안됨 */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 로그인이 안 돼요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>증상:</strong> 로그인 버튼을 눌러도 아무 반응이 없거나 에러가 나요
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>해결 방법:</h4>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    Supabase URL/Key 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  환경변수에서 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY가 올바른지 확인
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    Redirect URL 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Supabase 대시보드 → Authentication → URL Configuration
                  <br />
                  Site URL에 본인 도메인이 있는지 확인
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    소셜 로그인 설정 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  구글/카카오 로그인 사용 시 해당 설정이 되어있는지 확인
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DB 연결 실패 */}
        <Card>
          <CardHeader>
            <CardTitle>🗄️ 데이터베이스 연결이 안 돼요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>증상:</strong> &quot;Cannot connect to database&quot; 에러가 나요
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>해결 방법:</h4>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    DATABASE_URL 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Supabase 대시보드 → Settings → Database → Connection string
                  <br />
                  &quot;URI&quot; 탭에서 복사해서 사용
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    비밀번호 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  DATABASE_URL에 포함된 비밀번호가 맞는지 확인
                  <br />
                  특수문자가 있다면 URL 인코딩 필요
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    프로젝트 상태 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Supabase 무료 플랜은 일정 기간 사용하지 않으면 일시정지돼요
                  <br />
                  대시보드에서 &quot;Resume project&quot; 클릭
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결제 오류 */}
        <Card>
          <CardHeader>
            <CardTitle>💳 결제가 안 돼요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>증상:</strong> 결제 버튼을 눌렀는데 결제창이 안 열리거나 에러가 나요
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>해결 방법:</h4>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    PortOne API 키 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  PORTONE_API_KEY와 PORTONE_API_SECRET이 올바른지 확인
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    테스트 모드 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  개발 중에는 테스트 키를 사용해야 해요
                  <br />
                  실서비스에서는 운영 키로 교체
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    PortOne 대시보드 확인
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  결제 수단(카드, 계좌이체 등)이 활성화되어 있는지 확인
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 캐시 문제 */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 변경사항이 반영되지 않아요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>증상:</strong> 코드를 수정했는데 웹사이트에 반영이 안 돼요
              </p>
            </div>

            <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>해결 방법:</h4>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    브라우저 캐시 삭제
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Ctrl+Shift+R (Windows) 또는 Cmd+Shift+R (Mac)
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    Vercel 강제 재배포
                  </p>
                </div>
                <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  vercel --force --prod
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    로컬 캐시 삭제 후 재빌드
                  </p>
                </div>
                <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  <p>rm -rf .next node_modules</p>
                  <p>pnpm install</p>
                  <p>pnpm build</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 긴급 연락처 */}
        <Card>
          <CardHeader>
            <CardTitle>📞 그래도 안 되면?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              위 방법으로도 해결이 안 되면 공식 문서를 참고하세요:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Vercel 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>배포 관련 문제</p>
              </a>
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Supabase 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>데이터베이스/인증 문제</p>
              </a>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Next.js 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>프레임워크 관련</p>
              </a>
              <a
                href="https://prisma.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Prisma 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>DB 스키마 관련</p>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides/security"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 보안 가이드
          </Link>
          <Link
            href="/admin/guides/commands"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            다음: 명령어 모음 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
