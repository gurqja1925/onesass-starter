'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function DatabaseGuidePage() {
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
            <span className="text-5xl">🗄️</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                데이터베이스 가이드
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Supabase와 Prisma로 데이터를 관리하는 방법
              </p>
            </div>
          </div>
        </div>

        {/* 데이터베이스가 뭐예요? */}
        <Card>
          <CardHeader>
            <CardTitle>🤔 데이터베이스가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p style={{ color: 'var(--color-text)' }}>
                <strong>데이터베이스</strong>는 정보를 저장하는 <strong>거대한 노트</strong>라고 생각하면 돼요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#dbeafe' }}>
                <p className="text-2xl mb-2">📒</p>
                <p className="font-medium" style={{ color: '#1e40af' }}>일반 노트</p>
                <p className="text-sm" style={{ color: '#1e40af' }}>직접 펜으로 기록</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-2xl mb-2">🗄️</p>
                <p className="font-medium" style={{ color: '#166534' }}>데이터베이스</p>
                <p className="text-sm" style={{ color: '#166534' }}>컴퓨터가 자동으로 기록</p>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)' }}>
              사용자 정보, 결제 내역, 글 내용 등 모든 정보가 여기에 저장돼요!
            </p>
          </CardContent>
        </Card>

        {/* Supabase */}
        <Card>
          <CardHeader>
            <CardTitle>💚 Supabase가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#10b981', color: 'white' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-xl">Supabase</span>
              </div>
              <p className="mt-2 text-sm opacity-90">
                쉽게 사용할 수 있는 데이터베이스 서비스
              </p>
            </div>

            <p style={{ color: 'var(--color-text)' }}>
              <strong>Supabase</strong>는 데이터베이스를 쉽게 관리할 수 있게 해주는 서비스예요.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-2xl">👁️</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>눈으로 볼 수 있어요</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>웹사이트에서 데이터를 직접 볼 수 있어요</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-2xl">✏️</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>직접 수정할 수 있어요</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>클릭 몇 번으로 데이터 수정 가능!</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-2xl">🔐</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>로그인 기능도 있어요</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>사용자 인증을 쉽게 처리!</p>
                </div>
              </div>
            </div>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg font-medium"
              style={{ background: '#10b981', color: 'white' }}
            >
              Supabase 대시보드 열기 →
            </a>
          </CardContent>
        </Card>

        {/* Supabase 사용법 */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Supabase에서 데이터 보기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {/* 단계 1 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    Supabase 대시보드 접속
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                      supabase.com/dashboard
                    </a>에 접속해서 로그인하세요
                  </p>
                </div>
              </div>

              {/* 단계 2 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    프로젝트 선택
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    본인의 프로젝트를 클릭하세요
                  </p>
                </div>
              </div>

              {/* 단계 3 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    Table Editor 클릭
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 메뉴에서 &quot;Table Editor&quot;를 클릭하면 모든 데이터를 볼 수 있어요!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <p style={{ color: '#92400e' }}>
                <strong>💡 팁:</strong> 여기서 사용자 정보, 결제 내역 등을 직접 확인하고 수정할 수 있어요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Supabase 자동 설정 (추천) */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Supabase 자동 설정 (추천)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg" style={{ background: '#dcfce7', border: '2px solid #22c55e' }}>
              <p style={{ color: '#166534' }}>
                <strong>🎉 가장 쉬운 방법!</strong> Access Token 하나로 모든 환경변수가 자동 설정됩니다.
              </p>
            </div>

            <div className="space-y-4">
              {/* 단계 1: Access Token 발급 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    Access Token 발급받기
                  </h4>
                  <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <a href="https://supabase.com/dashboard/account/tokens" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                        supabase.com/dashboard/account/tokens
                      </a> 접속
                      <br />
                      → &quot;Generate new token&quot; 클릭
                      <br />
                      → 토큰 이름 입력 (예: onesaas-setup)
                      <br />
                      → 생성된 토큰 복사 (sbp_로 시작)
                    </p>
                  </div>
                </div>
              </div>

              {/* 단계 2: pnpm setup 실행 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    설정 마법사 실행
                  </h4>
                  <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                    pnpm setup
                  </div>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    → &quot;Access Token으로 자동 설정&quot; 선택
                  </p>
                </div>
              </div>

              {/* 단계 3: 자동 설정 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    프로젝트 선택 & 비밀번호 입력
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    프로젝트 목록이 자동으로 표시되면 선택하고,
                    <br />
                    Supabase 프로젝트 생성 시 입력한 DB 비밀번호만 입력하면 끝!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                자동으로 설정되는 항목:
              </p>
              <ul className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <li>✅ DATABASE_URL (데이터베이스 연결 URL)</li>
                <li>✅ NEXT_PUBLIC_SUPABASE_URL (프로젝트 URL)</li>
                <li>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY (공개 API 키)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Supabase 환경변수 찾기 (수동) */}
        <Card>
          <CardHeader>
            <CardTitle>🔑 Supabase 환경변수 찾기 (수동 설정)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              자동 설정 대신 직접 환경변수를 입력하고 싶다면 아래 방법을 따라하세요.
              <br />
              총 <strong>3가지</strong> 정보가 필요해요!
            </p>

            {/* DATABASE_URL */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: '#10b981', color: 'white' }}>1</span>
                <code className="font-bold" style={{ color: 'var(--color-accent)' }}>DATABASE_URL</code>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>- 데이터베이스 연결 주소</span>
              </div>
              <div className="ml-6 space-y-2">
                <p style={{ color: 'var(--color-text)' }}>
                  <strong>찾는 위치:</strong>
                </p>
                <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 메뉴 <strong>&quot;Settings&quot;</strong> (톱니바퀴) 클릭
                    <br />
                    → <strong>&quot;Database&quot;</strong> 클릭
                    <br />
                    → 스크롤 내려서 <strong>&quot;Connection string&quot;</strong> 섹션
                    <br />
                    → <strong>&quot;URI&quot;</strong> 탭 선택
                    <br />
                    → 복사 버튼 클릭
                  </p>
                </div>
                <div className="p-3 rounded" style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}>
                  <p className="text-sm" style={{ color: '#92400e' }}>
                    <strong>⚠️ 주의!</strong> 복사한 URL에서 <code>[YOUR-PASSWORD]</code> 부분을
                    <br />
                    프로젝트 만들 때 입력한 <strong>실제 비밀번호</strong>로 바꿔야 해요!
                  </p>
                </div>
              </div>
            </div>

            {/* NEXT_PUBLIC_SUPABASE_URL */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: '#10b981', color: 'white' }}>2</span>
                <code className="font-bold" style={{ color: 'var(--color-accent)' }}>NEXT_PUBLIC_SUPABASE_URL</code>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>- 프로젝트 URL</span>
              </div>
              <div className="ml-6 space-y-2">
                <p style={{ color: 'var(--color-text)' }}>
                  <strong>찾는 위치:</strong>
                </p>
                <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 메뉴 <strong>&quot;Settings&quot;</strong> (톱니바퀴) 클릭
                    <br />
                    → <strong>&quot;API&quot;</strong> 클릭
                    <br />
                    → <strong>&quot;Project URL&quot;</strong> 섹션
                    <br />
                    → 복사 버튼 클릭
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  형식: <code>https://xxxxxxxxxxxx.supabase.co</code>
                </p>
              </div>
            </div>

            {/* NEXT_PUBLIC_SUPABASE_ANON_KEY */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: '#10b981', color: 'white' }}>3</span>
                <code className="font-bold" style={{ color: 'var(--color-accent)' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>- 공개 API 키</span>
              </div>
              <div className="ml-6 space-y-2">
                <p style={{ color: 'var(--color-text)' }}>
                  <strong>찾는 위치:</strong>
                </p>
                <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 메뉴 <strong>&quot;Settings&quot;</strong> (톱니바퀴) 클릭
                    <br />
                    → <strong>&quot;API&quot;</strong> 클릭
                    <br />
                    → <strong>&quot;Project API keys&quot;</strong> 섹션
                    <br />
                    → <strong>&quot;anon public&quot;</strong> 옆의 복사 버튼 클릭
                  </p>
                </div>
                <div className="p-3 rounded" style={{ background: '#dbeafe', border: '1px solid #3b82f6' }}>
                  <p className="text-sm" style={{ color: '#1e40af' }}>
                    <strong>💡 팁:</strong> &quot;service_role&quot;은 비밀 키라서 쓰면 안 돼요!
                    <br />
                    꼭 <strong>&quot;anon public&quot;</strong>을 복사하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 예시 */}
            <div className="p-4 rounded-lg" style={{ background: '#1e1e1e' }}>
              <p className="font-bold mb-3" style={{ color: '#d4d4d4' }}>
                .env 파일 예시:
              </p>
              <pre className="font-mono text-sm" style={{ color: '#d4d4d4' }}>
{`DATABASE_URL="postgresql://postgres:내비밀번호@db.xxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:내비밀번호@db.xxx.supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi...긴문자열"`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Prisma */}
        <Card>
          <CardHeader>
            <CardTitle>🔷 Prisma가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#1e1e1e', color: 'white' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">◇</span>
                <span className="font-bold text-xl">Prisma</span>
              </div>
              <p className="mt-2 text-sm opacity-80">
                코드로 데이터베이스를 다루는 도구
              </p>
            </div>

            <p style={{ color: 'var(--color-text)' }}>
              <strong>Prisma</strong>는 코드에서 데이터베이스를 쉽게 사용할 수 있게 해주는 도구예요.
            </p>

            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                예를 들어, 모든 사용자를 가져오려면:
              </p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                <span style={{ color: '#c586c0' }}>const</span>{' '}
                <span style={{ color: '#9cdcfe' }}>users</span> ={' '}
                <span style={{ color: '#c586c0' }}>await</span>{' '}
                <span style={{ color: '#9cdcfe' }}>prisma</span>.
                <span style={{ color: '#dcdcaa' }}>user</span>.
                <span style={{ color: '#dcdcaa' }}>findMany</span>()
              </div>
              <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                이렇게 간단하게 모든 사용자 데이터를 가져올 수 있어요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prisma Studio */}
        <Card>
          <CardHeader>
            <CardTitle>🖥️ Prisma Studio로 데이터 보기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Prisma Studio는 데이터를 눈으로 볼 수 있는 도구예요.
              <br />
              컴퓨터에서 바로 실행할 수 있어요!
            </p>

            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                터미널에서 이 명령어 입력:
              </p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                npx prisma studio
              </div>
              <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                브라우저가 열리면서 모든 데이터를 볼 수 있어요! 🎉
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#dbeafe' }}>
              <p style={{ color: '#1e40af' }}>
                <strong>💡 이렇게 하면:</strong>
                <br />
                - User (사용자) 테이블
                <br />
                - Payment (결제) 테이블
                <br />
                - Subscription (구독) 테이블
                <br />
                등 모든 데이터를 볼 수 있어요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 데이터 백업 */}
        <Card>
          <CardHeader>
            <CardTitle>💾 데이터 백업하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>⚠️ 중요!</strong> 데이터는 소중해요. 정기적으로 백업하세요!
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Supabase 자동 백업 (Pro 플랜)
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Settings → Database → Backups에서 확인
                  <br />
                  매일 자동으로 백업돼요!
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  수동 백업 방법
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Supabase 대시보드 → SQL Editor에서:
                </p>
                <div className="p-3 rounded font-mono text-sm mt-2" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  pg_dump -h db.xxx.supabase.co -U postgres
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides/deployment"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 배포 가이드
          </Link>
          <Link
            href="/admin/guides/environment"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            다음: 환경변수 가이드 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
